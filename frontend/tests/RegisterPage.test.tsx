import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type * as RouterTypes from "react-router-dom";

import { RegisterPage } from "../src/pages/auth/RegisterPage";
import { ApiError } from "../src/api/client";

const mockRegister = vi.fn();
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

afterEach(() => {
  cleanup();
});

function renderPage() {
  return render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>,
  );
}

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      register: mockRegister,
      login: vi.fn(),
      logout: vi.fn(),
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it("renders the registration heading", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: /create your account/i })).toBeInTheDocument();
  });

  it("renders all form fields", () => {
    renderPage();
    expect(screen.getByPlaceholderText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("janesmith")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("jane@company.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Create a strong password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm your password")).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    renderPage();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("has a link to the sign-in page", () => {
    renderPage();
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute("href", "/login");
  });

  it("calls register with form data on submit", async () => {
    mockRegister.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText("Jane Smith"), "Alice Smith");
    await user.type(screen.getByPlaceholderText("janesmith"), "alice");
    await user.type(screen.getByPlaceholderText("jane@company.com"), "alice@test.com");
    await user.type(screen.getByPlaceholderText("Create a strong password"), "secure-pw");
    await user.type(screen.getByPlaceholderText("Confirm your password"), "secure-pw");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: "alice@test.com",
        username: "alice",
        password: "secure-pw",
        full_name: "Alice Smith",
      });
    });
  });

  it("calls register without full_name when field is empty", async () => {
    mockRegister.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText("janesmith"), "noname");
    await user.type(screen.getByPlaceholderText("jane@company.com"), "x@y.com");
    await user.type(screen.getByPlaceholderText("Create a strong password"), "pw");
    await user.type(screen.getByPlaceholderText("Confirm your password"), "pw");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: "x@y.com",
        username: "noname",
        password: "pw",
      });
    });
  });

  it("navigates to /dashboard on successful registration", async () => {
    mockRegister.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText("janesmith"), "bob");
    await user.type(screen.getByPlaceholderText("jane@company.com"), "b@b.com");
    await user.type(screen.getByPlaceholderText("Create a strong password"), "pw");
    await user.type(screen.getByPlaceholderText("Confirm your password"), "pw");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { replace: true });
    });
  });

  it("shows error when passwords do not match", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText("janesmith"), "bob");
    await user.type(screen.getByPlaceholderText("jane@company.com"), "b@b.com");
    await user.type(screen.getByPlaceholderText("Create a strong password"), "password-1");
    await user.type(screen.getByPlaceholderText("Confirm your password"), "password-2");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Passwords do not match");
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("disables the submit button while submitting", async () => {
    let resolveRegister: (value: unknown) => void;
    mockRegister.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRegister = resolve;
        }),
    );
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText("janesmith"), "bob");
    await user.type(screen.getByPlaceholderText("jane@company.com"), "b@b.com");
    await user.type(screen.getByPlaceholderText("Create a strong password"), "pw");
    await user.type(screen.getByPlaceholderText("Confirm your password"), "pw");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    const button = screen.getByRole("button", { name: /creating account/i });
    expect(button).toBeDisabled();

    await act(async () => {
      resolveRegister!(undefined);
    });
  });

  it("displays a backend error message on ApiError", async () => {
    mockRegister.mockRejectedValue(
      new ApiError(409, "email_already_exists", "A user with this email address already exists."),
    );
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText("janesmith"), "bob");
    await user.type(screen.getByPlaceholderText("jane@company.com"), "existing@test.com");
    await user.type(screen.getByPlaceholderText("Create a strong password"), "pw");
    await user.type(screen.getByPlaceholderText("Confirm your password"), "pw");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("A user with this email address already exists.");
  });

  it("displays a generic error for unexpected exceptions", async () => {
    mockRegister.mockRejectedValue(new Error("Network failure"));
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText("janesmith"), "bob");
    await user.type(screen.getByPlaceholderText("jane@company.com"), "b@b.com");
    await user.type(screen.getByPlaceholderText("Create a strong password"), "pw");
    await user.type(screen.getByPlaceholderText("Confirm your password"), "pw");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("An unexpected error occurred");
  });

  it("does not navigate on failed registration", async () => {
    mockRegister.mockRejectedValue(new ApiError(409, "email_already_exists", "Already exists."));
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText("janesmith"), "bob");
    await user.type(screen.getByPlaceholderText("jane@company.com"), "existing@test.com");
    await user.type(screen.getByPlaceholderText("Create a strong password"), "pw");
    await user.type(screen.getByPlaceholderText("Confirm your password"), "pw");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
