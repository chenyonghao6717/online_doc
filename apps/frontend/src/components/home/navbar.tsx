import { NavLink } from "react-router";
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
      <NavLink to="/">
        <div className="flex gap-3 items-center shrink-0 pr-6 ">
          <img src="/logoipsum.svg" alt="Logo" width={36} height={36} />
          <h3 className="text-xl">Docs</h3>
        </div>
      </NavLink>
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
