export default function LegalPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold">Legal & Sources</h1>
      <section className="space-y-3 text-sm leading-6 text-neutral-800">
        <p>
          FitFind aggregates publicly available business information to help users discover gyms and fitness
          facilities. Primary data sources include the Google Places Platform (Places API and Maps JavaScript API).
        </p>
        <p>
          We do not verify the accuracy of third‑party data. Hours, amenities, prices, and availability can change
          without notice. Always confirm details with the facility directly before visiting or purchasing.
        </p>
        <p>
          By using this site, you agree that FitFind is not responsible for any loss, injury, or damages arising from
          your use of the information provided, including issues related to bookings, cancellations, or service quality.
        </p>
        <p>
          If you represent a facility and would like to update or remove information, please contact us and we will
          address your request promptly.
        </p>
        <p className="text-neutral-600">
          Trademarks and logos are the property of their respective owners. This site is not endorsed by or affiliated
          with Google.
        </p>
      </section>
    </main>
  );
}


