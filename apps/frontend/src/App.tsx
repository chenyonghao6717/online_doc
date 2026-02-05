import { BrowserRouter, Routes, Route } from "react-router";
import Providers from "@/components/provider";
import AuthLayout from "@/components/auth/auth-layout";
import SignInPage from "@/components/auth/sign-in-page";
import SignUpPage from "@/components/auth/sign-up-page";
import Home from "@/components/home/home";

function App() {
  return (
    <BrowserRouter>
      <Providers>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
          </Route>
          <Route path="/" element={<Home />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  );
}

export default App;
