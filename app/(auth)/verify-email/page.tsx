import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { VerifyEmailForm } from "@/components/auth/recovery-forms";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Verify Email",
  description:
    "Verify your Go FlashArch email address so checkout, order tracking, and flash sale access stay uninterrupted.",
  path: "/verify-email",
  noIndex: true,
});

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
