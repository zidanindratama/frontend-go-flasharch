"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Save, Upload, KeyRound } from "lucide-react"
import { useUser, useUpdateProfile, useChangePassword, useUploadAvatar } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const profileSchema = z.object({
  full_name: z.string().min(3, "Name must be at least 3 characters"),
})
type ProfileValues = z.infer<typeof profileSchema>

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Za-z]/, "Password must include a letter")
      .regex(/[0-9]/, "Password must include a number"),
  })
type PasswordValues = z.infer<typeof passwordSchema>

export default function SettingsPage() {
  const { data: user } = useUser()
  const updateProfile = useUpdateProfile()
  const changePassword = useChangePassword()
  const uploadAvatar = useUploadAvatar()
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name ?? "",
    },
  })

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
    },
  })

  function handleProfileSubmit(values: ProfileValues) {
    updateProfile.mutate({ full_name: values.full_name })
  }

  function handlePasswordSubmit(values: PasswordValues) {
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

  return (
    <div className="space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04, duration: 0.55, ease }}
        className="text-lg font-bold tracking-tight lg:text-xl"
      >
        Settings
      </motion.h1>

      {/* Avatar Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.55, ease }}
        className="rounded-xl bg-card p-5 ring-1 ring-foreground/10"
      >
        <h2 className="text-sm font-semibold mb-4">Profile Photo</h2>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-[#FF6600]/10 flex items-center justify-center text-lg font-bold text-[#FF6600] overflow-hidden">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="h-full w-full object-cover"
              />
            ) : (
              user.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
            )}
          </div>
          <div className="flex-1">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors w-fit">
              <Upload className="h-4 w-4" />
              Choose photo
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleAvatarChange}
              />
            </label>
            {avatarFile && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {avatarFile.name}
                </span>
                <Button
                  size="sm"
                  onClick={handleAvatarUpload}
                  disabled={uploadAvatar.isPending}
                >
                  {uploadAvatar.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  Upload
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.55, ease }}
        className="rounded-xl bg-card p-5 ring-1 ring-foreground/10"
      >
        <h2 className="text-sm font-semibold mb-4">Profile Information</h2>
        <form
          onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
          className="space-y-4"
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="full_name">Full Name</FieldLabel>
              <Input
                id="full_name"
                {...profileForm.register("full_name")}
                aria-invalid={!!profileForm.formState.errors.full_name}
              />
              <FieldError errors={[profileForm.formState.errors.full_name]} />
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input value={user.email} disabled />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed
              </p>
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            size="sm"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Save Changes
          </Button>
        </form>
      </motion.div>

      {/* Password Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.55, ease }}
        className="rounded-xl bg-card p-5 ring-1 ring-foreground/10"
      >
        <h2 className="text-sm font-semibold mb-4">Change Password</h2>
        <form
          onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
          className="space-y-4"
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="current_password">
                Current Password
              </FieldLabel>
              <Input
                id="current_password"
                type="password"
                {...passwordForm.register("current_password")}
                aria-invalid={
                  !!passwordForm.formState.errors.current_password
                }
              />
              <FieldError
                errors={[passwordForm.formState.errors.current_password]}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="new_password">New Password</FieldLabel>
              <Input
                id="new_password"
                type="password"
                {...passwordForm.register("new_password")}
                aria-invalid={!!passwordForm.formState.errors.new_password}
              />
              <FieldError
                errors={[passwordForm.formState.errors.new_password]}
              />
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            size="sm"
            variant="outline"
            disabled={changePassword.isPending}
          >
            {changePassword.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <KeyRound className="h-3.5 w-3.5" />
            )}
            Change Password
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
