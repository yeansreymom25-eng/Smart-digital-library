"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthStudentIllustration from "@/components/auth/AuthStudentIllustration";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { AUTH_ROUTES } from "@/src/lib/authFlow";
import { getSupabaseBrowserClient } from "@/src/lib/supabaseBrowser";
import { toFriendlyAuthMessage } from "@/src/lib/authMessages";

export type PasswordMode = "social-signup" | "account";

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

function getPageCopy(mode: PasswordMode) {
  if (mode === "social-signup") {
    return {
      title: "Create your password",
      subtitle:
        "Your Google account is ready. Add a password now so you can log in with either Google or email/password later.",
      button: "Save password and continue",
      success: "Password saved. Redirecting to your dashboard...",
    };
  }

  return {
    title: "Update password",
    subtitle:
      "Set or change your password while you are signed in. You can still keep using Google too.",
    button: "Update password",
    success: "Password updated. Redirecting to your dashboard...",
  };
}

export default function UpdatePasswordClient({ mode }: { mode: PasswordMode }) {
  const router = useRouter();
  const copy = useMemo(() => getPageCopy(mode), [mode]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadSession() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        if (alive) {
          setReady(false);
          setMessage("Supabase keys are missing. Please configure your environment variables.");
        }
        return;
      }

      const sessionResult = await supabase.auth.getSession();
      if (!alive) {
        return;
      }

      if (sessionResult.error) {
        setReady(false);
        setMessage(toFriendlyAuthMessage(sessionResult.error.message));
        return;
      }

      const user = sessionResult.data.session?.user;
      if (!user) {
        setReady(false);
        setMessage("Please sign in first, or use Forgot Password if you already have an account.");
        return;
      }

      setEmail(user.email ?? "");
      setReady(true);
      setMessage("");
    }

    void loadSession();

    return () => {
      alive = false;
    };
  }, []);

  const canSubmit =
    ready &&
    !loading &&
    password.length >= 6 &&
    confirmPassword.length >= 6 &&
    password === confirmPassword;

  async function handleUpdatePassword() {
    if (!canSubmit) {
      if (password.length < 6) {
        setMessage("Password must be at least 6 characters.");
        return;
      }

      if (password !== confirmPassword) {
        setMessage("Passwords do not match.");
      }
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Supabase keys are missing. Please configure your environment variables.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setLoading(false);
      setMessage(toFriendlyAuthMessage(error.message));
      return;
    }

    setLoading(false);
    setMessage(copy.success);
    window.setTimeout(() => router.replace(AUTH_ROUTES.dashboard), 700);
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-white text-zinc-900 flex items-center">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:py-6 xl:gap-24">
        <div className="auth-form-enter relative z-20 w-full max-w-md lg:flex lg:min-h-[580px] lg:flex-col lg:justify-start lg:pt-12">
          <div className="mb-7 mt-1.5 flex h-16 items-center justify-center">
            <h1 className="text-center text-4xl font-bold text-zinc-900">{copy.title}</h1>
          </div>

          <div className="space-y-5">
            <div className="text-center text-sm leading-6 text-zinc-500">
              <p>{copy.subtitle}</p>
              {email ? (
                <p className="mt-2">
                  Signed in as <span className="font-medium text-zinc-700">{email}</span>
                </p>
              ) : null}
            </div>

            <Input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="New password"
              type={showPassword ? "text" : "password"}
              rightIcon={showPassword ? <EyeIcon /> : <EyeOffIcon />}
              onRightIconClick={() => setShowPassword((value) => !value)}
              rightIconLabel={showPassword ? "Hide password" : "Show password"}
            />

            <Input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              rightIcon={showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
              onRightIconClick={() => setShowConfirmPassword((value) => !value)}
              rightIconLabel={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            />

            <Button
              type="button"
              onClick={handleUpdatePassword}
              disabled={!ready || loading}
              className="bg-[#5f97ee] hover:bg-[#4f87de] active:bg-[#3f76cd]"
            >
              {loading ? "Saving..." : copy.button}
            </Button>

            {message ? (
              <p
                className={`text-center text-sm ${
                  message.toLowerCase().includes("redirecting") ||
                  message.toLowerCase().includes("updated") ||
                  message.toLowerCase().includes("saved")
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >
                {message}
              </p>
            ) : null}

            <div className="text-center text-xs text-zinc-500">
              Forgot the password later?{" "}
              <Link
                href={AUTH_ROUTES.forgotPassword}
                className="font-semibold text-zinc-900 underline underline-offset-2"
              >
                Reset it here
              </Link>
            </div>
          </div>
        </div>

        <div className="auth-visual-enter">
          <AuthStudentIllustration
            imageSrc="/User_Image/Display.png"
            alt="Library display while updating a password"
          />
        </div>
      </div>
    </div>
  );
}
