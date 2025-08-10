import axios, { AxiosInstance } from "axios";

export interface ApiClients {
  bandsintown: AxiosInstance;
  ticketmaster: AxiosInstance;
  googlePlaces: AxiosInstance;
}

export function createApiClients(): ApiClients {
  const bandsintownAppId = process.env.BANDSINTOWN_APP_ID;
  const ticketmasterKey = process.env.TICKETMASTER_API_KEY;
  const googleKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

  if (!bandsintownAppId) {
    // avoid throwing in build; runtime routes can validate too
    console.warn("Missing BANDSINTOWN_APP_ID env var");
  }

  const bandsintown = axios.create({
    baseURL: "https://rest.bandsintown.com",
    params: { app_id: bandsintownAppId },
    timeout: 15000,
  });

  const ticketmaster = axios.create({
    baseURL: "https://app.ticketmaster.com/discovery/v2",
    params: { apikey: ticketmasterKey },
    timeout: 15000,
  });

  const googlePlaces = axios.create({
    baseURL: "https://maps.googleapis.com/maps/api",
    params: { key: googleKey },
    timeout: 15000,
  });

  return { bandsintown, ticketmaster, googlePlaces };
}


