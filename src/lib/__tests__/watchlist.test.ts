import type { SupabaseClient } from "@supabase/supabase-js";

import { getWatchlist, addToWatchlist, removeFromWatchlist } from "@/lib/watchlist";

describe("getWatchlist", () => {
  function makeClient(result: { data: unknown; error: unknown }) {
    const order = jest.fn().mockResolvedValue(result);
    const eq = jest.fn().mockReturnValue({ order });
    const select = jest.fn().mockReturnValue({ eq });
    const from = jest.fn().mockReturnValue({ select });
    return { client: { from } as unknown as SupabaseClient, from };
  }

  it("returns the user's symbols in order", async () => {
    const { client } = makeClient({
      data: [{ symbol: "AAPL" }, { symbol: "MSFT" }],
      error: null,
    });
    expect(await getWatchlist(client, "u1")).toEqual(["AAPL", "MSFT"]);
  });

  it("throws on error", async () => {
    const { client } = makeClient({ data: null, error: new Error("rls") });
    await expect(getWatchlist(client, "u1")).rejects.toThrow("rls");
  });
});

describe("addToWatchlist", () => {
  function makeClient(error: unknown = null) {
    const upsert = jest.fn().mockResolvedValue({ error });
    const from = jest.fn().mockReturnValue({ upsert });
    return { client: { from } as unknown as SupabaseClient, upsert, from };
  }

  it("upserts a normalized symbol for the user", async () => {
    const { client, upsert, from } = makeClient();
    await addToWatchlist(client, "u1", " aapl ");
    expect(from).toHaveBeenCalledWith("watchlists");
    expect(upsert).toHaveBeenCalledWith(
      { user_id: "u1", symbol: "AAPL" },
      { onConflict: "user_id,symbol", ignoreDuplicates: true }
    );
  });

  it("rejects an empty symbol", async () => {
    const { client, upsert } = makeClient();
    await expect(addToWatchlist(client, "u1", "   ")).rejects.toThrow("Symbol is required");
    expect(upsert).not.toHaveBeenCalled();
  });

  it("throws when the upsert fails", async () => {
    const { client } = makeClient(new Error("dup"));
    await expect(addToWatchlist(client, "u1", "AAPL")).rejects.toThrow("dup");
  });
});

describe("removeFromWatchlist", () => {
  function makeClient(error: unknown = null) {
    const eqSymbol = jest.fn().mockResolvedValue({ error });
    const eqUser = jest.fn().mockReturnValue({ eq: eqSymbol });
    const del = jest.fn().mockReturnValue({ eq: eqUser });
    const from = jest.fn().mockReturnValue({ delete: del });
    return { client: { from } as unknown as SupabaseClient, eqUser, eqSymbol };
  }

  it("deletes the normalized symbol for the user", async () => {
    const { client, eqUser, eqSymbol } = makeClient();
    await removeFromWatchlist(client, "u1", "aapl");
    expect(eqUser).toHaveBeenCalledWith("user_id", "u1");
    expect(eqSymbol).toHaveBeenCalledWith("symbol", "AAPL");
  });

  it("throws when the delete fails", async () => {
    const { client } = makeClient(new Error("nope"));
    await expect(removeFromWatchlist(client, "u1", "AAPL")).rejects.toThrow("nope");
  });
});
