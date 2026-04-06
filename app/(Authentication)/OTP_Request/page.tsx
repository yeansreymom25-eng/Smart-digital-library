"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthStudentIllustration from "@/components/auth/AuthStudentIllustration";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { AUTH_ROUTES } from "@/src/lib/authFlow";
import { toFriendlyAuthMessage } from "@/src/lib/authMessages";
import { getClientAppOrigin } from "@/src/lib/siteUrl";
import { getSupabaseBrowserClient } from "@/src/lib/supabaseBrowser";

export default function OtpRequestPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setMsg("Email is required.");
      setLoading(false);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMsg("Supabase keys are missing. Please configure your environment variables.");
      setLoading(false);
      return;
    }

    const redirectTo =
      typeof window !== "undefined"
        ? `${getClientAppOrigin()}${AUTH_ROUTES.otpVerify}?email=${encodeURIComponent(cleanEmail)}&type=login`
        : undefined;

    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: redirectTo,
      },
    });

    setLoading(false);

    if (error) {
      return setMsg(toFriendlyAuthMessage(error.message));
    }

    router.push(`${AUTH_ROUTES.otpVerify}?email=${encodeURIComponent(cleanEmail)}&type=login`);
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-white text-zinc-900 flex items-center">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:py-6 xl:gap-24">
        <div className="auth-form-enter relative z-20 w-full max-w-md lg:flex lg:min-h-[580px] lg:flex-col lg:justify-start lg:pt-12">
          <div className="mb-7 mt-1.5 flex h-16 items-center justify-center">
            <h1 className="text-center text-4xl font-bold text-zinc-900">Continue With Email</h1>
          </div>

          <form onSubmit={sendOtp} className="space-y-5">
            <p className="text-center text-sm leading-6 text-zinc-500">
              Enter your account email. We’ll send you a verification code so you can continue inside your account.
            </p>

            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />

            {msg && (
              <p
                className={`text-sm ${
                  msg.toLowerCase().includes("sent") ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {msg}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="bg-[#5f97ee] hover:bg-[#4f87de] active:bg-[#3f76cd]"
            >
              {loading ? "Sending..." : "Send verification code"}
            </Button>

            <p className="text-center text-xs text-zinc-500">
              Don&apos;t have an account?{" "}
              <Link href={AUTH_ROUTES.signup} className="font-semibold text-zinc-900 underline">
                Create one first
              </Link>
            </p>
          </form>
        </div>

        <div className="auth-visual-enter">
          <AuthStudentIllustration
            imageSrc="/User_Image/Display.png"
            alt="Library display while requesting a verification code"
          />
        </div>
      </div>
    </div>
  );
}
