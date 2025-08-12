declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

export function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  // If already loaded, return immediately
  if (window.google?.maps?.places) {
    return Promise.resolve();
  }

  // If script already exists, wait for it to load
  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
  if (existingScript) {
    return new Promise((resolve) => {
      const checkLoaded = () => {
        if (window.google?.maps?.places) {
          resolve();
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
    });
  }

  // Load the script
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    // Set up callback
    window.initGoogleMaps = () => {
      resolve();
    };

    script.onerror = () => {
      reject(new Error('Failed to load Google Maps API'));
    };

    document.head.appendChild(script);
  });
}