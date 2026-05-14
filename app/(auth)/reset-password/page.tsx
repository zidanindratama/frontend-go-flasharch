import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/recovery-forms";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Reset Password",
  description:
    "Set a new Go FlashArch password with your reset code and return to checkout or order tracking securely.",
  path: "/reset-password",
  noIndex: true,
});

export default function ResetPasswordPage() {
  return (
    <AuthShell
      eyebrow="Credential reset"
      title="Choose a new password."
      description="Use your reset code and set a password you can remember safely."
      mode="recover"
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
