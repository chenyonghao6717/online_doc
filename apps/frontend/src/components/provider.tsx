import { Toaster } from "@/components/ui/sonner";
import AuthWrapper from "@/components/auth/auth-wrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <NuqsAdapter>
      <AuthWrapper>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <Toaster richColors={true} />
      </AuthWrapper>
    </NuqsAdapter>
  );
};

export default Providers;
