"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Copy,
  CreditCard,
  Mail,
  Pencil,
  ShieldCheck,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RoleBadge,
  StatusBadge,
  VerificationBadge,
} from "@/components/dashboard/users/user-badges";
import {
  formatDateTime,
  shortId,
  userInitials,
} from "@/components/dashboard/users/user-utils";
import { getAdminUser } from "@/lib/api/admin-users";

export function UserDetail() {
  const params = useParams<{ id: string }>();
  const userId = params.id;
  const userQuery = useQuery({
    queryKey: ["admin-user", userId],
    queryFn: async () => {
      const response = await getAdminUser(userId);
      return response.data.data;
    },
    enabled: !!userId,
  });

  if (userQuery.isLoading) return <UserDetailSkeleton />;

  if (userQuery.isError || !userQuery.data) {
    return (
      <div className="flex min-h-[58vh] items-center justify-center">
        <div className="max-w-sm rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
          <p className="font-semibold text-foreground">User unavailable</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Check admin session and selected user ID.
          </p>
        </div>
      </div>
    );
  }

  const user = userQuery.data;

  async function copyId() {
    await navigator.clipboard.writeText(user.id);
    toast.success("User ID copied");
  }

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

      <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6600]/[0.04] via-transparent to-[#DC143C]/[0.02]" />

        <div className="relative px-6 pt-8 pb-6 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-center gap-5">
              <Avatar className="size-20 shrink-0 rounded-full">
                <AvatarImage
                  src={user.avatar_url ?? undefined}
                  alt={user.full_name}
                />
                <AvatarFallback className="rounded-full bg-gradient-to-br from-[#FF6600]/15 to-[#FF6600]/5 text-lg font-bold text-[#FF6600]">
                  {userInitials(user)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {user.full_name}
                </h1>
                <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                  <Mail className="size-3.5 shrink-0" />
                  {user.email}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <RoleBadge role={user.role.code} />
                  <StatusBadge status={user.status} />
                  <VerificationBadge verified={user.email_verified} />
                </div>
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-9 rounded-xl"
              >
                <Link href={`/dashboard/users/${user.id}/edit`}>
                  <Pencil className="size-3.5" />
                  Edit
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard
          icon={<ShieldCheck className="size-4" />}
          label="Role"
          value={user.role.name}
          detail={user.role.code}
        />
        <InfoCard
          icon={<User className="size-4" />}
          label="Account status"
          value={user.status === "active" ? "Active" : "Suspended"}
          detail={`Since ${formatDateTime(user.updated_at)}`}
          accent={user.status === "active" ? "green" : "red"}
        />
        <InfoCard
          icon={<Mail className="size-4" />}
          label="Email verification"
          value={user.email_verified ? "Verified" : "Pending verification"}
          detail={
            user.email_verified ? "Identity confirmed" : "Awaiting verification"
          }
          accent={user.email_verified ? "green" : "amber"}
        />
      </div>

      <section className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4 sm:px-8">
          <h2 className="text-sm font-semibold text-foreground">
            Activity timeline
          </h2>
        </div>
        <div className="divide-y divide-border">
          <TimelineRow
            label="Last sign-in"
            value={formatDateTime(user.last_sign_in_at)}
            dot="blue"
          />
          <TimelineRow
            label="Created"
            value={formatDateTime(user.created_at)}
            dot="green"
          />
          <TimelineRow
            label="Last updated"
            value={formatDateTime(user.updated_at)}
            dot="amber"
          />
        </div>
      </section>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  detail,
  accent = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  accent?: "neutral" | "green" | "amber" | "red";
}) {
  const dotColor =
    accent === "green"
      ? "bg-emerald-500"
      : accent === "amber"
        ? "bg-amber-500"
        : accent === "red"
          ? "bg-[#DC143C]"
          : "bg-muted-foreground";

  return (
    <div className="rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted/30">
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 items-center justify-center rounded-lg bg-muted">
          {icon}
        </span>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className={`size-2 rounded-full ${dotColor}`} />
        <p className="text-base font-semibold text-foreground">{value}</p>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function TimelineRow({
  label,
  value,
  dot,
}: {
  label: string;
  value: string;
  dot: string;
}) {
  const dotColor =
    dot === "green"
      ? "bg-emerald-500"
      : dot === "blue"
        ? "bg-blue-500"
        : "bg-amber-500";

  return (
    <div className="flex items-center gap-4 px-6 py-4 sm:px-8">
      <span className={`size-2 shrink-0 rounded-full ${dotColor}`} />
      <span className="min-w-0 flex-1 text-sm text-muted-foreground">
        {label}
      </span>
      <span className="shrink-0 text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}

function UserDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-56 rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  );
}
