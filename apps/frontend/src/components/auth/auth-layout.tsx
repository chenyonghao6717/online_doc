import { Button } from "@/components/ui/button";
import { useLocation, NavLink, Outlet } from "react-router";
import SvgLogo from "@/assets/logo";

const AuthLayout = () => {
  const pathname = useLocation().pathname;

  const signInPath = "/sign-in";
  const signInButtonText = "Login";
  const signUpPath = "/sign-up";
  const signUpButtonText = "Sign Up";
  const isSignIn = pathname === signInPath;

  return (
    <div className="bg-neutral-100 min-h-screen">
      <div className="p-4 h-full">
        <nav className="flex justify-between items-center">
          <NavLink to="/">
            <SvgLogo width={36} height={36} />
          </NavLink>
          <Button asChild variant="secondary" className="bg-white">
            <NavLink to={isSignIn ? signUpPath : signInPath}>
              {isSignIn ? signUpButtonText : signInButtonText}
            </NavLink>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
