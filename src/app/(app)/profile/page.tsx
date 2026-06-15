import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section>
      <h1 className="text-2xl font-bold text-hi">Profile</h1>
      <p className="mt-1 text-sm text-mid">Your account details.</p>

      <dl className="mt-6 max-w-md space-y-3 rounded-xl border border-edge bg-[var(--surface)] p-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-dim">Email</dt>
          <dd className="text-hi">{user?.email ?? "—"}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-dim">User ID</dt>
          <dd className="tabular-nums text-mid">{user?.id ?? "—"}</dd>
        </div>
      </dl>
    </section>
  );
}
