import { api } from "./http";
import type { Report, ReportPayload } from "./types";

export async function getReports() {
  const { data } = await api.get<Report[]>("/reports/");
  return data;
}

export async function createReport(payload: ReportPayload) {
  const { data } = await api.post<Report>("/reports/", payload);
  return data;
}
