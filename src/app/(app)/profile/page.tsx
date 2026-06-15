import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-100">Profile</h1>
      <p className="mt-1 text-sm text-slate-400">Your account details.</p>

      <dl className="mt-6 max-w-md space-y-3 rounded-xl border border-zinc-800 bg-[var(--surface)] p-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Email</dt>
          <dd className="text-slate-100">{user?.email ?? "—"}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">User ID</dt>
          <dd className="tabular-nums text-slate-400">{user?.id ?? "—"}</dd>
        </div>
      </dl>
    </section>
  );
}
