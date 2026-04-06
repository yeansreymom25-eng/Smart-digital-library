"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import AuthStudentIllustration from "@/components/auth/AuthStudentIllustration";
import Button from "@/components/ui/Button";
import { AUTH_ROUTES, clearPendingSignup, readPendingSignup } from "@/src/lib/authFlow";
import { toFriendlyAuthMessage } from "@/src/lib/authMessages";
import { getSupabaseBrowserClient } from "@/src/lib/supabaseBrowser";

function getTokensFromHash() {
  if (typeof window === "undefined") {
    return null;
  }

  const hash = window.location.hash;
  if (!hash || !hash.includes("access_token")) {
    return null;
  }

  const params = new URLSearchParams(hash.replace("#", ""));
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");

  if (!access_token || !refresh_token) {
    return null;
  }

  return { access_token, refresh_token };
}

function OTPVerifyInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email");
  const rawType = searchParams.get("type");
  const type = rawType === "recovery" ? "recovery" : rawType === "login" ? "login" : "signup";

  const [otp, setOtp] = useState<string[]>(Array(8).fill(""));
  const [message, setMessage] = useState<string>("");
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [linkModeLoading, setLinkModeLoading] = useState(false);

  // Simple countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  // Auto-submit when all 8 digits filled
  const finalOtp = useMemo(() => otp.join(""), [otp]);
  useEffect(() => {
    if (finalOtp.length === 8 && !loading) {
      void handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalOtp]);

  async function finalizePendingSignup(supabase: SupabaseClient) {
    const pendingSignup = readPendingSignup();

    if (!pendingSignup?.password) {
      setMessage(
        "Your email was confirmed, but the signup session no longer has your password. Please create your account again from the signup page."
      );
      await supabase.auth.signOut();
      return false;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: pendingSignup.password,
      data: {
        full_name: pendingSignup.fullName,
      },
    });

    if (updateError) {
      setMessage(toFriendlyAuthMessage(updateError.message));
      return false;
    }

    clearPendingSignup();
    return true;
  }

  useEffect(() => {
    if (type === "recovery") {
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    const supabaseClient = supabase;

    let mounted = true;

    async function handleLinkConfirmation() {
      const code =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("code")
          : null;

      const tokens = getTokensFromHash();
      const pendingSignup = readPendingSignup();

      if (!code && !tokens) {
        const { data } = await supabaseClient.auth.getSession();
        const sessionEmail = data.session?.user?.email?.toLowerCase();

        if (!data.session) {
          return;
        }

        if (type === "signup" && !pendingSignup?.password) {
          return;
        }

        if (email && sessionEmail && sessionEmail !== email.toLowerCase()) {
          return;
        }
      }

      if (type === "signup" && !pendingSignup?.password) {
        return;
      }

      setLinkModeLoading(true);
      setMessage(
        type === "login"
          ? "Signing you in from your email link..."
          : "Finishing verification from your email link..."
      );

      if (code) {
        const { error } = await supabaseClient.auth.exchangeCodeForSession(code);
        if (error) {
          if (mounted) {
            setMessage(toFriendlyAuthMessage(error.message));
            setLinkModeLoading(false);
          }
          return;
        }
      } else if (tokens) {
        const { error } = await supabaseClient.auth.setSession(tokens);
        if (error) {
          if (mounted) {
            setMessage(toFriendlyAuthMessage(error.message));
            setLinkModeLoading(false);
          }
          return;
        }
      }

      if (type === "signup") {
        const completed = await finalizePendingSignup(supabaseClient);
        if (!mounted) {
          return;
        }

        if (!completed) {
          setLinkModeLoading(false);
          return;
        }
      }

      router.replace(AUTH_ROUTES.dashboard);
    }

    void handleLinkConfirmation();

    return () => {
      mounted = false;
    };
  }, [email, router, type]);

  async function handleVerify() {
    if (!email) {
      setMessage("Email missing. Please go back and request OTP again.");
      return;
    }

    if (finalOtp.length !== 8) return;

    setLoading(true);
    setMessage("");

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Supabase keys are missing. Please configure your environment variables.");
      setLoading(false);
      return;
    }

    const verifyType = type === "recovery" ? "recovery" : "email";
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: finalOtp,
      type: verifyType,
    });

    if (error) {
      setMessage(toFriendlyAuthMessage(error.message));
      setLoading(false);
      return;
    }

    if (type === "signup") {
      const completed = await finalizePendingSignup(supabase);
      if (!completed) {
        setLoading(false);
        return;
      }
    }

    router.push(AUTH_ROUTES.dashboard);
  }

  async function handleResend() {
    if (!email) {
      setMessage("Email missing. Please go back and request OTP again.");
      return;
    }
    if (cooldown > 0) return;

    setMessage("");
    const response = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: (() => {
        const pendingSignup = readPendingSignup();
        return JSON.stringify({
          email,
          type,
          password: pendingSignup?.password,
          fullName: pendingSignup?.fullName,
        });
      })(),
    });
    const result = (await response.json()) as {
      success: boolean;
      message: string;
    };

    if (!response.ok || !result.success) {
      setMessage(toFriendlyAuthMessage(result.message || "Unable to resend OTP."));
      return;
    }

    setMessage(result.message);
    setOtp(Array(8).fill(""));
    setCooldown(30);

    // focus first box again
    setTimeout(() => {
      document.getElementById("otp-0")?.focus();
    }, 50);
  }

  useEffect(() => {
    if (email) {
      return;
    }

    const pendingSignup = readPendingSignup();
    if (type === "signup" && pendingSignup?.email) {
      router.replace(`${AUTH_ROUTES.otpVerify}?email=${encodeURIComponent(pendingSignup.email)}&type=signup`);
      return;
    }

    router.replace(
      type === "login" ? AUTH_ROUTES.emailContinue : type === "recovery" ? AUTH_ROUTES.login : AUTH_ROUTES.signup
    );
  }, [email, router, type]);

  function setDigit(index: number, value: string) {
    const v = value.replace(/[^0-9]/g, "").slice(0, 1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });

    if (v && index < 7) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  function onKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (otp[index]) {
        // clear current digit
        setOtp((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
        return;
      }
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    }
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-white text-zinc-900 flex items-center">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:py-6 xl:gap-24">
        <div className="auth-form-enter relative z-20 w-full max-w-md lg:flex lg:min-h-[580px] lg:flex-col lg:justify-start lg:pt-12">
          <div className="mb-7 mt-1.5 flex h-16 items-center justify-center">
            <h1 className="text-center text-4xl font-bold text-zinc-900">Check Your Email</h1>
          </div>

          <div className="space-y-5">
            <p className="text-center text-sm leading-6 text-zinc-500">
                  {type === "recovery"
                    ? "We sent a reset verification email to "
                    : type === "login"
                    ? "We sent a sign-in code to "
                    : "We sent a verification email to "}
                  <span className="font-medium text-zinc-700"> {email ?? "your email"}</span>
                  . Enter the 8-digit verification code below to continue.
            </p>

            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => setDigit(index, e.target.value)}
                  onKeyDown={(e) => onKeyDown(index, e)}
                  className="h-14 w-14 rounded-2xl border border-zinc-200 bg-white text-center text-xl font-semibold text-zinc-900 outline-none transition focus:border-[#5f97ee] focus:ring-4 focus:ring-[#5f97ee]/15 md:h-16 md:w-16 md:text-2xl"
                />
              ))}
            </div>

            <div className="text-center text-xs text-zinc-500">
              Didn’t receive code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0}
                className="font-semibold text-[#5f97ee] underline underline-offset-2 disabled:opacity-40"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
              </button>
            </div>

            {message && (
              <p
                className={`text-center text-sm ${
                  message.toLowerCase().includes("sent") ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}

            <Button
              type="button"
              onClick={handleVerify}
              disabled={loading || linkModeLoading || finalOtp.length !== 8}
              className="bg-[#5f97ee] hover:bg-[#4f87de] active:bg-[#3f76cd]"
            >
                  {loading || linkModeLoading
                    ? "Verifying..."
                    : type === "recovery"
                      ? "Continue"
                      : type === "login"
                        ? "Continue to dashboard"
                        : "Verify account"}
            </Button>

            <div className="text-center text-xs text-zinc-500">
              <Link
                href={
                  type === "login"
                    ? AUTH_ROUTES.emailContinue
                    : type === "recovery"
                      ? AUTH_ROUTES.login
                      : AUTH_ROUTES.signup
                }
                className="font-semibold underline underline-offset-2 hover:text-zinc-700"
              >
                Change email
              </Link>
            </div>
          </div>
        </div>

        <div className="auth-visual-enter">
          <AuthStudentIllustration
            imageSrc="/User_Image/Display.png"
            alt="Library display while entering a verification code"
          />
        </div>
      </div>
    </div>
  );
}

export default function OTPVerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-transparent" /> }>
      <OTPVerifyInner />
    </Suspense>
  );
}
