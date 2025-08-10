"use client";
import { useEffect, useState } from "react";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  async function load() {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (state) params.set("state", state);
    const res = await fetch(`/api/events?${params.toString()}`);
    setEvents(await res.json());
  }

  useEffect(() => {
    // initial popular events example: leave empty
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Upcoming shows</h1>
      <div className="flex gap-2 mb-4 items-end">
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="border rounded-md px-3 py-2" />
        <input value={state} onChange={(e) => setState(e.target.value)} placeholder="State" className="border rounded-md px-3 py-2 w-24" maxLength={2} />
        <button className="h-10 px-4 rounded-md bg-black text-white" onClick={load}>Search</button>
      </div>
      <ul className="space-y-3">
        {events.map((e) => (
          <li key={e.id} className="border rounded-md p-4">
            <div className="flex justify-between">
              <p className="font-medium">{e.name}</p>
              <a className="text-blue-600 hover:underline" href={e.ticketUrl} target="_blank" rel="noreferrer">Tickets</a>
            </div>
            <p className="text-sm text-neutral-600">{new Date(e.date).toLocaleString()} — {e.venue}, {e.city}, {e.state}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}


