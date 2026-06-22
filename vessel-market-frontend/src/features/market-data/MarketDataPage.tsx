import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getApiError } from "../../api/http";
import { createMarketData, getMarketData } from "../../api/marketData";
import { Button } from "../../components/Button";
import { Field } from "../../components/Field";
import { EmptyState, ErrorState, LoadingState } from "../../components/Status";
import { useAuth } from "../auth/AuthProvider";
import { currency, percent, shortDate } from "../../lib/format";
import { queryClient } from "../../lib/queryClient";

const schema = z.object({
  region: z.string().min(2, "Region is required"),
  vessel_type: z.string().min(2, "Vessel type is required"),
  average_price: z.coerce.number().positive("Market rate must be greater than 0"),
  demand_index: z.coerce.number().min(0, "Minimum is 0").max(100, "Maximum is 100"),
  report_date: z.string().min(1, "Report date is required")
});

type MarketForm = z.infer<typeof schema>;

export function MarketDataPage() {
  const auth = useAuth();
  const [formError, setFormError] = useState("");
  const market = useQuery({ queryKey: ["market-data"], queryFn: getMarketData });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<MarketForm>({
    resolver: zodResolver(schema),
    defaultValues: { report_date: new Date().toISOString().slice(0, 10) }
  });

  const mutation = useMutation({
    mutationFn: createMarketData,
    onSuccess: async () => {
      reset({ report_date: new Date().toISOString().slice(0, 10) } as MarketForm);
      setFormError("");
      await queryClient.invalidateQueries({ queryKey: ["market-data"] });
    },
    onError: (error) => setFormError(getApiError(error))
  });

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p>Daily regional input</p>
          <h1>Market Data</h1>
        </div>
      </header>

      <div className="content-grid two-thirds">
        <div className="panel">
          <div className="panel-heading">
            <h2>Market rate history</h2>
            <p>Daily market rates and demand index by region.</p>
          </div>
          {market.isLoading ? <LoadingState /> : null}
          {market.isError ? <ErrorState message="Unable to load market data." /> : null}
          {market.data?.length === 0 ? (
            <EmptyState title="No market entries" message="Admins can enter the first daily market-rate record." />
          ) : null}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Region</th>
                  <th>Vessel type</th>
                  <th>Average price</th>
                  <th>Demand index</th>
                </tr>
              </thead>
              <tbody>
                {market.data?.map((item) => (
                  <tr key={item.id}>
                    <td>{shortDate(item.report_date)}</td>
                    <td>{item.region}</td>
                    <td>{item.vessel_type}</td>
                    <td>{currency(item.average_price)}</td>
                    <td>{percent(item.demand_index)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {auth.isAdmin ? (
          <form className="panel form-panel" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
            <div className="panel-heading">
              <h2>Add daily data</h2>
              <p>Only office admins can input market data.</p>
            </div>
            {formError ? <div className="form-error">{formError}</div> : null}
            <Field label="Region" error={errors.region?.message} {...register("region")} />
            <Field label="Vessel type" error={errors.vessel_type?.message} {...register("vessel_type")} />
            <Field
              label="Average market price"
              type="number"
              step="0.01"
              error={errors.average_price?.message}
              {...register("average_price")}
            />
            <Field
              label="Demand index"
              type="number"
              step="0.1"
              error={errors.demand_index?.message}
              {...register("demand_index")}
            />
            <Field label="Report date" type="date" error={errors.report_date?.message} {...register("report_date")} />
            <Button disabled={mutation.isPending}>
              <Plus size={16} />
              {mutation.isPending ? "Saving..." : "Save market data"}
            </Button>
          </form>
        ) : (
          <aside className="panel callout-panel">
            <h2>Read-only access</h2>
            <p>Office users can review market performance, but daily market-rate input is restricted to admins.</p>
          </aside>
        )}
      </div>
    </section>
  );
}
