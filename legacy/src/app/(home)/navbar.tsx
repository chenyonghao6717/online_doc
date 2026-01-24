"use client";

import Link from "next/link";
import Image from "next/image";
import { SearchInput } from "./search-input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import OrganizationSwitcher from "@/components/organization/organization-switcher";
import { useAppStore } from "@/store/app-store";

export const Navbar = () => {
  const { startLoading, stopLoading, loadingCount } = useAppStore();
  const signOut = async () => {
    startLoading();
    try {
      await authClient.signOut();
    } finally {
      stopLoading();
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
      <div className="flex gap-x-2">
        <OrganizationSwitcher />
        <Button variant="outline" onClick={signOut} disabled={loadingCount > 0}>
          Sign out
        </Button>
      </div>
    </nav>
  );
};
