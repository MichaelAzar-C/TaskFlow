"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";

// Redirects to /login whenever there's no token: on load,
// after a logout in this tab, or after a logout in another tab.
export function useRequireAuth() {
  const router = useRouter();

  useEffect(() => {
    const check = () => {
      if (!getToken()) router.replace("/login");
    };

    check();

    window.addEventListener("auth-change", check);
    window.addEventListener("storage", check);

    return () => {
      window.removeEventListener("auth-change", check);
      window.removeEventListener("storage", check);
    };
  }, [router]);
}