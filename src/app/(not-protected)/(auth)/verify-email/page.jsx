"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import api from "@/lib/axios";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = React.useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the link.");
      return;
    }

    api
      .get(`/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus("success");
        setMessage("Your email has been verified successfully!");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err?.response?.data?.message ||
            "This verification link is invalid or has expired."
        );
      });
  }, [token]);

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1px_1.2fr] md:gap-16">
          {/* Left Column */}
          <div className="flex flex-col items-center space-y-10 py-4 md:items-start">
            <div className="space-y-4 text-center md:text-left">
              <CustomBreadcrumb
                items={[
                  { label: "Home" },
                  { label: "Register" },
                  { label: "Verify Email" },
                ]}
                className="mb-4"
              />
              <div className="flex flex-col items-center space-y-2 md:items-start">
                <Link href="/" className="text-3xl font-bold tracking-tight">
                  Context<span className="text-blue-600">GPT</span>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">
                  Email Verification
                </h1>
                <p className="text-muted-foreground max-w-sm text-lg">
                  We're confirming your email address to activate your
                  ContextGPT account.
                </p>
              </div>
            </div>
          </div>

          {/* Vertical Separator */}
          <div className="bg-border/50 hidden h-full self-stretch md:block md:w-px" />
          <div className="bg-border/50 w-full md:hidden" style={{ height: 1 }} />

          {/* Right Column: Status */}
          <div className="flex flex-col items-center justify-center space-y-6 py-4 text-center">
            {status === "loading" && (
              <>
                <Loader2 className="text-primary h-14 w-14 animate-spin" />
                <p className="text-muted-foreground text-lg">
                  Verifying your email, please wait…
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="h-14 w-14 text-green-500" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Congrats! You're verified</h2>
                  <p className="text-muted-foreground">{message}</p>
                </div>
                <Button asChild className="h-11 px-8 text-base font-semibold">
                  <Link href="/login">Sign in to your account</Link>
                </Button>
              </>
            )}

            {status === "error" && (
              <>
                <XCircle className="h-14 w-14 text-destructive" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Verification failed</h2>
                  <p className="text-muted-foreground">{message}</p>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <Button asChild variant="outline" className="h-11 px-8 text-base">
                    <Link href="/signup">Register again</Link>
                  </Button>
                  <Link
                    href="/login"
                    className="text-primary text-sm font-semibold hover:underline"
                  >
                    Back to login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
