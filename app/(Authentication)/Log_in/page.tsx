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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);
  const [codeSent, setCodeSent] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) return setErrorMsg("Please enter your email.");

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return setErrorMsg("Supabase keys are missing.");

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { shouldCreateUser: false },
      });

      if (error) {
        setIsLoading(false);
        return setErrorMsg(toFriendlyAuthMessage(error.message ?? "Failed to send code."));
      }

      setCodeSent(true);
      // Go to OTP verify page — it handles role-based redirect after verifying
      router.push(
        `${AUTH_ROUTES.otpVerify}?email=${encodeURIComponent(email.trim().toLowerCase())}&type=login`
      );
    } catch {
      setIsLoading(false);
      setErrorMsg("Something went wrong. Please try again.");
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
        <div className="auth-form-enter relative z-20 w-full max-w-md lg:flex lg:min-h-[580px] lg:flex-col lg:justify-start lg:pt-12">
          <div className="mb-7 mt-1.5 flex h-16 items-center justify-center">
            <h1 className="text-center text-4xl font-bold text-zinc-900">Welcome Back !!</h1>
          </div>

          {!codeSent ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <p className="text-center text-sm text-zinc-500">
                Enter your email — we'll send you a sign-in code.
              </p>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 w-full rounded-full border border-zinc-200 bg-white px-6 text-sm text-zinc-900 outline-none transition focus:border-[#5f97ee] focus:ring-4 focus:ring-[#5f97ee]/15"
              />
              {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#5f97ee] hover:bg-[#4f87de] active:bg-[#3f76cd]"
              >
                {isLoading ? "Sending code..." : "Send Sign-in Code"}
              </Button>
            </form>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-6 text-center">
              <p className="text-sm font-semibold text-zinc-700">Code sent to</p>
              <p className="mt-1 text-sm text-[#5f97ee]">{email}</p>
              <p className="mt-3 text-xs text-zinc-500">Check your inbox and enter the code on the next page.</p>
            </div>
          )}

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
          {socialLoading && (
            <p className="mt-3 text-center text-xs text-zinc-500">
              Redirecting to {socialLoading === "google" ? "Google" : "Apple"}...
            </p>
          )}
          <p className="mt-4 text-center text-xs text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link href={AUTH_ROUTES.signup} className="font-semibold text-zinc-900 underline">
              Sign Up
            </Link>
          </p>
        </div>
        <div className="auth-visual-enter">
          <AuthStudentIllustration imageSrc="/User_Image/Display.png" alt="Library display" />
        </div>
      </div>
    </div>
  );
}