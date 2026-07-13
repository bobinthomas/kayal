import type { PackageSize, PaymentMethod, ServiceType } from "@/data/onam-event";

export type Step =
  | "service"
  | "date"
  | "details"
  | "contact"
  | "review"
  | "done";

export type WizardState = {
  serviceType: ServiceType | null;
  eventDate: string | null;
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
  guests: 2,
  packageSize: null,
  paymentMethod: null,
  name: "",
  phone: "",
  email: "",
  notes: "",
  website: "",
};
