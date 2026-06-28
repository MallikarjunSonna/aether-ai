import { Link } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";

import { AuthCard } from "../../components/auth/AuthCard";
import { InputField } from "../../components/auth/InputField";

export function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email address and we'll send you a link to reset your password."
    >
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()} noValidate>
        <InputField
          label="Email"
          type="email"
          placeholder="name@company.com"
          autoComplete="email"
          autoFocus
        />

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-fast hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          Send Reset Link
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to login
        </Link>
      </div>
    </AuthCard>
  );
}
