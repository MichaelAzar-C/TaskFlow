import Link from "next/link";
import AuthNav from "@/components/AuthNav";
import "./globals.css";

export const metadata = {
  title: "TaskFlow — Project & Task Management",
  description:
    "Organise your projects, track your tasks, and keep your team moving. Built during the Compu-Vision internship.",
};

function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-gray-900">
          TaskFlow
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/about" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <AuthNav />
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-20">
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
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}