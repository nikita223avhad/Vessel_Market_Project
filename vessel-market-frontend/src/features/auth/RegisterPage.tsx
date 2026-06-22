import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { register as registerUser } from "../../api/auth";
import { getApiError } from "../../api/http";
import { Button } from "../../components/Button";
import { Field, SelectField } from "../../components/Field";

const schema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Use at least 6 characters"),
  role: z.enum(["user", "admin"])
});

type RegisterForm = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    defaultValues: { role: "user" }
  });

  async function onSubmit(values: RegisterForm) {
    setError("");
    try {
      await registerUser(values);
      navigate("/login");
    } catch (err) {
      setError(getApiError(err));
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel compact">
        <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
          <h1>Create account</h1>
          {error ? <div className="form-error">{error}</div> : null}
          <Field label="Username" error={errors.username?.message} {...register("username")} />
          <Field label="Email" type="email" error={errors.email?.message} {...register("email")} />
          <Field label="Password" type="password" error={errors.password?.message} {...register("password")} />
          <SelectField
            label="Role"
            error={errors.role?.message}
            options={[
              { label: "Office User", value: "user" },
              { label: "Office Admin", value: "admin" }
            ]}
            {...register("role")}
          />
          <Button fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create account"}
          </Button>
          <p className="form-note">
            Already have access? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
