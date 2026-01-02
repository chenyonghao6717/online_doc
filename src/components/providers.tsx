"use client";

import { Toaster } from "@/components/ui/sonner";
import AuthWrapper from "@/components/auth/auth-wrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import FullScreenSpinner from "./spinners/full-screen-spinner";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthWrapper>
        <NuqsAdapter>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
          <Toaster richColors={true} />
        </NuqsAdapter>
      </AuthWrapper>
      <FullScreenSpinner />
    </>
  );
};

export default Providers;
