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
    // Load Google Maps JS API
    if (!(window as any).google?.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.onload = () => initMap();
      document.body.appendChild(script);
      return;
    }
    initMap();

    function initMap() {
      const valid = facilities.filter((f) => typeof f.latitude === "number" && typeof f.longitude === "number");
      if (valid.length === 0) return;
      const center = { lat: valid[0].latitude as number, lng: valid[0].longitude as number };
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
    }
  }, [facilities]);

  return <div ref={mapRef} className="w-full h-80 rounded-md border" />;
}


