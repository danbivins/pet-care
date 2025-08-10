import axios from "axios";

let cachedToken: { access_token: string; expires_at: number } | null = null;

async function fetchToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Missing Spotify credentials");
  const resp = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  const token = resp.data.access_token as string;
  const expiresIn = resp.data.expires_in as number;
  cachedToken = { access_token: token, expires_at: Date.now() + (expiresIn - 60) * 1000 };
  return token;
}

async function getToken() {
  if (cachedToken && cachedToken.expires_at > Date.now()) return cachedToken.access_token;
  return fetchToken();
}

export async function searchArtistByName(name: string) {
  const token = await getToken();
  const resp = await axios.get("https://api.spotify.com/v1/search", {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: name, type: "artist", limit: 1 },
  });
  const artist = resp.data?.artists?.items?.[0];
  if (!artist) return null;
  return {
    id: artist.id,
    name: artist.name,
    url: artist.external_urls?.spotify as string | undefined,
    image: artist.images?.[0]?.url as string | undefined,
    followers: artist.followers?.total as number | undefined,
    genres: (artist.genres as string[]) || [],
  };
}


