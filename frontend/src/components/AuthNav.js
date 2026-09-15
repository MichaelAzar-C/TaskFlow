"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthNav() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
    setReady(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    router.push("/");
  };

  if (!ready) return <span className="inline-block w-20" />;

  if (loggedIn) {
    return (
      <button
        onClick={handleLogout}
        className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
      >
        Log out
      </button>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
    >
      Log in
    </Link>
  );
}