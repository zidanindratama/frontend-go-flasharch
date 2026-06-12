"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Save,
  Shield,
  UserPlus,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RoleBadge, StatusBadge } from "@/components/dashboard/users/user-badges"
import { formatDateTime, userInitials } from "@/components/dashboard/users/user-utils"
import {
  changeAdminUserPassword,
  createAdminUser,
  updateAdminUserName,
  updateAdminUserRole,
  updateAdminUserStatus,
  type AdminUser,
  type CreateAdminUserInput,
  type UpdateAdminUserInput,
} from "@/lib/api/admin-users"
import {
  adminUserCreateSchema,
  adminUserEditSchema,
  type AdminUserCreateValues,
  type AdminUserEditValues,
} from "@/lib/validations/admin-users"

type UserFormProps =
  | {
      mode: "create"
      user?: never
    }
  | {
      mode: "edit"
      user: AdminUser
    }

export function UserForm(props: UserFormProps) {
  return props.mode === "create" ? (
    <CreateUserForm />
  ) : (
    <EditUserForm user={props.user} />
  )
}

function CreateUserForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<AdminUserCreateValues>({
    resolver: zodResolver(adminUserCreateSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role_code: "buyer",
    },
  })
  const values = form.watch()
  const preview = useMemo(
    () => ({
      full_name: values.full_name || "User Example",
      email: values.email || "user@example.com",
      role: values.role_code || "buyer",
      status: "active",
    }),
    [values.full_name, values.email, values.role_code],
  )

  const createUser = useMutation({
    mutationFn: (input: CreateAdminUserInput) => createAdminUser(input),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("User created")
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] })
      router.push("/dashboard/users")
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(error.message)
    },
  })

  function onSubmit(input: AdminUserCreateValues) {
    const { confirmPassword: _, ...payload } = input
    createUser.mutate(payload)
  }

  return (
    <FormShell
      title="Create user"
      description="Create a verified admin-side account with a clear role before checkout operations begin."
      preview={
        <IdentityPreview
          name={preview.full_name}
          email={preview.email}
          role={preview.role}
          status={preview.status}
        />
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="full_name">Full name</FieldLabel>
            <Input
              id="full_name"
              autoComplete="name"
              placeholder="User Example"
              aria-invalid={!!form.formState.errors.full_name}
              {...form.register("full_name")}
            />
            <FieldError errors={[form.formState.errors.full_name]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="user@example.com"
              aria-invalid={!!form.formState.errors.email}
              {...form.register("email")}
            />
            <FieldError errors={[form.formState.errors.email]} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="password123"
                  className="pr-10"
                  aria-invalid={!!form.formState.errors.password}
                  {...form.register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
              <FieldDescription>
                Minimum 8 characters, with letters and numbers.
              </FieldDescription>
              <FieldError errors={[form.formState.errors.password]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter password"
                aria-invalid={!!form.formState.errors.confirmPassword}
                {...form.register("confirmPassword")}
              />
              <FieldError errors={[form.formState.errors.confirmPassword]} />
            </Field>
          </div>
          <RoleSelect
            value={values.role_code}
            onChange={(value) =>
              form.setValue("role_code", value, { shouldValidate: true })
            }
            error={form.formState.errors.role_code}
          />
        </FieldGroup>
        <Button
          type="submit"
          size="lg"
          className="h-10 rounded-xl sm:w-fit"
          disabled={createUser.isPending}
        >
          {createUser.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <UserPlus className="size-4" />
          )}
          Create user
        </Button>
      </form>
    </FormShell>
  )
}

function EditUserForm({ user }: { user: AdminUser }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<AdminUserEditValues>({
    resolver: zodResolver(adminUserEditSchema),
    defaultValues: {
      full_name: user.full_name,
      role_code: user.role.code,
      status: user.status === "suspended" ? "suspended" : "active",
      password: "",
      confirmPassword: "",
    },
  })
  const values = form.watch()

  const editUser = useMutation({
    mutationFn: async (input: AdminUserEditValues) => {
      const requests: Promise<unknown>[] = []
      if (input.full_name !== user.full_name) {
        requests.push(updateAdminUserName(user.id, input.full_name))
      }
      if (input.role_code !== user.role.code) {
        requests.push(updateAdminUserRole(user.id, input.role_code))
      }
      if (input.status !== user.status) {
        requests.push(updateAdminUserStatus(user.id, input.status))
      }
      if (input.password) {
        requests.push(changeAdminUserPassword(user.id, input.password))
      }
      await Promise.all(requests)
      return true
    },
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("User updated")
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-user", user.id] }),
      ])
      router.push(`/dashboard/users/${user.id}`)
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(error.message)
    },
  })

  function onSubmit(input: AdminUserEditValues) {
    editUser.mutate(input)
  }

  return (
    <FormShell
      title="Edit user"
      description="Adjust identity and access state without losing operational history."
      preview={
        <IdentityPreview
          name={values.full_name || user.full_name}
          email={user.email}
          avatarUrl={user.avatar_url}
          role={values.role_code}
          status={values.status}
          createdAt={user.created_at}
        />
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Identity
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Name, role, and account status.
          </p>
          <div className="mt-5 grid gap-4">
            <Field>
              <FieldLabel htmlFor="full_name">Full name</FieldLabel>
              <Input
                id="full_name"
                autoComplete="name"
                placeholder="User Example"
                aria-invalid={!!form.formState.errors.full_name}
                {...form.register("full_name")}
              />
              <FieldError errors={[form.formState.errors.full_name]} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <RoleSelect
                value={values.role_code}
                onChange={(value) =>
                  form.setValue("role_code", value, { shouldValidate: true })
                }
                error={form.formState.errors.role_code}
              />
              <StatusSelect
                value={values.status}
                onChange={(value) =>
                  form.setValue("status", value, { shouldValidate: true })
                }
                error={form.formState.errors.status}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Change password
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Leave blank to keep the current password.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="password">New password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Leave blank to keep current"
                  className="pr-10"
                  aria-invalid={!!form.formState.errors.password}
                  {...form.register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
              <FieldDescription>
                Min 8 characters with letters and numbers.
              </FieldDescription>
              <FieldError errors={[form.formState.errors.password]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter new password"
                aria-invalid={!!form.formState.errors.confirmPassword}
                {...form.register("confirmPassword")}
              />
              <FieldError errors={[form.formState.errors.confirmPassword]} />
            </Field>
          </div>
        </section>

        <Button
          type="submit"
          size="lg"
          className="h-10 rounded-xl sm:w-fit"
          disabled={editUser.isPending}
        >
          {editUser.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          Save changes
        </Button>
      </form>
    </FormShell>
  )
}

function FormShell({
  title,
  description,
  preview,
  children,
}: {
  title: string
  description: string
  preview: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="w-fit gap-2 text-muted-foreground"
      >
        <Link href="/dashboard/users">
          <ArrowLeft className="size-4" />
          All users
        </Link>
      </Button>

      <section className="relative overflow-hidden rounded-2xl border border-border bg-[#111111] p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -top-24 -right-24 size-48 rounded-full bg-[#FF6600]/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 size-40 rounded-full bg-[#DC143C]/8 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6600]/15 px-3 py-1 text-xs font-semibold text-[#FF6600]">
              <Shield className="size-3.5" />
              Role controlled
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2.5 max-w-md text-sm leading-6 text-white/50">
              {description}
            </p>
          </div>
          <div>{preview}</div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        {children}
      </section>
    </div>
  )
}

function IdentityPreview({
  name,
  email,
  avatarUrl,
  role,
  status,
  createdAt,
}: {
  name: string
  email: string
  avatarUrl?: string | null
  role: string
  status: string
  createdAt?: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center gap-4">
        <Avatar className="size-16 shrink-0 rounded-full">
          <AvatarImage src={avatarUrl ?? undefined} alt={name} />
          <AvatarFallback className="rounded-full bg-gradient-to-br from-[#FF6600]/20 to-[#FF6600]/5 text-base font-bold text-[#FF6600]">
            {userInitials({ full_name: name, email })}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold">{name}</p>
          <p className="mt-0.5 truncate text-sm text-white/45">{email}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <RoleBadge role={role} />
        <StatusBadge status={status} />
      </div>
      <div className="mt-5 rounded-xl border border-white/8 bg-white/[0.03] p-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-white/30">
          Created
        </p>
        <p className="mt-1.5 text-sm font-medium text-white/65">
          {createdAt ? formatDateTime(createdAt) : "After successful create"}
        </p>
      </div>
    </div>
  )
}

function RoleSelect({
  value,
  onChange,
  error,
}: {
  value: "admin" | "buyer"
  onChange: (value: "admin" | "buyer") => void
  error?: { message?: string }
}) {
  return (
    <Field>
      <FieldLabel>Role</FieldLabel>
      <Select value={value} onValueChange={(next) => onChange(next as "admin" | "buyer")}>
        <SelectTrigger className="h-10 w-full rounded-xl">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="buyer">Buyer</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
      <FieldDescription>Admin can access dashboard operations.</FieldDescription>
      <FieldError errors={[error]} />
    </Field>
  )
}

function StatusSelect({
  value,
  onChange,
  error,
}: {
  value: "active" | "suspended"
  onChange: (value: "active" | "suspended") => void
  error?: { message?: string }
}) {
  return (
    <Field>
      <FieldLabel>Status</FieldLabel>
      <Select
        value={value}
        onValueChange={(next) => onChange(next as "active" | "suspended")}
      >
        <SelectTrigger className="h-10 w-full rounded-xl">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
        </SelectContent>
      </Select>
      <FieldDescription>Suspended users cannot continue normal access.</FieldDescription>
      <FieldError errors={[error]} />
    </Field>
  )
}
