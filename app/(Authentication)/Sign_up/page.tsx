"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// UI components
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import SocialIcon from "@/components/auth/Socialicon";
import AuthStudentIllustration from "@/components/auth/AuthStudentIllustration";
import AuthRoleSwitch from "@/components/auth/AuthRoleSwitch";
import { AUTH_ROUTES, storePendingSignup } from "@/src/lib/authFlow";
import { toFriendlyAuthMessage } from "@/src/lib/authMessages";
import { signInWithSocialProvider, type SocialProvider } from "@/src/lib/socialAuth";

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

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [accountRole, setAccountRole] = useState<"user" | "admin">("user");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    // Validation for empty fields
    if (!fullName.trim() || !email.trim() || !password || !repeatPassword) {
      return setErrorMsg("Please fill all fields.");
    }

    // Password matching validation
    if (password !== repeatPassword) {
      return setErrorMsg("Passwords do not match.");
    }

    // Terms and conditions checkbox validation
    if (!acceptedTerms) {
      return setErrorMsg("Please accept the terms and privacy policy.");
    }

    try {
      setLoading(true);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
          role: accountRole,
        }),
      });
      const result = (await response.json()) as { success: boolean; error?: string; message?: string };

      if (!response.ok || !result.success) {
        return setErrorMsg(
          toFriendlyAuthMessage(result.error ?? result.message ?? "Unable to create your account.")
        );
      }

      storePendingSignup({
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
        password,
        role: accountRole,
      });
      router.push(`${AUTH_ROUTES.otpVerify}?email=${encodeURIComponent(email.trim().toLowerCase())}&type=signup`);
    } catch {
      setErrorMsg("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignup(provider: SocialProvider) {
    setErrorMsg(null);
    setSocialLoading(provider);

    try {
      await signInWithSocialProvider(provider, "signup");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to continue with social sign-in.";
      setErrorMsg(toFriendlyAuthMessage(message));
      setSocialLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-center lg:gap-16 xl:gap-24">
        <div className="auth-form-enter relative z-20 w-full max-w-md lg:flex lg:h-[620px] lg:flex-col lg:justify-start lg:pt-14">
          <h1 className="mb-8 text-center text-4xl font-bold text-black">Registration</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              placeholder="Name"
              type="text"
              value={fullName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
            />

            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              rightIcon={showPassword ? <EyeIcon /> : <EyeOffIcon />}
              onRightIconClick={() => setShowPassword((value) => !value)}
              rightIconLabel={showPassword ? "Hide password" : "Show password"}
            />

            <Input
              placeholder="Repeat Password"
              type={showRepeatPassword ? "text" : "password"}
              value={repeatPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setRepeatPassword(e.target.value)}
              rightIcon={showRepeatPassword ? <EyeIcon /> : <EyeOffIcon />}
              onRightIconClick={() => setShowRepeatPassword((value) => !value)}
              rightIconLabel={showRepeatPassword ? "Hide repeated password" : "Show repeated password"}
            />

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-[11px] text-zinc-600">
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-white transition ${
                    acceptedTerms ? "bg-[#7bd86b]" : "bg-zinc-300"
                  }`}
                >
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3.5 8.3l2.4 2.4 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="sr-only"
                />
                <span>I accept the terms and privacy policy</span>
              </label>

              <AuthRoleSwitch value={accountRole} onChange={setAccountRole} />
            </div>

            {errorMsg && <div className="text-sm text-red-500">{errorMsg}</div>}

            <Button
              type="submit"
              disabled={loading}
              className="bg-[#5f97ee] hover:bg-[#4f87de] active:bg-[#3f76cd]"
            >
              {loading ? "Creating..." : "Create account"}
            </Button>

            <p className="pt-0.5 text-center text-[11px] text-zinc-500">
              By creating an account or signing you agree to our{" "}
              <span className="font-semibold text-black underline">Terms and Conditions</span>
            </p>


            <p className="text-center text-[11px] text-zinc-400">Continue with :</p>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => void handleSocialSignup("google")}
                disabled={socialLoading !== null}
                className="flex items-center gap-2 rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Image src="/User_Image/google.png" alt="Google" width={20} height={20} />
                {socialLoading === "google" ? "Redirecting..." : "Google"}
              </button>
              <button
                type="button"
                onClick={() => void handleSocialSignup("facebook")}
                disabled={socialLoading !== null}
                className="flex items-center gap-2 rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Image src="/User_Image/facebook.svg" alt="Facebook" width={20} height={20} />
                {socialLoading === "facebook" ? "Redirecting..." : "Facebook"}
              </button>
            </div>

            {socialLoading ? (
              <p className="text-center text-[11px] text-zinc-500">
                Redirecting to {socialLoading === "google" ? "Google" : "Facebook"}...
              </p>
            ) : null}

            <p className="pt-2 text-center text-xs text-zinc-500">
              Already have an account?{" "}
              <Link href={AUTH_ROUTES.login} className="font-semibold text-black underline">
                Login
              </Link>
            </p>
          </form>
        </div>

        <div className="auth-visual-enter">
          <AuthStudentIllustration imageSrc="/User_Image/Display.png" alt="Library display" />
        </div>
      </div>
    </div>
  );
}
