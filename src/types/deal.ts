export type DealStage =
  | "lead"
  | "analyzing"
  | "offer_made"
  | "under_contract"
  | "due_diligence"
  | "closed"
  | "dead";

export interface Deal {
  id: string;
  user_id: string;
  property_id: string | null;
  title: string;
  address: string | null;
  city: string | null;
  state: string | null;
  asking_price: number | null;
  offer_price: number | null;
  arv: number | null;
  rehab_estimate: number | null;
  expected_profit: number | null;
  stage: DealStage;
  source: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DealFormData {
  title: string;
  address: string;
  city: string;
  state: string;
  asking_price: number | null;
  offer_price: number | null;
  arv: number | null;
  rehab_estimate: number | null;
  expected_profit: number | null;
  stage: DealStage;
  source: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  notes: string;
}
