"use client";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Header() {
  return (
    <div className='p-4'>
      <button className='cursor-pointer' onClick={() => redirect("/")}>
        <Image src='/logo-full.png' alt='tickrx-logo' width={150} height={50} />
      </button>
    </div>
  );
}
