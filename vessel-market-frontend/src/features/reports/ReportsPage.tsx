import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FilePlus2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getApiError } from "../../api/http";
import { getMarketData } from "../../api/marketData";
import { createReport, getReports } from "../../api/reports";
import { getVessels } from "../../api/vessels";
import { Button } from "../../components/Button";
import { Field, SelectField, TextareaField } from "../../components/Field";
import { EmptyState, ErrorState, LoadingState } from "../../components/Status";
import { shortDate } from "../../lib/format";
import { queryClient } from "../../lib/queryClient";
import { useAuth } from "../auth/AuthProvider";

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  vessel_id: z.coerce.number().positive("Select a vessel"),
  market_data_id: z.coerce.number().positive("Select market data"),
  summary: z.string().optional()
});

type ReportForm = z.infer<typeof schema>;

export function ReportsPage() {
  const auth = useAuth();
  const [formError, setFormError] = useState("");
  const reports = useQuery({ queryKey: ["reports"], queryFn: getReports });
  const vessels = useQuery({ queryKey: ["vessels"], queryFn: getVessels });
  const market = useQuery({ queryKey: ["market-data"], queryFn: getMarketData });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ReportForm>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: createReport,
    onSuccess: async () => {
      reset();
      setFormError("");
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error) => setFormError(getApiError(error))
  });

  const vesselOptions = [
    { label: "Select vessel", value: "0" },
    ...(vessels.data ?? []).map((item) => ({ label: `${item.vessel_name} - ${item.vessel_type}`, value: String(item.id) }))
  ];
  const marketOptions = [
    { label: "Select market data", value: "0" },
    ...(market.data ?? []).map((item) => ({
      label: `${item.region} / ${item.vessel_type} / ${shortDate(item.report_date)}`,
      value: String(item.id)
    }))
  ];

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p>Performance narratives</p>
          <h1>Reports</h1>
        </div>
      </header>

      <div className="content-grid two-thirds">
        <div className="panel">
          <div className="panel-heading">
            <h2>Report library</h2>
            <p>Daily and aggregated vessel performance summaries.</p>
          </div>
          {reports.isLoading ? <LoadingState /> : null}
          {reports.isError ? <ErrorState message="Unable to load reports. Sign in again if your session expired." /> : null}
          {reports.data?.length === 0 ? (
            <EmptyState title="No reports yet" message="Admins can create the first performance summary." />
          ) : null}
          <div className="card-grid">
            {reports.data?.map((report) => (
              <article className="data-card report-card" key={report.id}>
                <div>
                  <h3>{report.title}</h3>
                  <span>{shortDate(report.created_at)}</span>
                </div>
                <p>{report.summary || "No summary provided."}</p>
                <small>
                  Vessel #{report.vessel_id} linked to market data #{report.market_data_id}
                </small>
              </article>
            ))}
          </div>
        </div>

        {auth.isAdmin ? (
          <form className="panel form-panel" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
            <div className="panel-heading">
              <h2>Create report</h2>
              <p>Admins can publish comparisons for office users.</p>
            </div>
            {formError ? <div className="form-error">{formError}</div> : null}
            <Field label="Title" error={errors.title?.message} {...register("title")} />
            <SelectField label="Vessel" options={vesselOptions} error={errors.vessel_id?.message} {...register("vessel_id")} />
            <SelectField
              label="Market data"
              options={marketOptions}
              error={errors.market_data_id?.message}
              {...register("market_data_id")}
            />
            <TextareaField label="Summary" error={errors.summary?.message} {...register("summary")} />
            <Button disabled={mutation.isPending || vessels.isLoading || market.isLoading}>
              <FilePlus2 size={16} />
              {mutation.isPending ? "Publishing..." : "Publish report"}
            </Button>
          </form>
        ) : (
          <aside className="panel callout-panel">
            <h2>Reports are admin-authored</h2>
            <p>Office users can read report outputs but cannot create or edit official comparisons.</p>
          </aside>
        )}
      </div>
    </section>
  );
}
