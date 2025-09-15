import Image from "next/image";

export default function Header() {
  return (
    <div className='p-4'>
      <Image src='/logo-full.png' alt='tickrx-logo' width={150} height={50} />
    </div>
  );
}
