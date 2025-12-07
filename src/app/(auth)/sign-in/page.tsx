"use client";

import SignInCard from "@/components/auth/sign-in-card";

interface SignInPageProps {
  children: React.ReactNode;
}

const SignInPage = ({ children }: SignInPageProps) => {
  return <SignInCard />;
};

export default SignInPage;
