"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AuthStudentIllustration from "@/components/auth/AuthStudentIllustration";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/src/lib/authFlow";
import { toFriendlyAuthMessage } from "@/src/lib/authMessages";
import { signInWithSocialProvider, type SocialProvider } from "@/src/lib/socialAuth";
import { getSupabaseBrowserClient } from "@/src/lib/supabaseBrowser";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      return setErrorMsg("Please fill all fields.");
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return setErrorMsg(
        "Supabase keys are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local."
      );
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setIsLoading(false);
        return setErrorMsg(toFriendlyAuthMessage(error.message || "Login failed."));
      }

      router.push(AUTH_ROUTES.dashboard);
    } catch {
      setIsLoading(false);
      return setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSocialLogin(provider: SocialProvider) {
    setErrorMsg(null);
    setSocialLoading(provider);

    try {
      await signInWithSocialProvider(provider, "login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to continue with social sign-in.";
      setErrorMsg(toFriendlyAuthMessage(message));
      setSocialLoading(null);
    }
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-white text-zinc-900 flex items-center">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:py-6 xl:gap-24">
        <div className="relative z-20 w-full max-w-md lg:flex lg:min-h-[580px] lg:flex-col lg:justify-start lg:pt-12">
          <div className="mb-7 mt-1.5 flex h-16 items-center justify-center">
            <h1 className="text-center text-4xl font-bold text-zinc-900">Welcome Back !!</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4.5">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 w-full rounded-full border border-zinc-200 bg-white px-6 text-sm text-zinc-900 outline-none transition focus:border-[#5f97ee] focus:ring-4 focus:ring-[#5f97ee]/15"
            />

            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 w-full rounded-full border border-zinc-200 bg-white px-6 pr-12 text-sm text-zinc-900 outline-none transition focus:border-[#5f97ee] focus:ring-4 focus:ring-[#5f97ee]/15"
              />
              <span className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-zinc-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M3 3l18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
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
              </span>
            </div>

            <div className="text-right text-xs font-medium text-zinc-500">
              <Link href={AUTH_ROUTES.forgotPassword}>Forgot Password ?</Link>
            </div>

            {errorMsg && <p className="mt-4 text-sm text-red-500">{errorMsg}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#5f97ee] hover:bg-[#4f87de] active:bg-[#3f76cd]"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          <p className="mt-4 text-center text-[11px] text-zinc-400">Continue with :</p>

          <div className="mt-3 flex items-center justify-center gap-8">
            <button
              type="button"
              onClick={() => void handleSocialLogin("google")}
              disabled={socialLoading !== null}
              className="rounded-full p-2 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Continue with Google"
            >
              <Image src="/User_Image/google.png" alt="Google" width={26} height={26} />
            </button>
            <button
              type="button"
              onClick={() => void handleSocialLogin("apple")}
              disabled={socialLoading !== null}
              className="rounded-full p-2 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Continue with Apple"
            >
              <Image src="/User_Image/apple.png" alt="Apple" width={46} height={46} />
            </button>
          </div>

          {socialLoading ? (
            <p className="mt-3 text-center text-xs text-zinc-500">
              Redirecting to {socialLoading === "google" ? "Google" : "Apple"}...
            </p>
          ) : null}

          <p className="mt-4 text-center text-xs text-zinc-500">
            Don’t have an account?{" "}
            <Link href={AUTH_ROUTES.signup} className="font-semibold text-zinc-900 underline">
              Sign Up
            </Link>
          </p>
        </div>

        <AuthStudentIllustration imageSrc="/User_Image/Display.png" alt="Library display" />
      </div>
    </div>
  );
}
