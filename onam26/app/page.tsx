import Image from "next/image";
import BookingWizard from "@/components/BookingWizard";

export default function Page() {
  return (
    <main>
      <div className="mx-auto max-w-[1300px]">
        <Image
          src="/images/kings-sadhya-hero.jpg"
          alt="Onam Sadhya 2026 — The King's Sadhya is back. Kayal Foods."
          width={1300}
          height={450}
          priority
          className="h-auto w-full"
          sizes="(min-width: 1300px) 1300px, 100vw"
        />
      </div>
      <BookingWizard />
    </main>
  );
}
