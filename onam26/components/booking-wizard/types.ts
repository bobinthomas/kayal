import type { PackageSize, PaymentMethod, ServiceType } from "@/data/onam-event";

export type Step =
  | "service"
  | "date"
  | "timeslot"
  | "details"
  | "contact"
  | "review"
  | "done";

// Dine-in adds a time-slot step; takeaway keeps the flyer's 12pm-3pm window.
export function stepsForService(serviceType: ServiceType | null): Step[] {
  const middle: Step[] = serviceType === "dine_in" ? ["timeslot", "details"] : ["details"];
  return ["service", "date", ...middle, "contact", "review", "done"];
}

export type WizardState = {
  serviceType: ServiceType | null;
  eventDate: string | null;
  timeSlot: string | null;
  guests: number;
  packageSize: PackageSize | null;
  paymentMethod: PaymentMethod | null;
  name: string;
  phone: string;
  email: string;
  notes: string;
  website: string; // honeypot
};

export const initialWizardState: WizardState = {
  serviceType: null,
  eventDate: null,
  timeSlot: null,
  guests: 2,
  packageSize: null,
  paymentMethod: null,
  name: "",
  phone: "",
  email: "",
  notes: "",
  website: "",
};
