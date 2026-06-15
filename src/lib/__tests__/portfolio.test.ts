import type { SupabaseClient } from "@supabase/supabase-js";

import { ensurePortfolio, STARTING_BALANCE } from "@/lib/portfolio";

interface MockResult {
  data: unknown;
  error: unknown;
}

function makeSupabase(selectResult: MockResult, insertResult?: MockResult) {
  const maybeSingle = jest.fn().mockResolvedValue(selectResult);
  const single = jest.fn().mockResolvedValue(insertResult ?? { data: null, error: null });

  const selectAfterInsert = jest.fn().mockReturnValue({ single });
  const insert = jest.fn().mockReturnValue({ select: selectAfterInsert });

  const eq = jest.fn().mockReturnValue({ maybeSingle });
  const selectForRead = jest.fn().mockReturnValue({ eq });

  const from = jest.fn().mockReturnValue({ select: selectForRead, insert });

  return {
    client: { from } as unknown as SupabaseClient,
    from,
    insert,
    maybeSingle,
  };
}

describe("ensurePortfolio", () => {
  it("returns the existing portfolio without inserting", async () => {
    const existing = {
      id: "p1",
      user_id: "u1",
      cash_balance: 50000,
      starting_balance: 100000,
    };
    const { client, insert } = makeSupabase({ data: existing, error: null });

    const result = await ensurePortfolio(client, "u1");

    expect(result).toEqual(existing);
    expect(insert).not.toHaveBeenCalled();
  });

  it("auto-creates a $100,000 portfolio on first login", async () => {
    const created = {
      id: "p2",
      user_id: "u2",
      cash_balance: STARTING_BALANCE,
      starting_balance: STARTING_BALANCE,
    };
    const { client, insert } = makeSupabase(
      { data: null, error: null },
      { data: created, error: null }
    );

    const result = await ensurePortfolio(client, "u2");

    expect(insert).toHaveBeenCalledWith({
      user_id: "u2",
      cash_balance: STARTING_BALANCE,
      starting_balance: STARTING_BALANCE,
    });
    expect(result).toEqual(created);
  });

  it("throws when the select fails", async () => {
    const { client } = makeSupabase({ data: null, error: new Error("rls denied") });

    await expect(ensurePortfolio(client, "u3")).rejects.toThrow("rls denied");
  });

  it("throws when the insert fails", async () => {
    const { client } = makeSupabase(
      { data: null, error: null },
      { data: null, error: new Error("insert failed") }
    );

    await expect(ensurePortfolio(client, "u4")).rejects.toThrow("insert failed");
  });
});
