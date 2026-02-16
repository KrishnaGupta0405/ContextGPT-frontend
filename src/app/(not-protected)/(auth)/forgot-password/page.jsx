"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import { toast } from "sonner";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const loadingBarRef = React.useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    loadingBarRef.current.continuousStart();
    const toastId = toast.loading("Processing your request...");

    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.info("Backend route not yet configured", {
      id: toastId,
    });
    loadingBarRef.current.complete();
    console.log("Forgot password requested for:", data.email);
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12">
      <LoadingIndicator ref={loadingBarRef} />
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1px_1.2fr] md:gap-16">
          {/* Left Column: Branding & Info */}
          <div className="flex flex-col items-center space-y-10 py-4 md:items-start">
            <div className="space-y-4 text-center md:text-left">
              <CustomBreadcrumb
                items={[
                  { label: "Home" },
                  { label: "Login" },
                  { label: "Forgot Password" },
                ]}
                className="mb-4"
              />
              <div className="flex flex-col items-center space-y-2 md:items-start">
                <Link href="/" className="text-3xl font-bold tracking-tight">
                  Context<span className="text-blue-600">GPT</span>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">
                  Reset your password
                </h1>
                <p className="text-muted-foreground max-w-sm text-lg">
                  Enter your email address and we'll send you a link to reset
                  your password if it exists in our database.
                </p>
              </div>
            </div>
          </div>

          {/* Vertical Separator */}
          <Separator
            orientation="vertical"
            className="bg-border/50 hidden h-full self-stretch md:block"
          />
          <Separator
            orientation="horizontal"
            className="bg-border/50 w-full md:hidden"
          />

          {/* Right Column: Form */}
          <div className="flex flex-col justify-center space-y-8 py-4">
            <div className="grid gap-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email address</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      {...register("email")}
                      className={
                        errors.email
                          ? "border-destructive focus-visible:ring-destructive/20"
                          : ""
                      }
                    />
                    <FieldError errors={[errors.email]} />
                  </Field>

                  <Button
                    type="submit"
                    className="h-11 w-full text-base font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending link..." : "Send Reset Link"}
                  </Button>
                </FieldGroup>
              </form>
            </div>

            <p className="text-muted-foreground text-center text-sm">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
