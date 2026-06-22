import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createVessel, getVessels } from "../../api/vessels";
import { getApiError } from "../../api/http";
import { Button } from "../../components/Button";
import { Field, TextareaField } from "../../components/Field";
import { EmptyState, ErrorState, LoadingState } from "../../components/Status";
import { queryClient } from "../../lib/queryClient";
import { currency } from "../../lib/format";

const schema = z.object({
  vessel_name: z.string().min(2, "Vessel name is required"),
  vessel_type: z.string().min(2, "Vessel type is required"),
  price: z.coerce.number().positive("Hire rate must be greater than 0"),
  location: z.string().min(2, "Location is required"),
  description: z.string().optional()
});

type VesselForm = z.infer<typeof schema>;

export function VesselsPage() {
  const [formError, setFormError] = useState("");
  const vessels = useQuery({ queryKey: ["vessels"], queryFn: getVessels });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<VesselForm>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: createVessel,
    onSuccess: async () => {
      reset();
      setFormError("");
      await queryClient.invalidateQueries({ queryKey: ["vessels"] });
    },
    onError: (error) => setFormError(getApiError(error))
  });

  function onSubmit(values: VesselForm) {
    mutation.mutate(values);
  }

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p>Hire-rate inventory</p>
          <h1>Vessels</h1>
        </div>
      </header>

      <div className="content-grid two-thirds">
        <div className="panel">
          <div className="panel-heading">
            <h2>Available vessels</h2>
            <p>Browse hire rates by vessel type and region.</p>
          </div>
          {vessels.isLoading ? <LoadingState /> : null}
          {vessels.isError ? <ErrorState message="Unable to load vessels." /> : null}
          {vessels.data?.length === 0 ? (
            <EmptyState title="No vessels yet" message="Create the first vessel record to start comparison tracking." />
          ) : null}
          <div className="card-grid">
            {vessels.data?.map((vessel) => (
              <article className="data-card" key={vessel.id}>
                <div>
                  <h3>{vessel.vessel_name}</h3>
                  <span>{vessel.vessel_type}</span>
                </div>
                <strong>{currency(vessel.price)}</strong>
                <p>{vessel.location}</p>
                {vessel.description ? <small>{vessel.description}</small> : null}
              </article>
            ))}
          </div>
        </div>

        <form className="panel form-panel" onSubmit={handleSubmit(onSubmit)}>
          <div className="panel-heading">
            <h2>Add vessel</h2>
            <p>Logged-in office users can record hire-rate vessels.</p>
          </div>
          {formError ? <div className="form-error">{formError}</div> : null}
          <Field label="Vessel name" error={errors.vessel_name?.message} {...register("vessel_name")} />
          <Field label="Vessel type" error={errors.vessel_type?.message} {...register("vessel_type")} />
          <Field label="Hire rate" type="number" step="0.01" error={errors.price?.message} {...register("price")} />
          <Field label="Region or location" error={errors.location?.message} {...register("location")} />
          <TextareaField label="Description" error={errors.description?.message} {...register("description")} />
          <Button disabled={mutation.isPending}>
            <Plus size={16} />
            {mutation.isPending ? "Saving..." : "Save vessel"}
          </Button>
        </form>
      </div>
    </section>
  );
}
