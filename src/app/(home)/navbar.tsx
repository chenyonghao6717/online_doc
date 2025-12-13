"use client";

import Link from "next/link";
import Image from "next/image";
import { SearchInput } from "./search-input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import FullScreenSpinner from "@/components/spinners/full-screen-spinner";

export const Navbar = () => {
  const [loading, setIsLoading] = useState(false);
  const signOut = async () => {
    try {
      setIsLoading(true);
      await authClient.signOut();
    } catch (error) {
      console.log("Sign out failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="flex items-center justify-between h-full w-full">
      <Link href="/">
        <div className="flex gap-3 items-center shrink-0 pr-6 ">
          <Image src="/logoipsum.svg" alt="Logo" width={36} height={36} />
          <h3 className="text-xl">Docs</h3>
        </div>
      </Link>
      <SearchInput />
      <Button variant="outline" onClick={signOut} disabled={loading}>
        Sign out
      </Button>
      {loading && <FullScreenSpinner />}
      <div />
    </nav>
  );
};
