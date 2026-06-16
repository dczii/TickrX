import ScreenHeader from "@/components/layout/ScreenHeader";

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
      <ScreenHeader back title={title} />
      <div className="px-5">
        <p className="text-sm text-mid">{description}</p>
        <div className="mt-6 rounded-xl border border-dashed border-edge bg-[var(--surface)] p-10 text-center">
          <p className="text-sm text-dim">Arriving in {comingIn}.</p>
        </div>
      </div>
    </section>
  );
}
