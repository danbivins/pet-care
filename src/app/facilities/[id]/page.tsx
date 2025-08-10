import Client from "./client";

export default async function FacilityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Client id={id} />;
}


