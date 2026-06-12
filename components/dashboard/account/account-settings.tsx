"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  BadgeCheck,
  Camera,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Save,
  ShieldCheck,
  Upload,
  UserRound,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  accountChangePasswordSchema,
  accountProfileSchema,
  type AccountChangePasswordValues,
  type AccountProfileValues,
} from "@/lib/validations/account";
import {
  useChangePassword,
  useUpdateProfile,
  useUploadAvatar,
  useUser,
} from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(date: string | null) {
  if (!date) return "Not recorded";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function AccountSettings() {
  const { data: user } = useUser();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const uploadAvatar = useUploadAvatar();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const profileForm = useForm<AccountProfileValues>({
    resolver: zodResolver(accountProfileSchema),
    defaultValues: { full_name: "" },
  });

  const passwordForm = useForm<AccountChangePasswordValues>({
    resolver: zodResolver(accountChangePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
    },
  });

  useEffect(() => {
    if (!user) return;
    profileForm.reset({ full_name: user.full_name });
  }, [profileForm, user]);

  function handleProfileSubmit(values: AccountProfileValues) {
    updateProfile.mutate({ full_name: values.full_name });
  }

  function handlePasswordSubmit(values: AccountChangePasswordValues) {
    changePassword.mutate(values, {
      onSuccess: () => passwordForm.reset(),
    });
  }

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleAvatarUpload() {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append("file", avatarFile);
    uploadAvatar.mutate(formData, {
      onSuccess: () => {
        setAvatarFile(null);
        setAvatarPreview(null);
      },
    });
  }

  if (!user) return null;

  const avatarSrc = avatarPreview ?? user.avatar_url ?? undefined;
  const initials = getInitials(user.full_name);

  return (
    <div className="mx-auto flex w-full flex-col gap-5">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease }}
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[oklch(0.22_0.01_42)] p-5 text-[oklch(0.98_0.006_78)] sm:p-6">
            <p className="text-xs font-semibold uppercase text-[oklch(0.82_0.01_78)]">
              Admin account
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Profile and access controls
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[oklch(0.86_0.01_78)]">
              Keep your operator identity, photo, and password ready for
              protected dashboard work.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <InfoPill
                icon={ShieldCheck}
                label="Role"
                value={user.role.name}
              />
              <InfoPill icon={BadgeCheck} label="Status" value={user.status} />
            </div>
          </div>

          <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarSrc} alt={user.full_name} />
                <AvatarFallback className="bg-[#FF6600]/10 text-xl font-bold text-[#FF6600]">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold tracking-tight text-foreground">
                  {user.full_name}
                </h2>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Last sign in: {formatDate(user.last_sign_in_at)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted">
                <Camera className="h-4 w-4" />
                Choose avatar
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleAvatarChange}
                />
              </label>
              <Button
                type="button"
                disabled={!avatarFile || uploadAvatar.isPending}
                onClick={handleAvatarUpload}
                className="h-10 rounded-xl"
              >
                {uploadAvatar.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Upload
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.22, ease }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
        >
          <SectionHeading
            icon={UserRound}
            title="Identity"
            copy="This name appears in the dashboard header and account menu."
          />
          <form
            onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
            className="mt-5"
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="admin_full_name">Full name</FieldLabel>
                <Input
                  id="admin_full_name"
                  placeholder="Admin User"
                  {...profileForm.register("full_name")}
                  aria-invalid={!!profileForm.formState.errors.full_name}
                />
                <FieldError errors={[profileForm.formState.errors.full_name]} />
              </Field>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input value={user.email} disabled />
                <p className="mt-1 text-xs text-muted-foreground">
                  Email changes are locked for account safety.
                </p>
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              className="mt-5 rounded-xl"
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save identity
            </Button>
          </form>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.22, ease }}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
        >
          <SectionHeading
            icon={KeyRound}
            title="Password"
            copy="Update credentials used for protected admin sessions."
          />
          <form
            onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
            className="mt-5"
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="admin_current_password">
                  Current password
                </FieldLabel>
                <PasswordInput
                  id="admin_current_password"
                  visible={showCurrentPassword}
                  onToggle={() => setShowCurrentPassword((value) => !value)}
                  visibleLabel="Hide current password"
                  hiddenLabel="Show current password"
                  autoComplete="current-password"
                  placeholder="current password"
                  field={passwordForm.register("current_password")}
                  invalid={!!passwordForm.formState.errors.current_password}
                />
                <FieldError
                  errors={[passwordForm.formState.errors.current_password]}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="admin_new_password">
                  New password
                </FieldLabel>
                <PasswordInput
                  id="admin_new_password"
                  visible={showNewPassword}
                  onToggle={() => setShowNewPassword((value) => !value)}
                  visibleLabel="Hide new password"
                  hiddenLabel="Show new password"
                  autoComplete="new-password"
                  placeholder="password123"
                  field={passwordForm.register("new_password")}
                  invalid={!!passwordForm.formState.errors.new_password}
                />
                <FieldError
                  errors={[passwordForm.formState.errors.new_password]}
                />
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              variant="outline"
              className="mt-5 rounded-xl"
              disabled={changePassword.isPending}
            >
              {changePassword.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <KeyRound className="h-4 w-4" />
              )}
              Change password
            </Button>
          </form>
        </motion.section>
      </div>
    </div>
  );
}

function InfoPill({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
      <div className="flex items-center gap-2 text-xs text-[oklch(0.82_0.01_78)]">
        <Icon className="h-3.5 w-3.5 text-[#FFB177]" />
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold capitalize text-[oklch(0.98_0.006_78)]">
        {value}
      </p>
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  copy,
}: {
  icon: typeof UserRound;
  title: string;
  copy: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-1 max-w-lg text-sm leading-6 text-muted-foreground">
          {copy}
        </p>
      </div>
    </div>
  );
}

function PasswordInput({
  id,
  visible,
  onToggle,
  visibleLabel,
  hiddenLabel,
  field,
  invalid,
  autoComplete,
  placeholder,
}: {
  id: string;
  visible: boolean;
  onToggle: () => void;
  visibleLabel: string;
  hiddenLabel: string;
  field: ReturnType<
    ReturnType<typeof useForm<AccountChangePasswordValues>>["register"]
  >;
  invalid: boolean;
  autoComplete: string;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="pr-10"
        aria-invalid={invalid}
        {...field}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("absolute right-0 top-0", invalid && "text-destructive")}
        onClick={onToggle}
        aria-label={visible ? visibleLabel : hiddenLabel}
      >
        {visible ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}
