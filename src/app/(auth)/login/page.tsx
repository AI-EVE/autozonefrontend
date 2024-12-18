"use client";
import { LoginFormSchema } from "@/lib/types";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import PasswordShowHide from "@/components/password-show-hide";
import Link from "next/link";

import Image from "next/image";
import Logo from "../../../../public/IMG_7903-removebg-preview.png";

import { loginUser } from "@/lib/actions/authActions";
import { useToast } from "@/hooks/use-toast";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@/components/toast-items";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";

type LoginFormSchemaTypes = z.infer<typeof LoginFormSchema>;
const Page = () => {
  const [isShowPass, setIsShowPass] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    try {
      const { data, error } = await loginUser(values);
      if (error) {
        throw new Error(error);
      }

      localStorage.setItem("auto-zone-token", data.token);

      router.replace("/");

      toast({
        className: "bg-green-700",
        title: "Welcome back.",
        description: (
          <SuccessToastDescription message="Glad to see you again." />
        ),
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: <ErorrToastDescription error={error.message} />,
      });
    }
  }

  return (
    <div className=" space-y-10  min-w-[97%px] w-[700px] max-w-[700px]">
      <Link href="/">
        <Image src={Logo} alt="Auto zone logo" className=" m-auto w-[200px]" />
      </Link>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
          <FormField
            disabled={isLoading}
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormDescription>Enter username</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <PasswordShowHide<LoginFormSchemaTypes>
            onChange={setIsShowPass}
            disabled={isLoading}
            show={isShowPass}
            labelText={"Password"}
            placeholder="Password"
            fieldName={"password"}
            control={form.control}
            description="Enter your password."
          />

          <div className=" flex flex-col  pt-10   gap-2  ">
            <Button type="submit" disabled={isLoading}>
              {!isLoading ? (
                "Login"
              ) : (
                <LoaderCircle size={20} className="  animate-spin" />
              )}
            </Button>
            <Button variant="secondary" asChild disabled={isLoading}>
              <Link href="/signup">Don&apos;t have and account? Login</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Page;
