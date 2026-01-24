import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import Link from "next/link";
import { FormFieldWrapper } from "@/components/auth/form-field-wrapper";
import { loginSchema, LoginSchemaType } from "@/schemas/auth-schemas";
import DottedSeparator from "@/components/separators/dotted-separator";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useAppStore } from "@/store/app-store";

const SignInCard = () => {
  const { startLoading, stopLoading } = useAppStore();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchemaType) => {
    startLoading();
    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: "/",
        rememberMe: true,
      });

      if (error) {
        toast.error(error.message);
      }
    } finally {
      stopLoading();
    }
  };

  return (
    <Card className="w-full h-full md:w-[550px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl ">Welcome back!</CardTitle>
      </CardHeader>
      <div className="px-7 mb-2">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormFieldWrapper
              name="email"
              type="email"
              placeholder="Enter email address"
              control={form.control}
            />
            <FormFieldWrapper
              name="password"
              type="password"
              placeholder="Enter password"
              control={form.control}
            />
            <Button size="lg" className="w-full ">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button variant="secondary" size="lg" className="w-full">
          <FcGoogle className="mr-2 size-5" />
          Login with Google
        </Button>
        <Button variant="secondary" size="lg" className="w-full">
          <FaGithub className="mr-2 size-5" />
          Login with Github
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up">
            <span className="text-blue-700">Sign Up</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignInCard;
