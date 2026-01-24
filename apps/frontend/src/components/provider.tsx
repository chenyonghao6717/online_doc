import { Toaster } from "@/components/ui/sonner";
import AuthWrapper from "@/components/auth/auth-wrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FullScreenSpinner from "@/components/spinners/full-screen-spinner";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthWrapper>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <Toaster richColors={true} />
      </AuthWrapper>
      <FullScreenSpinner />
    </>
  );
};

export default Providers;
