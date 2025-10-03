import StockAnalysis from "@/components/StockAnalysis";
import TVNews from "@/components/TVNews";
import TVAnalysis from "@/components/TVAnalysis";
import AskStock from "@/components/AskStock";

export default async function Page({ params }: { params: Promise<{ tickr: string }> }) {
  const { tickr } = await params;

  return (
    <div className='grid grid-cols-12 gap-4'>
      <div className='col-span-12'>
        <AskStock stock={tickr} />
      </div>
      <div className='col-span-12 lg:col-span-8'>
        <StockAnalysis tickr={tickr.toUpperCase()} />
      </div>
      <div className='col-span-12 lg:col-span-4'>
        <TVAnalysis tickr={tickr.toUpperCase()} />
        <TVNews tickr={tickr.toUpperCase()} />
      </div>
    </div>
  );
}
