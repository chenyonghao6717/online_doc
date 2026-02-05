import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import FullScreenSpinner from "@/components/spinners/full-screen-spinner";

const publicPaths = new Set(["/sign-in", "/sign-up"]);

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: session, isPending } = authClient.useSession();
  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (session && publicPaths.has(pathname)) {
      navigate("/");
    }

    if (!session && !publicPaths.has(pathname)) {
      navigate("/sign-in");
    }
  }, [session, pathname, navigate, isPending]);

  const isPrivatePath = !publicPaths.has(pathname);

  if (isPending || (isPrivatePath && !session)) {
    return <FullScreenSpinner />;
  } else {
    return children;
  }
};

export default AuthWrapper;
