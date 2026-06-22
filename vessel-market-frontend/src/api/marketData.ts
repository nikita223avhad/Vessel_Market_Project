import { api } from "./http";
import type { MarketData, MarketDataPayload } from "./types";

export async function getMarketData() {
  const { data } = await api.get<MarketData[]>("/market-data/");
  return data;
}

export async function createMarketData(payload: MarketDataPayload) {
  const { data } = await api.post<MarketData>("/market-data/", payload);
  return data;
}
