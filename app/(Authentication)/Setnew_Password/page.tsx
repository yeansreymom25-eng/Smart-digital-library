"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthStudentIllustration from "@/components/auth/AuthStudentIllustration";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { AUTH_ROUTES } from "@/src/lib/authFlow";
import { getSupabaseBrowserClient } from "@/src/lib/supabaseBrowser";

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M10.6 10.6A2 2 0 0012 16a2 2 0 001.4-.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9.9 5.1A10.3 10.3 0 0112 4c7 0 10 8 10 8a17 17 0 01-4.2 5.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6.1 6.1C3.6 8.2 2 12 2 12s3 8 10 8c1.1 0 2.1-.2 3-.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function getTokensFromHash() {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash; // like: #access_token=...&refresh_token=...
  if (!hash || !hash.includes("access_token")) return null;

  const params = new URLSearchParams(hash.replace("#", ""));
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");

  if (!access_token || !refresh_token) return null;
  return { access_token, refresh_token };
}

export default function SetNewPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [ready, setReady] = useState(false);

  // Ensure we have a recovery session from the email link
  useEffect(() => {
    let mounted = true;

    async function init() {
      setMessage("");
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        if (mounted) {
          setMessage("Supabase keys are missing. Please configure your environment variables.");
        }
        return;
      }

      // 1) Try normal session
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        if (mounted) setReady(true);
        return;
      }

      // 2) App Router recovery links can include an auth code in the query string.
      const code =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("code")
          : null;
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (mounted) {
            setReady(false);
            setMessage(
              "Reset link is invalid or expired. Please request a new password reset email."
            );
          }
          return;
        }
        if (mounted) setReady(true);
        return;
      }

      // 3) If not, try to read tokens from URL hash and set session
      const tokens = getTokensFromHash();
      if (tokens) {
        const { error } = await supabase.auth.setSession(tokens);
        if (error) {
          if (mounted) {
            setReady(false);
            setMessage(
              "Session missing. Please open the reset link from your email again (it may have expired)."
            );
          }
          return;
        }
        if (mounted) setReady(true);
        return;
      }

      // 4) No session and no tokens => user opened page directly
      if (mounted) {
        setReady(false);
        setMessage(
          "Session missing. Please open the reset link from your email again (it may have expired)."
        );
      }
    }

    void init();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleUpdatePassword() {
    if (!ready) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Supabase keys are missing. Please configure your environment variables.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Password updated successfully. Redirecting...");
    setLoading(false);

    // Optional: go to login page
    setTimeout(() => router.push(AUTH_ROUTES.login), 800);
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-white text-zinc-900 flex items-center">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:py-6 xl:gap-24">
        <div className="auth-form-enter relative z-20 w-full max-w-md lg:flex lg:min-h-[580px] lg:flex-col lg:justify-start lg:pt-12">
          <div className="mb-7 mt-1.5 flex h-16 items-center justify-center">
            <h1 className="text-center text-4xl font-bold text-zinc-900">Set New Password</h1>
          </div>

          <div className="space-y-5">
            <p className="text-center text-sm leading-6 text-zinc-500">
              Enter your new password below so you can get back into your account safely.
            </p>

            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              type={showPassword ? "text" : "password"}
              rightIcon={showPassword ? <EyeIcon /> : <EyeOffIcon />}
              onRightIconClick={() => setShowPassword((value) => !value)}
              rightIconLabel={showPassword ? "Hide password" : "Show password"}
            />

            <Input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm password"
              type={showConfirm ? "text" : "password"}
              rightIcon={showConfirm ? <EyeIcon /> : <EyeOffIcon />}
              onRightIconClick={() => setShowConfirm((value) => !value)}
              rightIconLabel={showConfirm ? "Hide confirm password" : "Show confirm password"}
            />

            <Button
              type="button"
              onClick={handleUpdatePassword}
              disabled={loading || !ready}
              className="bg-[#5f97ee] hover:bg-[#4f87de] active:bg-[#3f76cd]"
            >
              {loading ? "Updating..." : "Update password"}
            </Button>

            {message && (
              <p
                className={`text-center text-sm ${
                  message.toLowerCase().includes("success") ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}

            <p className="text-center text-xs text-zinc-500">
              Back to{" "}
              <Link
                href={AUTH_ROUTES.login}
                className="font-semibold text-zinc-900 underline underline-offset-2"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-visual-enter">
          <AuthStudentIllustration
            imageSrc="/User_Image/Display.png"
            alt="Library display while setting a new password"
          />
        </div>
      </div>
    </div>
  );
}
