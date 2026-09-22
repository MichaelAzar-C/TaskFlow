import Link from "next/link";
import AuthNav from "@/components/AuthNav";
import MobileNav from "@/components/MobileNav";
import "./globals.css";

export const metadata = {
  title: {
    default: "TaskFlow — Project & Task Management",
    template: "%s — TaskFlow",
  },
  description:
    "Organise your projects, track your tasks, and keep your team moving. Built during the Compu-Vision internship.",
};

function Navbar() {
  return (
    <header className="relative sticky top-0 z-10 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-gray-900">
          TaskFlow
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/about" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <AuthNav />
        </div>

        {/* Mobile nav */}
        <MobileNav />
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-gray-500">
        <p>TaskFlow — built during the Compu-Vision Full-Stack Internship.</p>
        <p className="mt-1">Batroun, Lebanon</p>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        
          <a href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-gray-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>

        <Navbar />
        <div id="main">{children}</div>
        <Footer />
      </body>
    </html>
  );
}