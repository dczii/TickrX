/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

const getUser = jest.fn();

jest.mock("@supabase/ssr", () => ({
  createServerClient: jest.fn(() => ({
    auth: { getUser },
  })),
}));

process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";

function request(path: string): NextRequest {
  return new NextRequest(`https://app.tickrx.com${path}`);
}

describe("updateSession", () => {
  beforeEach(() => jest.clearAllMocks());

  it("redirects unauthenticated users away from protected routes", async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    const response = await updateSession(request("/portfolio"));

    expect(response.status).toBe(307);
    const location = new URL(response.headers.get("location") as string);
    expect(location.pathname).toBe("/login");
    expect(location.searchParams.get("redirectedFrom")).toBe("/portfolio");
  });

  it("lets authenticated users reach protected routes", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "u1" } } });

    const response = await updateSession(request("/dashboard"));

    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects authenticated users away from the login page", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "u1" } } });

    const response = await updateSession(request("/login"));

    expect(response.status).toBe(307);
    expect(new URL(response.headers.get("location") as string).pathname).toBe("/dashboard");
  });

  it("does not gate public routes for anonymous users", async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    const response = await updateSession(request("/login"));

    expect(response.headers.get("location")).toBeNull();
  });
});
