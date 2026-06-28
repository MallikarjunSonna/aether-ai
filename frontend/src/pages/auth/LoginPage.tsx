import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, LogIn } from "lucide-react";

import { AuthCard } from "../../components/auth/AuthCard";
import { AuthDivider } from "../../components/auth/AuthDivider";
import { InputField } from "../../components/auth/InputField";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your Aether AI account to continue.">
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()} noValidate>
        <InputField
          label="Email"
          type="email"
          placeholder="name@company.com"
          autoComplete="email"
          autoFocus
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-ink">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs font-medium text-primary transition-colors hover:text-blue-400">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
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

        <div className="flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-line bg-canvas text-primary focus:ring-primary/20"
          />
          <label htmlFor="remember" className="text-sm text-muted">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-fast hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          Sign In
        </button>
      </form>

      <AuthDivider />

      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-medium text-primary transition-colors hover:text-blue-400">
          Create account
        </Link>
      </p>
    </AuthCard>
  );
}
