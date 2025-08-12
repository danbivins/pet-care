"use client";
import { useEffect, useRef } from "react";

type Facility = {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
};

export function MapView({ facilities }: { facilities: Facility[] }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    initMap();

    async function initMap() {
      const valid = facilities.filter((f) => typeof f.latitude === "number" && typeof f.longitude === "number");
      if (valid.length === 0) return;
      
      const center = { lat: valid[0].latitude as number, lng: valid[0].longitude as number };
      
      try {
        // Load Google Maps script dynamically using our server-side API
        if (!(window as any).google?.maps) {
          await loadGoogleMapsScript();
        }
        
        const map = new (window as any).google.maps.Map(mapRef.current!, {
          center,
          zoom: 11,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        
        for (const f of valid) {
          new (window as any).google.maps.Marker({
            position: { lat: f.latitude as number, lng: f.longitude as number },
            map,
            title: f.name,
          });
        }
      } catch (error) {
        console.error("Failed to load Google Maps:", error);
        // Show fallback message
        if (mapRef.current) {
          mapRef.current.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500">Map temporarily unavailable</div>';
        }
      }
    }
    
    async function loadGoogleMapsScript() {
      // Get API key from our server-side API (this avoids CORS issues)
      const response = await fetch(`/api/google-maps?lat=0&lng=0`);
      if (!response.ok) throw new Error('Failed to get map configuration');
      
      const config = await response.json();
      
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${config.apiKey}&libraries=places&callback=initGoogleMapsCallback`;
        script.async = true;
        script.defer = true;
        
        // Set up callback
        (window as any).initGoogleMapsCallback = () => {
          resolve();
        };
        
        script.onerror = () => reject(new Error('Failed to load Google Maps'));
        document.head.appendChild(script);
      });
    }
  }, [facilities]);

  return <div ref={mapRef} className="w-full h-80 rounded-md border" />;
}