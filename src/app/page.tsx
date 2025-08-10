"use client";
import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/Skeleton";
import { CategoryPills, type CategoryKey } from "@/components/CategoryPills";
import { MapView } from "@/components/MapView";
import { analytics } from "@/components/Analytics";
import Hero from "@/components/Hero";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [facilities, setFacilities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCats, setSelectedCats] = useState<Set<CategoryKey>>(new Set());
  const [openNow, setOpenNow] = useState(false);
  const [hasPool, setHasPool] = useState(false);
  const [is24h, setIs24h] = useState(false);
  const [sort, setSort] = useState("rating");

  // Initialize state from URL params on mount
  useEffect(() => {
    const cityParam = searchParams.get("city");
    const stateParam = searchParams.get("state");
    const categoriesParam = searchParams.get("categories");
    const openNowParam = searchParams.get("openNow");
    const hasPoolParam = searchParams.get("hasPool");
    const is24hParam = searchParams.get("is24h");
    const sortParam = searchParams.get("sort");

    if (cityParam) setCity(cityParam);
    if (stateParam) setState(stateParam);
    if (categoriesParam) {
      const cats = categoriesParam.split(",") as CategoryKey[];
      setSelectedCats(new Set(cats));
    }
    if (openNowParam) setOpenNow(openNowParam === "1");
    if (hasPoolParam) setHasPool(hasPoolParam === "1");
    if (is24hParam) setIs24h(is24hParam === "1");
    if (sortParam) setSort(sortParam);
  }, [searchParams]);

  async function search() {
    if (!city && !state) return;
    setIsLoading(true);
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (state) params.set("state", state);
    if (selectedCats.size > 0) params.set("categories", Array.from(selectedCats).join(","));
    if (openNow) params.set("openNow", "1");
    if (hasPool) params.set("hasPool", "1");
    if (is24h) params.set("is24h", "1");
    if (sort) params.set("sort", sort);
    
    // Update URL with search parameters
    router.push(`/?${params.toString()}`, { scroll: false });
    
    try {
      const res = await fetch(`/api/facilities?${params.toString()}`);
      if (!res.ok) {
        const msg = await res.text();
        setError(`Error: ${res.status} ${msg}`);
        setFacilities([]);
      } else {
        const data = await res.json();
        setFacilities(Array.isArray(data) ? data : []);
        
        // Track successful search
        analytics.trackSearch(city, state, Array.from(selectedCats));
      }
    } catch {
      setError("Network error. Check API keys and server logs.");
    }
    setIsLoading(false);
  }

  // Debounce search on input
  const debounceKey = useMemo(
    () => `${city}-${state}-${Array.from(selectedCats).sort().join("|")}-${openNow}-${hasPool}-${is24h}-${sort}`.trim(),
    [city, state, selectedCats, openNow, hasPool, is24h, sort]
  );
  useEffect(() => {
    if (!city && !state) return;
    setError(null);
    const t = setTimeout(() => search(), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceKey]);

  return (
    <main className="min-h-screen bg-white text-black">
      <Hero>
        <div className="flex gap-3 items-end flex-wrap">
          <div className="flex flex-col">
            <label className="text-sm text-black">City</label>
            <input
              aria-label="City"
              className="input focus:outline-brand"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Austin"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-black">State</label>
            <input
              aria-label="State"
              className="input w-24 focus:outline-brand"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="TX"
              maxLength={2}
            />
          </div>
          <button
            onClick={search}
            className="h-12 px-6 rounded-xl bg-[#023e8a] hover:bg-[#032d66] text-white font-semibold shadow-sm"
          >
            Search
          </button>
        </div>
        <div className="mt-4">
          <CategoryPills
            selected={selectedCats}
            onToggle={(key) => {
              const next = new Set(selectedCats);
              if (next.has(key)) next.delete(key);
              else next.add(key);
              setSelectedCats(next);
            }}
          />
        </div>
        <div className="mt-4 flex gap-4 items-center flex-wrap text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={openNow} onChange={(e) => setOpenNow(e.target.checked)} /> Open now</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={hasPool} onChange={(e) => setHasPool(e.target.checked)} /> Has pool</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={is24h} onChange={(e) => setIs24h(e.target.checked)} /> 24/7</label>
        </div>
      </Hero>

      <section className="mx-auto max-w-6xl px-4 pb-24 mt-12">
        {error && (
          <div role="alert" className="mb-4 text-red-700">
            {error}
          </div>
        )}
        {!isLoading && facilities.length > 0 && (
          <div className="mb-4 text-sm flex items-center gap-4">
            <label className="text-neutral-700">Sort</label>
            <select className="border rounded px-2 py-1" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="rating">Rating</option>
              <option value="distance">Distance</option>
            </select>
            <button
              className="px-3 py-1 rounded border bg-white hover:bg-neutral-50 no-underline"
              onClick={() => {
                analytics.trackMapInteraction("open_modal");
                const dialog = document.getElementById("map-modal") as HTMLDialogElement | null;
                if (dialog) dialog.showModal();
              }}
            >
              Show map
            </button>
          </div>
        )}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          </div>
        )}
        {!isLoading && facilities.length > 0 && (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((v) => {
              const nameId = `facility-${v.id}`;
              return (
              <li key={v.id} className="card p-5 hover:shadow-sm transition-shadow bg-white">
                <div className="flex items-start justify-between">
                  <h3 id={nameId} className="font-semibold text-xl leading-tight">{v.name}</h3>
                </div>
                <p className="text-sm text-neutral-600 mt-1">{v.address}</p>
                <div className="mt-3">
                  <Link
                    className="text-blue-600"
                    href={`/facilities/${encodeURIComponent(v.id)}`}
                    aria-describedby={nameId}
                  >
                    View details
                  </Link>
                </div>
              </li>
            );})}
          </ul>
        )}
        {!isLoading && facilities.length > 0 && (
          <div className="mt-12">
            <MapView facilities={facilities} />
          </div>
        )}
        {/* Full-screen map dialog */}
        <dialog id="map-modal" className="backdrop:bg-black/40 rounded-lg p-0">
          <div className="w-[90vw] h-[80vh] max-w-6xl bg-white rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b">
              <h2 className="font-semibold">Map view</h2>
              <button onClick={() => (document.getElementById('map-modal') as HTMLDialogElement).close()} className="px-2 py-1 rounded border">Close</button>
            </div>
            <div className="p-4">
              <MapView facilities={facilities} />
            </div>
          </div>
        </dialog>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
