// Shared types mirroring the FastAPI backend response shapes.

export type CaseStatus = "new" | "triaged" | "referred" | "closed";
export type Urgency = "High" | "Medium" | "Low";

export interface Case {
  id: number;
  case_code: string;
  volunteer_name: string;
  volunteer_phone?: string | null;
  city: string;
  area?: string | null;
  household_size?: number | null;
  beneficiary_name?: string | null;
  beneficiary_phone?: string | null;
  situation_notes: string;
  status: CaseStatus;
  urgency?: Urgency | null;
  urgency_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CaseCreate {
  volunteer_name: string;
  volunteer_phone?: string | null;
  city: string;
  area?: string | null;
  household_size?: number | null;
  beneficiary_name?: string | null;
  beneficiary_phone?: string | null;
  situation_notes: string;
}

export interface CaseUpdate {
  status?: CaseStatus;
  urgency?: Urgency;
  urgency_reason?: string;
}

export interface Organisation {
  id: number;
  name: string;
  city: string;
  area?: string | null;
  focus?: string | null;
  contact_info?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface OrganisationCreate {
  name: string;
  city: string;
  area?: string | null;
  focus?: string | null;
  contact_info?: string | null;
  is_active?: boolean;
}

export interface Referral {
  id: number;
  case_id: number;
  organisation_id: number;
  letter_text: string;
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ContactCreate {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}

export interface StatsOverview {
  totals: {
    cases: number;
    organisations: number;
    active_organisations: number;
    referrals: number;
    triaged: number;
    pending: number;
    match_rate: number;
  };
  by_status: Record<string, number>;
  by_urgency: { High: number; Medium: number; Low: number };
  by_city: { city: string; count: number }[];
  monthly: { month: string; count: number }[];
  year: number;
}
