import { zodResolver } from "@hookform/resolvers/zod";
import { Ship } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { login } from "../../api/auth";
import { getApiError } from "../../api/http";
import { Button } from "../../components/Button";
import { Field } from "../../components/Field";
import { useAuth } from "./AuthProvider";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required")
});

type LoginForm = z.infer<typeof schema>;

export function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({ resolver: zodResolver(schema) });

  async function onSubmit(values: LoginForm) {
    setError("");
    try {
      const session = await login(values.email, values.password);
      auth.setSession(session.access_token, session.role);
      navigate("/");
    } catch (err) {
      setError(getApiError(err));
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-brand">
          <span className="brand-mark large">
            <Ship size={28} />
          </span>
          <div>
            <h1>Vessel Market Performance</h1>
            <p>Track regional vessel performance, market rates, and hire-rate comparisons.</p>
          </div>
        </div>

        <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
          <h2>Sign in</h2>
          {error ? <div className="form-error">{error}</div> : null}
          <Field label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
          <Field
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
          <p className="form-note">
            New user? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
