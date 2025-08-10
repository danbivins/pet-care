"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/Skeleton";
import { CategoryPills, type CategoryKey } from "@/components/CategoryPills";
import { MapView } from "@/components/MapView";

export default function Home() {
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
    try {
      const res = await fetch(`/api/facilities?${params.toString()}`);
      if (!res.ok) {
        const msg = await res.text();
        setError(`Error: ${res.status} ${msg}`);
        setFacilities([]);
      } else {
        const data = await res.json();
        setFacilities(Array.isArray(data) ? data : []);
      }
    } catch (e) {
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
      <section className="mx-auto max-w-5xl px-4 pt-16 pb-10">
        <h1 className="text-5xl font-extrabold tracking-tight leading-tight mb-4">
          Discover gyms, studios, and fitness centers
        </h1>
        <p className="text-neutral-600 mb-8">
          Search fitness facilities by city using Google Places. Find gyms, yoga studios, CrossFit, pilates, martial arts and more.
        </p>
        <div className="flex gap-2 items-end flex-wrap">
          <div className="flex flex-col">
            <label className="text-sm text-neutral-600">City</label>
            <input
              aria-label="City"
              className="border rounded-md px-3 py-2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Austin"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-neutral-600">State</label>
            <input
              aria-label="State"
              className="border rounded-md px-3 py-2 w-24"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="TX"
              maxLength={2}
            />
          </div>
          <button
            onClick={search}
            className="h-10 px-4 rounded-md bg-black text-white font-medium"
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
          <label className="flex items-center gap-2">Sort
            <select className="border rounded px-2 py-1" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="rating">Rating</option>
              <option value="distance">Distance</option>
            </select>
          </label>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20">
        {error && (
          <div role="alert" className="mb-4 text-red-700">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        )}
        {!isLoading && facilities.length > 0 && (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilities.map((v) => (
              <li key={v.id} className="border rounded-lg p-4 hover:shadow-sm">
                <h3 className="font-semibold text-lg">{v.name}</h3>
                <p className="text-sm text-neutral-600">{v.address}</p>
                <div className="mt-3">
                  <Link
                    className="text-blue-600 hover:underline"
                    href={`/facilities/${encodeURIComponent(v.id)}`}
                  >
                    View details
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
        {!isLoading && facilities.length > 0 && (
          <div className="mt-8">
            <MapView facilities={facilities} />
          </div>
        )}
      </section>
    </main>
  );
}
