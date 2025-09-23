import cn from "classnames";

export default function RowLoader({ className = "" }) {
  return (
    <div className={cn("flex animate-pulse", className)}>
      <div className='col-span-2 h-4 rounded bg-gray-200 w-1/2'></div>
    </div>
  );
}
