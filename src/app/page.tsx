"use client";
import dynamic from 'next/dynamic';
import { useCallback, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CategoryPills, type CategoryKey } from "@/components/CategoryPills";
import Hero from "@/components/Hero";
import Skeleton from "@/components/Skeleton";
import { analytics } from "@/components/Analytics";
import Link from "next/link";

// Dynamic imports to reduce main thread work
const MapView = dynamic(() => import("@/components/MapView").then(mod => ({ default: mod.MapView })), {
  loading: () => <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />,
  ssr: false
});

function PetCareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [petServices, setPetServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
  const [openNow, setOpenNow] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [acceptsInsurance, setAcceptsInsurance] = useState(false);
  const [sort, setSort] = useState("rating");
  const [validationErrors, setValidationErrors] = useState<{city?: string; state?: string}>({});
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Calculate total selected filters
  const getSelectedFilterCount = useCallback(() => {
    let count = 0;
    if (selectedCats.size > 0) count += selectedCats.size;
    if (openNow) count += 1;
    if (emergency) count += 1;
    if (acceptsInsurance) count += 1;
    return count;
  }, [selectedCats, openNow, emergency, acceptsInsurance]);

  const selectedFilterCount = getSelectedFilterCount();

  // Focus management for modal accessibility
  useEffect(() => {
    if (showFiltersModal) {
      // Store the element that had focus before modal opened
      const previouslyFocusedElement = document.activeElement as HTMLElement;
      
      // Focus the first focusable element in the modal
      const modal = document.querySelector('[role="dialog"]') as HTMLElement;
      const firstFocusableElement = modal?.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
      
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
      
      // Store for restoration when modal closes
      return () => {
        if (previouslyFocusedElement) {
          previouslyFocusedElement.focus();
        }
      };
    }
  }, [showFiltersModal]);

  // Keyboard trap for modal accessibility
  useEffect(() => {
    if (!showFiltersModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        const modal = document.querySelector('[role="dialog"]') as HTMLElement;
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
          'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          // Shift + Tab: going backwards
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: going forwards
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      } else if (event.key === 'Escape') {
        setShowFiltersModal(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showFiltersModal]);

  // Function to remove individual filters
  const removeFilter = useCallback((type: string, value?: string) => {
    switch (type) {
      case 'category':
        if (value) {
          const next = new Set(selectedCats);
          next.delete(value);
          setSelectedCats(next);
        }
        break;
      case 'openNow':
        setOpenNow(false);
        break;
      case 'emergency':
        setEmergency(false);
        break;
      case 'acceptsInsurance':
        setAcceptsInsurance(false);
        break;
    }
  }, [selectedCats]);

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
      const cats = categoriesParam.split(",") as string[];
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
        <div className="flex gap-3 items-end flex-wrap mb-8">
          <div className="flex flex-col">
            <label className="text-sm text-black font-bold" htmlFor="cityInput">City</label>
            <input
              id="cityInput"
              className={`input focus:outline-brand ${validationErrors.city ? 'border-red-500 focus:outline-red-500' : ''}`}
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                if (validationErrors.city) {
                  setValidationErrors(prev => ({...prev, city: undefined}));
                }
              }}
              aria-invalid={!!validationErrors.city}
              aria-describedby={validationErrors.city ? "city-error" : undefined}
              tabIndex={showFiltersModal ? -1 : 0}
            />
            {validationErrors.city && (
              <span id="city-error" className="text-red-600 text-sm mt-1" role="alert">
                {validationErrors.city}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-black font-bold" htmlFor="stateInput">State</label>
            <input
              className={`input w-24 focus:outline-brand ${validationErrors.state ? 'border-red-500 focus:outline-red-500' : ''}`}
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                if (validationErrors.state) {
                  setValidationErrors(prev => ({...prev, state: undefined}));
                }
              }}
              id="stateInput"
              maxLength={2}
              aria-invalid={!!validationErrors.state}
              aria-describedby={validationErrors.state ? "state-error" : undefined}
              tabIndex={showFiltersModal ? -1 : 0}
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
            tabIndex={showFiltersModal ? -1 : 0}
          >
            Search Pet Services
          </button>
          <div id="search-description" className="sr-only">
            Search for pet care services in the specified city and state
          </div>
        </div>
      </Hero>

      <section className="mx-auto max-w-6xl px-4 pb-24 mt-12">
        {error && (
          <div role="alert" className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        {!isLoading && petServices.length > 0 && (
          <div className="mb-4 text-sm flex items-center gap-6">
            <label className="text-neutral-700">Sort by</label>
            <select 
              className="border rounded px-2 py-1" 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort results"
              tabIndex={showFiltersModal ? -1 : 0}
            >
              <option value="rating">Rating</option>
              <option value="distance">Distance</option>
            </select>
            
            {/* Filters Button */}
            <button
              onClick={() => setShowFiltersModal(true)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-black font-medium flex items-center gap-2 transition-colors relative"
              aria-describedby="filters-button-description"
              tabIndex={showFiltersModal ? -1 : 0}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {selectedFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {selectedFilterCount}
                </span>
              )}
            </button>
            <span id="filters-button-description" className="sr-only">Open filter options to narrow search results</span>
            
            {/* Filter Chips - Show on desktop when ≤3 filters, always show number on mobile */}
            {selectedFilterCount > 0 && (
              <div className="hidden md:flex items-center gap-2 ml-4">
                {/* Show individual chips only on desktop when ≤3 filters */}
                {selectedFilterCount <= 3 && (
                  <>
                    {/* Category chips */}
                    {Array.from(selectedCats).map((category) => (
                      <button
                        key={`category-${category}`}
                        onClick={() => removeFilter('category', category)}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
                        aria-label={`Remove ${category} filter`}
                        tabIndex={showFiltersModal ? -1 : 0}
                      >
                        {category.replace(/_/g, ' ')}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    ))}
                    
                    {/* Amenity chips */}
                    {openNow && (
                      <button
                        onClick={() => removeFilter('openNow')}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
                        aria-label="Remove open now filter"
                        tabIndex={showFiltersModal ? -1 : 0}
                      >
                        Open now
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    
                    {emergency && (
                      <button
                        onClick={() => removeFilter('emergency')}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
                        aria-label="Remove emergency services filter"
                        tabIndex={showFiltersModal ? -1 : 0}
                      >
                        Emergency services
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    
                    {acceptsInsurance && (
                      <button
                        onClick={() => removeFilter('acceptsInsurance')}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
                        aria-label="Remove accepts insurance filter"
                        tabIndex={showFiltersModal ? -1 : 0}
                      >
                        Accepts insurance
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
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
          <>
            {/* Map View 
            {petServices.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-black mb-4">Map View</h2>
                <MapView facilities={petServices} />
              </div>
            )}
            */}

            {/* Results List */}
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
                        <Link
                        className="listing-result-title"
                        href={`/pet-services/${encodeURIComponent(service.id)}`}
                        >
                        <h3 id={nameId} className="font-semibold text-xl leading-tight">{service.name}</h3>
                        </Link>
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
                        tabIndex={showFiltersModal ? -1 : 0}
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
          </>
        )}
        {!isLoading && petServices.length === 0 && city && state && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">No pet services found in {city}, {state}</p>
            <p className="text-sm text-gray-500">Try adjusting your search criteria or location</p>
          </div>
        )}
        {/* Full-screen map dialog
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
         */}
        
        {/* Filter Modal */}
        {showFiltersModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowFiltersModal(false)}
            role="presentation"
            aria-hidden="true"
          >
            <div 
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="filter-modal-title"
              aria-describedby="filter-modal-description"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 id="filter-modal-title" className="text-xl font-bold text-black">Refine your search</h2>
                <button
                  onClick={() => setShowFiltersModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close filter modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div id="filter-modal-description" className="sr-only">
                Filter options for pet care services including service categories and amenities
              </div>
              
              <div className="space-y-6">
                {/* Category Section */}
                <div>
                  <h3 className="font-semibold text-black mb-3">Category</h3>
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
                
                {/* Amenity Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-black">Amenity</h3>
                  
                  <label className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={openNow} 
                      onChange={(e) => setOpenNow(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-black">Open now</span>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={emergency} 
                      onChange={(e) => setEmergency(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-black">Emergency services</span>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={acceptsInsurance} 
                      onChange={(e) => setAcceptsInsurance(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-black">Accepts insurance</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  onClick={() => {
                    setShowFiltersModal(false);
                    search(); // Re-run search with new filters
                  }}
                  className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
                >
                  Apply filters
                </button>
              </div>
            </div>
          </div>
        )}
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
