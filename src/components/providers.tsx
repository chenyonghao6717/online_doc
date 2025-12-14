"use client";

import { Toaster } from "@/components/ui/sonner";
import AuthWrapper from "@/components/auth/auth-wrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthWrapper>
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <Toaster richColors={true} />
      </NuqsAdapter>
    </AuthWrapper>
  );
};

export default Providers;
