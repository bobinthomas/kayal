import BookingWizard from "@/components/BookingWizard";

export default function Page() {
  return (
    <main>
      <div className="bg-banana-dark px-4 py-10 text-center text-cream">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-turmeric">
          Kayal Foods
        </p>
        <h1 className="mt-2 font-semibold text-3xl sm:text-4xl">Onam Sadhya 2026</h1>
        <p className="mt-2 text-cream/80">
          Dine-in or takeaway, 12pm–3pm. Booking only — reserve your date below.
        </p>
      </div>
      <BookingWizard />
    </main>
  );
}
