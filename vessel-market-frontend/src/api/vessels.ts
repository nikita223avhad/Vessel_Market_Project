import { api } from "./http";
import type { Vessel, VesselPayload } from "./types";

export async function getVessels() {
  const { data } = await api.get<Vessel[]>("/vessels/");
  return data;
}

export async function createVessel(payload: VesselPayload) {
  const { data } = await api.post<Vessel>("/vessels/", payload);
  return data;
}
