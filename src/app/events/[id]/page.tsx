import Image from "next/image";

async function fetchEvent(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/events/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

async function fetchArtist(name: string) {
  const [spotifyRes, bitRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/artist/spotify?name=${encodeURIComponent(name)}`),
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/artist/bandsintown?name=${encodeURIComponent(name)}`),
  ]);
  const spotify = spotifyRes.ok ? await spotifyRes.json() : null;
  const bandsintown = bitRes.ok ? await bitRes.json() : null;
  return { spotify, bandsintown };
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await fetchEvent(id);
  if (!event) return <main className="mx-auto max-w-3xl px-4 py-10">Event not found</main>;
  const primary = event.attractions?.[0]?.name as string | undefined;
  const artist = primary ? await fetchArtist(primary) : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <p className="text-neutral-600">{new Date(event.date).toLocaleString()} — {event.venue}, {event.city}, {event.state}</p>
      </div>

      {artist?.spotify?.image && (
        <div className="flex items-center gap-4">
          <Image src={artist.spotify.image} alt={artist?.spotify?.name || "Artist"} width={96} height={96} className="rounded" />
          <div>
            <p className="font-semibold">{artist?.spotify?.name}</p>
            <div className="flex gap-3 text-sm">
              {artist.spotify.url && <a className="text-green-700 hover:underline" href={artist.spotify.url} target="_blank" rel="noreferrer">Spotify</a>}
              {artist.bandsintown?.url && <a className="text-blue-700 hover:underline" href={artist.bandsintown.url} target="_blank" rel="noreferrer">Bandsintown</a>}
            </div>
          </div>
        </div>
      )}

      {event.ticketUrl && (
        <a className="inline-block rounded-md bg-black text-white px-4 py-2" href={event.ticketUrl} target="_blank" rel="noreferrer">
          Get Tickets
        </a>
      )}
    </main>
  );
}


