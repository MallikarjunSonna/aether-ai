import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type * as RouterTypes from "react-router-dom";

import { LoginPage } from "../src/pages/auth/LoginPage";
import { ApiError } from "../src/api/client";

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock("../src/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof RouterTypes>("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

import { useAuth } from "../src/hooks/useAuth";
const mockUseAuth = vi.mocked(useAuth);

function renderPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      register: vi.fn(),
      logout: vi.fn(),
    });
  });

  it("renders the sign-in heading", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
  });

  it("renders email and password fields", () => {
    renderPage();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
  });

  it("renders a sign-in button", () => {
    renderPage();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows a link to the registration page", () => {
    renderPage();
    expect(screen.getByRole("link", { name: /create account/i })).toHaveAttribute(
      "href",
      "/register",
    );
  });

  it("shows a link to forgot-password", () => {
    renderPage();
    expect(screen.getByRole("link", { name: /forgot password/i })).toHaveAttribute(
      "href",
      "/forgot-password",
    );
  });

  it("calls login with email and password on submit", async () => {
    mockLogin.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/email/i), "alice@test.com");
    await user.type(screen.getByPlaceholderText("Enter your password"), "secret");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("alice@test.com", "secret");
    });
  });

  it("navigates to /dashboard on successful login", async () => {
    mockLogin.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/email/i), "a@b.com");
    await user.type(screen.getByPlaceholderText("Enter your password"), "pw");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { replace: true });
    });
  });

  it("disables the submit button while submitting", async () => {
    let resolveLogin: () => void;
    mockLogin.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveLogin = resolve;
        }),
    );
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/email/i), "a@b.com");
    await user.type(screen.getByPlaceholderText("Enter your password"), "pw");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    const button = screen.getByRole("button", { name: /signing in/i });
    expect(button).toBeDisabled();

    await act(async () => {
      resolveLogin!();
    });
  });

  it("displays a backend error message on ApiError", async () => {
    mockLogin.mockRejectedValue(new ApiError(401, "invalid_credentials", "Invalid credentials."));
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/email/i), "a@b.com");
    await user.type(screen.getByPlaceholderText("Enter your password"), "wrong");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Invalid credentials.");
  });

  it("displays a generic error for unexpected exceptions", async () => {
    mockLogin.mockRejectedValue(new Error("Something broke"));
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/email/i), "a@b.com");
    await user.type(screen.getByPlaceholderText("Enter your password"), "pw");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("An unexpected error occurred");
  });

  it("does not navigate on failed login", async () => {
    mockLogin.mockRejectedValue(new ApiError(401, "invalid_credentials", "Invalid credentials."));
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText(/email/i), "a@b.com");
    await user.type(screen.getByPlaceholderText("Enter your password"), "wrong");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
