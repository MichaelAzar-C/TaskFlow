"use client";

import { useState } from "react";
import Link from "next/link";
import AuthNav from "./AuthNav";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="rounded p-2 text-2xl leading-none hover:bg-gray-100"
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex flex-col gap-4">
            <Link href="/about" onClick={() => setOpen(false)} className="text-gray-600">
              About
            </Link>
            <Link href="/dashboard" onClick={() => setOpen(false)} className="text-gray-600">
              Dashboard
            </Link>
            <div onClick={() => setOpen(false)}>
              <AuthNav />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}