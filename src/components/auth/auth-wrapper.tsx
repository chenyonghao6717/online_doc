"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import FullScreenSpinner from "@/components/spinners/full-screen-spinner";

export default function Auth({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ["/sign-in", "/sign-up"];

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (session && publicPaths.includes(pathname)) {
      router.replace("/");
    }

    if (!session && !publicPaths.includes(pathname)) {
      router.replace("/sign-in");
    }
  }, [session, isPending, pathname, router]);

  const isPrivatePath = !publicPaths.includes(pathname);
  if (isPending || (isPrivatePath && !session)) {
    return <FullScreenSpinner />;
  } else {
    return children;
  }
}
