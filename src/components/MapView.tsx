"use client";
import { useEffect, useRef, useState } from "react";

type Facility = {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
};

export function MapView({ facilities }: { facilities: Facility[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function initMap() {
      if (!mapRef.current) return;
      
      const valid = facilities.filter((f) => typeof f.latitude === "number" && typeof f.longitude === "number");
      if (valid.length === 0) {
        setMapError("No location data available");
        setIsLoading(false);
        return;
      }
      
      try {
        // Get API key from our server-side API
        const response = await fetch(`/api/google-maps?lat=${valid[0].latitude}&lng=${valid[0].longitude}`);
        if (!response.ok) throw new Error('Failed to get map configuration');
        const config = await response.json();

        // Load Google Maps if not already loaded
        if (!(window as any).google?.maps) {
          await new Promise<void>((resolve, reject) => {
            // Clean up any existing callback
            const existingCallback = (window as any).initGoogleMapsCallback;
            
            // Create new callback
            (window as any).initGoogleMapsCallback = () => {
              if (existingCallback) {
                (window as any).initGoogleMapsCallback = existingCallback;
              } else {
                delete (window as any).initGoogleMapsCallback;
              }
              resolve();
            };

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${config.apiKey}&libraries=places&callback=initGoogleMapsCallback`;
            script.async = true;
            script.defer = true;
            script.onerror = () => reject(new Error('Failed to load Google Maps'));
            document.head.appendChild(script);
          });
        }

        // Only proceed if component is still mounted
        if (!isMounted || !mapRef.current) return;

        // Initialize map
        const center = { lat: valid[0].latitude as number, lng: valid[0].longitude as number };
        const map = new (window as any).google.maps.Map(mapRef.current, {
          center,
          zoom: 11,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        // Add markers
        valid.forEach((f) => {
          new (window as any).google.maps.Marker({
            position: { lat: f.latitude as number, lng: f.longitude as number },
            map,
            title: f.name,
          });
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize map:", error);
        if (isMounted) {
          setMapError("Unable to load map");
          setIsLoading(false);
        }
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [facilities]);

  if (mapError) {
    return (
      <div className="w-full h-80 rounded-md border bg-gray-50 flex items-center justify-center text-gray-500">
        {mapError}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-80 rounded-md border bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading map...</div>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-80 rounded-md border" />;
}