import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, UserPlus } from "lucide-react";

import { AuthCard } from "../../components/auth/AuthCard";
import { AuthDivider } from "../../components/auth/AuthDivider";
import { InputField } from "../../components/auth/InputField";

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <AuthCard title="Create your account" subtitle="Get started with Aether AI — it's free for teams of all sizes.">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()} noValidate>
        <InputField
          label="Full Name"
          type="text"
          placeholder="Jane Smith"
          autoComplete="name"
          autoFocus
        />

        <InputField
          label="Username"
          type="text"
          placeholder="janesmith"
          autoComplete="username"
        />

        <InputField
          label="Email"
          type="email"
          placeholder="jane@company.com"
          autoComplete="email"
        />

        <div className="space-y-1.5">
          <label htmlFor="register-password" className="text-sm font-medium text-ink">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              autoComplete="new-password"
              className="block w-full rounded-lg border border-line bg-canvas py-2.5 pl-10 pr-10 text-sm text-ink placeholder-neutral-500 transition-colors duration-fast focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="register-confirm" className="text-sm font-medium text-ink">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id="register-confirm"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm your password"
              autoComplete="new-password"
              className="block w-full rounded-lg border border-line bg-canvas py-2.5 pl-10 pr-10 text-sm text-ink placeholder-neutral-500 transition-colors duration-fast focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink"
              aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-fast hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Create Account
        </button>
      </form>

      <AuthDivider />

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary transition-colors hover:text-blue-400">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
