export type Role = "admin" | "user";

export type AuthToken = {
  access_token: string;
  token_type: string;
  role: Role;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  role: Role;
};

export type Vessel = {
  id: number;
  vessel_name: string;
  vessel_type: string;
  price: number;
  location: string;
  description?: string | null;
  owner_id: number;
};

export type VesselPayload = Omit<Vessel, "id" | "owner_id">;

export type MarketData = {
  id: number;
  region: string;
  vessel_type: string;
  average_price: number;
  demand_index: number;
  report_date: string;
};

export type MarketDataPayload = Omit<MarketData, "id">;

export type Report = {
  id: number;
  vessel_id: number;
  market_data_id: number;
  title: string;
  summary?: string | null;
  created_at: string;
  created_by: number;
};

export type ReportPayload = Pick<Report, "vessel_id" | "market_data_id" | "title" | "summary">;

export type User = {
  id: number;
  username: string;
  email: string;
  role: Role;
  is_active: boolean;
};
