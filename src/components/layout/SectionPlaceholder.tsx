interface SectionPlaceholderProps {
  title: string;
  description: string;
  comingIn: string;
}

export default function SectionPlaceholder({
  title,
  description,
  comingIn,
}: SectionPlaceholderProps) {
  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-100">{title}</h1>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
      <div className="mt-6 rounded-xl border border-dashed border-zinc-800 bg-[var(--surface)] p-10 text-center">
        <p className="text-sm text-slate-500">Arriving in {comingIn}.</p>
      </div>
    </section>
  );
}
