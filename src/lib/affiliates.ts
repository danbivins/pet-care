function appendParams(url: string, params: Record<string, string | undefined>) {
  const u = new URL(url);
  for (const [k, v] of Object.entries(params)) {
    if (!v) continue;
    if (!u.searchParams.has(k)) u.searchParams.set(k, v);
  }
  return u.toString();
}

export function decorateTicketmasterUrl(baseUrl?: string | null): string | undefined | null {
  if (!baseUrl) return baseUrl ?? null;
  const aid = process.env.TICKETMASTER_AFFILIATE_AID;
  const url = appendParams(baseUrl, {
    aid: aid, // Ticketmaster affiliate ID
    utm_source: "venuefinder",
    utm_medium: "affiliate",
    utm_campaign: "ticket_sales",
  });
  return url;
}


