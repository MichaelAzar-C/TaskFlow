"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthNav() {
  const [loggedIn, setLoggedIn] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const check = () => setLoggedIn(!!localStorage.getItem("token"));

    check();

    window.addEventListener("auth-change", check);
    window.addEventListener("storage", check);

    return () => {
      window.removeEventListener("auth-change", check);
      window.removeEventListener("storage", check);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    window.dispatchEvent(new Event("auth-change"));
    router.push("/");
  };

  if (loggedIn === null) return <span className="inline-block w-20" />;

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
