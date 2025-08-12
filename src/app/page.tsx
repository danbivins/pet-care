"use client";
import { useEffect, useState, Suspense, lazy, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/Skeleton";
import { CategoryPills, type CategoryKey } from "@/components/CategoryPills";
import { analytics } from "@/components/Analytics";
import Hero from "@/components/Hero";

// Lazy load heavy components
const MapView = lazy(() => import("@/components/MapView").then(mod => ({ default: mod.MapView })));

function PetCareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [petServices, setPetServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCats, setSelectedCats] = useState<Set<CategoryKey>>(new Set());
  const [openNow, setOpenNow] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [acceptsInsurance, setAcceptsInsurance] = useState(false);
  const [sort, setSort] = useState("rating");
  const [validationErrors, setValidationErrors] = useState<{city?: string; state?: string}>({});

  // Initialize state from URL params on mount
  useEffect(() => {
    const cityParam = searchParams.get("city");
    const stateParam = searchParams.get("state");
    const categoriesParam = searchParams.get("categories");
    const openNowParam = searchParams.get("openNow");
    const emergencyParam = searchParams.get("emergency");
    const insuranceParam = searchParams.get("acceptsInsurance");
    const sortParam = searchParams.get("sort");

    if (cityParam) setCity(cityParam);
    if (stateParam) setState(stateParam);
    if (categoriesParam) {
      const cats = categoriesParam.split(",") as CategoryKey[];
      setSelectedCats(new Set(cats));
    }
    if (openNowParam) setOpenNow(openNowParam === "1");
    if (emergencyParam) setEmergency(emergencyParam === "1");
    if (insuranceParam) setAcceptsInsurance(insuranceParam === "1");
    if (sortParam) setSort(sortParam);
  }, [searchParams]);

  const validateInputs = useCallback(() => {
    const errors: {city?: string; state?: string} = {};
    
    if (!city.trim()) {
      errors.city = "Please enter a city name";
    } else if (city.trim().length < 2) {
      errors.city = "City name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s\-'\.]+$/.test(city.trim())) {
      errors.city = "Please enter a valid city name";
    }
    
    if (!state.trim()) {
      errors.state = "Please enter a state";
    } else if (state.trim().length === 2 && !/^[A-Za-z]{2}$/.test(state.trim())) {
      errors.state = "Please enter a valid 2-letter state code (e.g., TX, CA)";
    } else if (state.trim().length > 2 && !/^[a-zA-Z\s]+$/.test(state.trim())) {
      errors.state = "Please enter a valid state name";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [city, state]);

  const search = useCallback(async () => {
    setError(null);
    
    if (!validateInputs()) {
      return;
    }
    
    setIsLoading(true);
    const params = new URLSearchParams();
    if (city) params.set("city", city.trim());
    if (state) params.set("state", state.trim());
    if (selectedCats.size > 0) params.set("categories", Array.from(selectedCats).join(","));
    if (openNow) params.set("openNow", "1");
    if (emergency) params.set("emergency", "1");
    if (acceptsInsurance) params.set("acceptsInsurance", "1");
    if (sort) params.set("sort", sort);
    
    router.push(`/?${params.toString()}`, { scroll: false });
    
    try {
      const res = await fetch(`/api/pet-services?${params.toString()}`);
      if (!res.ok) {
        const msg = await res.text();
        setError(`Error: ${res.status} ${msg}`);
        setPetServices([]);
      } else {
        const data = await res.json();
        setPetServices(Array.isArray(data) ? data : []);
        
        // Track successful search
        analytics.trackSearch(city.trim(), state.trim(), Array.from(selectedCats));
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setIsLoading(false);
  }, [city, state, selectedCats, openNow, emergency, acceptsInsurance, sort, router, validateInputs]);

  // Auto-search when URL params are present
  useEffect(() => {
    const cityParam = searchParams.get("city");
    const stateParam = searchParams.get("state");
    
    if (cityParam && stateParam && city === cityParam && state === stateParam) {
      search();
    }
  }, [city, state, selectedCats, openNow, emergency, acceptsInsurance, sort, search, searchParams]);

  function getServiceTypeIcon(types: string[]) {
    if (types.includes('veterinary_care')) return '🏥';
    if (types.includes('pet_store')) return '🛍️';
    return '🐾';
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Hero>
        <div className="flex gap-3 items-end flex-wrap">
          <div className="flex flex-col">
            <label className="text-sm text-black">City</label>
            <input
              aria-label="City"
              className={`input focus:outline-brand ${validationErrors.city ? 'border-red-500 focus:outline-red-500' : ''}`}
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                if (validationErrors.city) {
                  setValidationErrors(prev => ({...prev, city: undefined}));
                }
              }}
              placeholder="Austin"
              aria-invalid={!!validationErrors.city}
              aria-describedby={validationErrors.city ? "city-error" : undefined}
            />
            {validationErrors.city && (
              <span id="city-error" className="text-red-600 text-sm mt-1" role="alert">
                {validationErrors.city}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-black">State</label>
            <input
              aria-label="State"
              className={`input w-24 focus:outline-brand ${validationErrors.state ? 'border-red-500 focus:outline-red-500' : ''}`}
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                if (validationErrors.state) {
                  setValidationErrors(prev => ({...prev, state: undefined}));
                }
              }}
              placeholder="TX"
              maxLength={2}
              aria-invalid={!!validationErrors.state}
              aria-describedby={validationErrors.state ? "state-error" : undefined}
            />
            {validationErrors.state && (
              <span id="state-error" className="text-red-600 text-sm mt-1" role="alert">
                {validationErrors.state}
              </span>
            )}
          </div>
          <button
            onClick={search}
            className="h-12 px-6 rounded-xl bg-[#023e8a] hover:bg-[#032d66] text-white font-semibold shadow-sm"
            aria-describedby="search-description"
          >
            Search Pet Services
          </button>
          <div id="search-description" className="sr-only">
            Search for pet care services in the specified city and state
          </div>
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
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={openNow} 
              onChange={(e) => setOpenNow(e.target.checked)}
              aria-describedby="open-now-description" 
            />
            Open now
            <span id="open-now-description" className="sr-only">Show only services currently open</span>
          </label>
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={emergency} 
              onChange={(e) => setEmergency(e.target.checked)}
              aria-describedby="emergency-description"
            />
            Emergency services
            <span id="emergency-description" className="sr-only">Show services that offer emergency care</span>
          </label>
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={acceptsInsurance} 
              onChange={(e) => setAcceptsInsurance(e.target.checked)}
              aria-describedby="insurance-description"
            />
            Accepts insurance
            <span id="insurance-description" className="sr-only">Show services that accept pet insurance</span>
          </label>
        </div>
      </Hero>

      <section className="mx-auto max-w-6xl px-4 pb-24 mt-12">
        {error && (
          <div role="alert" className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        {!isLoading && petServices.length > 0 && (
          <div className="mb-4 text-sm flex items-center gap-4">
            <label className="text-neutral-700">Sort by</label>
            <select 
              className="border rounded px-2 py-1" 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort results"
            >
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
              aria-describedby="map-button-description"
            >
              Show map
            </button>
            <span id="map-button-description" className="sr-only">Open map view of pet services</span>
          </div>
        )}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Loading pet services">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          </div>
        )}
        {!isLoading && petServices.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Pet Care Services Found ({petServices.length})</h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {petServices.map((service) => {
                const nameId = `service-${service.id}`;
                return (
                <li key={service.id} className="card p-5 hover:shadow-lg transition-shadow bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl" aria-hidden="true">
                        {getServiceTypeIcon(service.types)}
                      </span>
                      <h3 id={nameId} className="font-semibold text-xl leading-tight">{service.name}</h3>
                    </div>
                    {service.rating && (
                      <div className="flex items-center gap-1 text-sm" aria-label={`Rating: ${service.rating} out of 5 stars`}>
                        <span className="text-yellow-500" aria-hidden="true">★</span>
                        <span className="font-medium">{service.rating}</span>
                      </div>
                    )}
                  </div>
                  <address className="text-sm text-neutral-600 mb-3 not-italic">
                    {service.address}
                  </address>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {service.types.slice(0, 3).map((type: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link
                      className="text-blue-600 hover:text-blue-800 font-medium"
                      href={`/pet-services/${encodeURIComponent(service.id)}`}
                      aria-describedby={nameId}
                    >
                      View details
                    </Link>
                    {service.openNow && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Open now
                      </span>
                    )}
                  </div>
                </li>
              );})}
            </ul>
          </div>
        )}
        {!isLoading && petServices.length === 0 && city && state && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">No pet services found in {city}, {state}</p>
            <p className="text-sm text-gray-500">Try adjusting your search criteria or location</p>
          </div>
        )}
        {!isLoading && petServices.length > 0 && (
          <div className="mt-12">
            <Suspense fallback={<div className="h-96 bg-gray-100 rounded-lg animate-pulse" />}>
              <MapView facilities={petServices} />
            </Suspense>
          </div>
        )}
        {/* Full-screen map dialog */}
        <dialog id="map-modal" className="backdrop:bg-black/40 rounded-lg p-0" aria-labelledby="map-modal-title">
          <div className="w-[90vw] h-[80vh] max-w-6xl bg-white rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b">
              <h2 id="map-modal-title" className="font-semibold">Map view of pet services</h2>
              <button 
                onClick={() => (document.getElementById('map-modal') as HTMLDialogElement).close()} 
                className="px-2 py-1 rounded border hover:bg-gray-50"
                aria-label="Close map view"
              >
                Close
              </button>
            </div>
            <div className="p-4">
              <MapView facilities={petServices} />
            </div>
          </div>
        </dialog>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading pet care directory...</div>
      </div>
    }>
      <PetCareContent />
    </Suspense>
  );
}