import { api } from "./api-client";
import { Deal, DealFormData, DealStage } from "@/types/deal";

interface ApiDeal {
  id: string;
  userId: string;
  propertyId: string | null;
  title: string;
  address: string | null;
  city: string | null;
  state: string | null;
  askingPrice: number | null;
  offerPrice: number | null;
  arv: number | null;
  rehabEstimate: number | null;
  expectedProfit: number | null;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  source: string | null;
  stage: DealStage;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

function fromApi(row: ApiDeal): Deal {
  return {
    id: row.id,
    user_id: row.userId,
    property_id: row.propertyId,
    title: row.title,
    address: row.address,
    city: row.city,
    state: row.state,
    asking_price: row.askingPrice,
    offer_price: row.offerPrice,
    arv: row.arv,
    rehab_estimate: row.rehabEstimate,
    expected_profit: row.expectedProfit,
    stage: row.stage,
    source: row.source,
    contact_name: row.contactName,
    contact_phone: row.contactPhone,
    contact_email: row.contactEmail,
    notes: row.notes,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

const FIELD_MAP: Record<keyof DealFormData, string> = {
  title: "title",
  address: "address",
  city: "city",
  state: "state",
  asking_price: "askingPrice",
  offer_price: "offerPrice",
  arv: "arv",
  rehab_estimate: "rehabEstimate",
  expected_profit: "expectedProfit",
  stage: "stage",
  source: "source",
  contact_name: "contactName",
  contact_phone: "contactPhone",
  contact_email: "contactEmail",
  notes: "notes",
};

function toApiPayload(formData: Partial<DealFormData>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(formData) as [keyof DealFormData, unknown][]) {
    const apiKey = FIELD_MAP[key];
    if (!apiKey) continue;
    payload[apiKey] = value === "" ? null : value;
  }
  return payload;
}

export async function fetchDeals(): Promise<Deal[]> {
  const rows = await api.get<ApiDeal[]>("/deals");
  return rows.map(fromApi);
}

export async function addDeal(data: Partial<DealFormData>): Promise<Deal> {
  const row = await api.post<ApiDeal>("/deals", toApiPayload(data));
  return fromApi(row);
}

export async function updateDeal(id: string, data: Partial<DealFormData>): Promise<Deal> {
  const row = await api.patch<ApiDeal>(`/deals/${id}`, toApiPayload(data));
  return fromApi(row);
}

export async function updateDealStage(id: string, stage: DealStage): Promise<void> {
  await api.patch(`/deals/${id}`, { stage });
}

export async function deleteDeal(id: string): Promise<void> {
  await api.delete(`/deals/${id}`);
}
