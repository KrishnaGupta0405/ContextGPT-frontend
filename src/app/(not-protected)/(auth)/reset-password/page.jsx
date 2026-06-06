"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
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
import api from "@/lib/axios";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const loadingBarRef = React.useRef(null);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Reset token is missing. Please use the link from your email.");
      return;
    }
    loadingBarRef.current.continuousStart();
    const toastId = toast.loading("Resetting your password...");
    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Password reset successfully! You can now log in.", {
        id: toastId,
      });
      router.push("/login");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Something went wrong. Please try again.",
        { id: toastId }
      );
    } finally {
      loadingBarRef.current.complete();
    }
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12">
      <LoadingIndicator ref={loadingBarRef} />
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1px_1.2fr] md:gap-16">
          {/* Left Column */}
          <div className="flex flex-col items-center space-y-10 py-4 md:items-start">
            <div className="space-y-4 text-center md:text-left">
              <CustomBreadcrumb
                items={[
                  { label: "Home" },
                  { label: "Login" },
                  { label: "Reset Password" },
                ]}
                className="mb-4"
              />
              <div className="flex flex-col items-center space-y-2 md:items-start">
                <Link href="/" className="text-3xl font-bold tracking-tight">
                  Context<span className="text-blue-600">GPT</span>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">
                  Set a new password
                </h1>
                <p className="text-muted-foreground max-w-sm text-lg">
                  Enter your new password below. Make sure it's at least 6
                  characters long.
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
            {!token ? (
              <div className="space-y-4 text-center">
                <p className="text-destructive font-medium">
                  Invalid reset link. Please request a new one.
                </p>
                <Button asChild variant="outline">
                  <Link href="/forgot-password">Forgot Password</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNew ? "text" : "password"}
                          placeholder="••••••••"
                          {...register("newPassword")}
                          className={
                            errors.newPassword
                              ? "border-destructive focus-visible:ring-destructive/20 pr-10"
                              : "pr-10"
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew((v) => !v)}
                          className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                          tabIndex={-1}
                        >
                          {showNew ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <FieldError errors={[errors.newPassword]} />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirm ? "text" : "password"}
                          placeholder="••••••••"
                          {...register("confirmPassword")}
                          className={
                            errors.confirmPassword
                              ? "border-destructive focus-visible:ring-destructive/20 pr-10"
                              : "pr-10"
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                          tabIndex={-1}
                        >
                          {showConfirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <FieldError errors={[errors.confirmPassword]} />
                    </Field>

                    <Button
                      type="submit"
                      className="h-11 w-full text-base font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Resetting..." : "Reset Password"}
                    </Button>
                  </FieldGroup>
                </form>
              </div>
            )}

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
