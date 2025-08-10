export function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const anyWindow = window as any;

  // If maps and places are already available, we're done
  if (anyWindow.google?.maps && anyWindow.google.maps.places) return Promise.resolve();

  // Helper to wait until places is available
  const waitForPlaces = () =>
    new Promise<void>((resolve) => {
      const check = () => {
        if ((window as any).google?.maps?.places) resolve();
        else requestAnimationFrame(check);
      };
      check();
    });

  // If maps core is present but places is missing, try to load only the library
  if (anyWindow.google?.maps && !anyWindow.google.maps.places) {
    // If importLibrary exists, use it
    if (typeof anyWindow.google.maps.importLibrary === "function") {
      return anyWindow.google.maps.importLibrary("places").then(() => undefined);
    }
    // Fallback: inject a secondary loader for the places library
    if (!document.querySelector('script[data-google-maps-places="true"]')) {
      const lib = document.createElement("script");
      lib.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      lib.async = true;
      lib.setAttribute("data-google-maps-places", "true");
      document.head.appendChild(lib);
    }
    return waitForPlaces();
  }

  // First load: include libraries=places from the start
  if (!document.querySelector('script[data-google-maps="true"]')) {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.setAttribute("data-google-maps", "true");
    document.head.appendChild(script);
  }
  return waitForPlaces();
}


