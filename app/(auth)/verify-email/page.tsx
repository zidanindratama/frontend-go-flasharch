import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { VerifyEmailForm } from "@/components/auth/recovery-forms";

export const metadata: Metadata = {
  title: "Verify Email | Go FlashArch",
  description: "Email verification UI for Go FlashArch.",
};

export default function VerifyEmailPage() {
  return (
    <AuthShell
      eyebrow="Email verification"
      title="Finish setting up your account."
      description="Verify your email so you can sign in and continue checkout without interruption."
      mode="verify"
    >
      <VerifyEmailForm />
    </AuthShell>
  );
}
