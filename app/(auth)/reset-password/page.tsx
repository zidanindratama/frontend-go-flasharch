import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/recovery-forms";

export const metadata: Metadata = {
  title: "Reset Password | Go FlashArch",
  description: "Password reset UI for Go FlashArch.",
};

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
