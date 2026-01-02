"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAppStore } from "@/components/stores/app-store";

const publicPaths = new Set(["/sign-in", "/sign-up"]);

export default function Auth({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { startLoading, stopLoading } = useAppStore();

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (session && publicPaths.has(pathname)) {
      router.replace("/");
    }

    if (!session && !publicPaths.has(pathname)) {
      router.replace("/sign-in");
    }
  }, [session, pathname, router]);

  useEffect(() => {
    if (isPending) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [isPending]);

  const isPrivatePath = !publicPaths.has(pathname);

  if (isPending || (isPrivatePath && !session)) {
    return null;
  } else {
    return children;
  }
}
