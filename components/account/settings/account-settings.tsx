"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import {
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  Upload,
  UserRound,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  useChangePassword,
  useUpdateProfile,
  useUploadAvatar,
  useUser,
} from "@/hooks/use-auth"
import {
  accountChangePasswordSchema,
  accountProfileSchema,
  type AccountChangePasswordValues,
  type AccountProfileValues,
} from "@/lib/validations/account"

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(value?: string | null) {
  if (!value) return "Not available"
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

export function AccountSettings() {
  const { data: user } = useUser()
  const updateProfile = useUpdateProfile()
  const changePassword = useChangePassword()
  const uploadAvatar = useUploadAvatar()
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const profileForm = useForm<AccountProfileValues>({
    resolver: zodResolver(accountProfileSchema),
    defaultValues: {
      full_name: "",
    },
  })

  const passwordForm = useForm<AccountChangePasswordValues>({
    resolver: zodResolver(accountChangePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
    },
  })

  useEffect(() => {
    if (!user) return
    profileForm.reset({ full_name: user.full_name })
  }, [profileForm, user])

  function handleProfileSubmit(values: AccountProfileValues) {
    updateProfile.mutate({ full_name: values.full_name })
  }

  function handlePasswordSubmit(values: AccountChangePasswordValues) {
    changePassword.mutate(values, {
      onSuccess: () => {
        passwordForm.reset()
      },
    })
  }

  function handleAvatarUpload() {
    if (!avatarFile) return
    const formData = new FormData()
    formData.append("file", avatarFile)
    uploadAvatar.mutate(formData, {
      onSuccess: () => {
        setAvatarFile(null)
        setAvatarPreview(null)
      },
    })
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  if (!user) return null

  const avatarSrc = avatarPreview ?? user.avatar_url ?? undefined
  const initials = getInitials(user.full_name || user.email)
  const roleName = user.role?.name ?? user.role?.code ?? "Buyer"
  const isBusy =
    updateProfile.isPending || changePassword.isPending || uploadAvatar.isPending

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease }}
        className="overflow-hidden rounded-2xl border bg-card shadow-sm"
      >
        <div className="border-b bg-muted/35 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="size-20 border-4 border-background shadow-sm">
                  <AvatarImage src={avatarSrc} alt={user.full_name} />
                  <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full border-2 border-background bg-foreground text-background shadow-sm">
                  <Camera className="size-3.5" />
                </div>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Account settings
                </p>
                <h1 className="truncate text-2xl font-bold tracking-tight">
                  {user.full_name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1">
                    <Mail className="size-3.5" />
                    <span className="max-w-[220px] truncate sm:max-w-none">
                      {user.email}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1">
                    <ShieldCheck className="size-3.5" />
                    {roleName}
                  </span>
                  {user.email_verified && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">
                      <CheckCircle2 className="size-3.5" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:bg-muted">
                <Upload className="size-4" />
                Choose avatar
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleAvatarChange}
                />
              </label>
              <Button
                onClick={handleAvatarUpload}
                disabled={!avatarFile || uploadAvatar.isPending}
                className="sm:min-w-28"
              >
                {uploadAvatar.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save />
                )}
                Upload
              </Button>
            </div>
          </div>
          {avatarFile && (
            <p className="mt-3 truncate text-xs text-muted-foreground">
              Ready to upload: {avatarFile.name}
            </p>
          )}
        </div>

        <div className="grid gap-0 divide-y lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          <AccountStat label="Member since" value={formatDate(user.created_at)} />
          <AccountStat label="Last sign in" value={formatDate(user.last_sign_in_at)} />
          <AccountStat label="Status" value={user.status ?? "active"} />
        </div>
      </motion.section>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.45, ease }}
          whileHover={{ y: -2 }}
          className="rounded-2xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6"
        >
          <SectionHeading
            icon={<UserRound className="size-4" />}
            title="Profile identity"
            description="Keep your buyer profile recognizable across orders and checkout."
          />

          <form
            onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
            className="mt-6 space-y-5"
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="full_name">Full name</FieldLabel>
                <Input
                  id="full_name"
                  placeholder="Zidan Indratama"
                  {...profileForm.register("full_name")}
                  aria-invalid={!!profileForm.formState.errors.full_name}
                />
                <FieldError errors={[profileForm.formState.errors.full_name]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email address</FieldLabel>
                <Input id="email" value={user.email} disabled />
                <p className="text-xs text-muted-foreground">
                  Email is locked to protect checkout and order history.
                </p>
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              disabled={updateProfile.isPending || isBusy}
              className="w-full sm:w-auto"
            >
              {updateProfile.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Save />
              )}
              Save profile
            </Button>
          </form>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45, ease }}
          whileHover={{ y: -2 }}
          className="rounded-2xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6"
        >
          <SectionHeading
            icon={<KeyRound className="size-4" />}
            title="Password access"
            description="Change your password without touching your active account details."
          />

          <form
            onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
            className="mt-6 space-y-5"
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="current_password">
                  Current password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="current_password"
                    type={showCurrentPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter current password"
                    className="pr-10"
                    {...passwordForm.register("current_password")}
                    aria-invalid={
                      !!passwordForm.formState.errors.current_password
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowCurrentPassword((value) => !value)}
                    aria-label={
                      showCurrentPassword
                        ? "Hide current password"
                        : "Show current password"
                    }
                  >
                    {showCurrentPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
                <FieldError
                  errors={[passwordForm.formState.errors.current_password]}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="new_password">New password</FieldLabel>
                <div className="relative">
                  <Input
                    id="new_password"
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create stronger password"
                    className="pr-10"
                    {...passwordForm.register("new_password")}
                    aria-invalid={!!passwordForm.formState.errors.new_password}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowNewPassword((value) => !value)}
                    aria-label={
                      showNewPassword
                        ? "Hide new password"
                        : "Show new password"
                    }
                  >
                    {showNewPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
                <FieldError
                  errors={[passwordForm.formState.errors.new_password]}
                />
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              variant="secondary"
              disabled={changePassword.isPending || isBusy}
              className="w-full sm:w-auto"
            >
              {changePassword.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <KeyRound />
              )}
              Update password
            </Button>
          </form>
        </motion.section>
      </div>
    </div>
  )
}

function AccountStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-4 sm:px-6">
      <p className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold capitalize">{value}</p>
    </div>
  )
}

function SectionHeading({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-foreground">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 max-w-prose text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}
