"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();

  const signInPath = "/sign-in";
  const signInButtonText = "Login";
  const signUpPath = "/sign-up";
  const signUpButtonText = "Sign Up";
  const isSignIn = pathname === signInPath;

  return (
    <div className="bg-neutral-100 min-h-screen">
      <div className="p-4 h-full">
        <nav className="flex justify-between items-center">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={36} height={36} />
          </Link>
          <Button asChild variant="secondary" className="bg-white">
            <Link href={isSignIn ? signUpPath : signInPath}>
              {isSignIn ? signUpButtonText : signInButtonText}
            </Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
