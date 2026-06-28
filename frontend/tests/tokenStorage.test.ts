import { describe, it, expect, beforeEach } from "vitest";
import { tokenStorage } from "../src/services/tokenStorage";

const ACCESS_KEY = "aether_access_token";
const REFRESH_KEY = "aether_refresh_token";

beforeEach(() => {
  localStorage.clear();
});

describe("tokenStorage", () => {
  describe("setAccessToken / getAccessToken", () => {
    it("stores and retrieves an access token", () => {
      tokenStorage.setAccessToken("access-123");
      expect(tokenStorage.getAccessToken()).toBe("access-123");
    });

    it("stores the token under the correct key", () => {
      tokenStorage.setAccessToken("my-token");
      expect(localStorage.getItem(ACCESS_KEY)).toBe("my-token");
    });

    it("returns null when no access token is stored", () => {
      expect(tokenStorage.getAccessToken()).toBeNull();
    });
  });

  describe("setRefreshToken / getRefreshToken", () => {
    it("stores and retrieves a refresh token", () => {
      tokenStorage.setRefreshToken("refresh-456");
      expect(tokenStorage.getRefreshToken()).toBe("refresh-456");
    });

    it("stores the token under the correct key", () => {
      tokenStorage.setRefreshToken("my-refresh");
      expect(localStorage.getItem(REFRESH_KEY)).toBe("my-refresh");
    });

    it("returns null when no refresh token is stored", () => {
      expect(tokenStorage.getRefreshToken()).toBeNull();
    });
  });

  describe("setTokens", () => {
    it("stores both access and refresh tokens", () => {
      tokenStorage.setTokens("access-token", "refresh-token");

      expect(localStorage.getItem(ACCESS_KEY)).toBe("access-token");
      expect(localStorage.getItem(REFRESH_KEY)).toBe("refresh-token");
    });
  });

  describe("clear", () => {
    it("removes both tokens from storage", () => {
      localStorage.setItem(ACCESS_KEY, "access");
      localStorage.setItem(REFRESH_KEY, "refresh");

      tokenStorage.clear();

      expect(localStorage.getItem(ACCESS_KEY)).toBeNull();
      expect(localStorage.getItem(REFRESH_KEY)).toBeNull();
    });

    it("does not throw when no tokens are stored", () => {
      expect(() => tokenStorage.clear()).not.toThrow();
    });
  });
});
