"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef, Row, SortingState } from "@tanstack/react-table"
import { ArrowUpRight, ShieldCheck, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DataTable, SortHeader, type DataTableFilter } from "@/components/common/data-table"
import { RoleBadge, StatusBadge, VerificationBadge } from "@/components/dashboard/users/user-badges"
import { UserActions } from "@/components/dashboard/users/user-actions"
import { formatDateTime, userInitials } from "@/components/dashboard/users/user-utils"
import {
  listAdminUsers,
  type AdminUser,
  type AdminUserRoleCode,
  type AdminUserStatus,
} from "@/lib/api/admin-users"
import { cn } from "@/lib/utils"

const sortableColumns = new Set([
  "created_at",
  "updated_at",
  "email",
  "full_name",
  "status",
  "last_sign_in_at",
])

export function UsersTable() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "")

  const page = positiveInt(searchParams.get("page"), 1)
  const perPage = positiveInt(searchParams.get("per_page"), 10)
  const sort = searchParams.get("sort") ?? "created_at"
  const order: "asc" | "desc" =
    searchParams.get("order") === "asc" ? "asc" : "desc"
  const role = parseRole(searchParams.get("role"))
  const status = parseStatus(searchParams.get("status"))

  const sorting: SortingState = sortableColumns.has(sort)
    ? [{ id: sort, desc: order !== "asc" }]
    : []

  const setQuery = useCallback(
    (next: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(next).forEach(([key, value]) => {
        if (value) params.set(key, value)
        else params.delete(key)
      })
      router.replace(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams],
  )

  const toggleSort = useCallback(
    (column: string) => {
      const nextOrder = sort === column && order === "desc" ? "asc" : "desc"
      setQuery({ sort: column, order: nextOrder, page: "1" })
    },
    [order, setQuery, sort],
  )

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if ((searchParams.get("search") ?? "") !== searchValue) {
        setQuery({ search: searchValue, page: "1" })
      }
    }, 320)

    return () => window.clearTimeout(handle)
  }, [searchParams, searchValue, setQuery])

  const params = useMemo(
    () => ({
      page,
      per_page: perPage,
      search: searchParams.get("search") ?? undefined,
      sort,
      order,
      role,
      status,
    }),
    [page, perPage, searchParams, sort, order, role, status],
  )

  const usersQuery = useQuery({
    queryKey: ["admin-users", params],
    queryFn: async () => {
      const response = await listAdminUsers(params)
      return response.data
    },
  })

  const payload = usersQuery.data?.data
  const users = payload?.items ?? []
  const total = payload?.total ?? 0

  const filters: DataTableFilter[] = [
    {
      id: "role",
      label: "Role",
      value: role ?? "",
      placeholder: "All roles",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Buyer", value: "buyer" },
      ],
      onChange: (value) => setQuery({ role: value, page: "1" }),
    },
    {
      id: "status",
      label: "Status",
      value: status ?? "",
      placeholder: "All status",
      options: [
        { label: "Active", value: "active" },
        { label: "Suspended", value: "suspended" },
      ],
      onChange: (value) => setQuery({ status: value, page: "1" }),
    },
  ]

  const columns = useMemo<ColumnDef<AdminUser>[]>(
    () => [
      {
        accessorKey: "full_name",
        header: () => (
          <SortHeader
            label="User"
            active={sort === "full_name"}
            direction={order}
            onClick={() => toggleSort("full_name")}
          />
        ),
        cell: ({ row }) => <UserIdentity user={row.original} />,
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => <RoleBadge role={row.original.role.code} />,
      },
      {
        accessorKey: "status",
        header: () => (
          <SortHeader
            label="Status"
            active={sort === "status"}
            direction={order}
            onClick={() => toggleSort("status")}
          />
        ),
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "email_verified",
        header: "Email",
        cell: ({ row }) => (
          <VerificationBadge verified={row.original.email_verified} />
        ),
      },
      {
        accessorKey: "last_sign_in_at",
        header: () => (
          <SortHeader
            label="Last sign-in"
            active={sort === "last_sign_in_at"}
            direction={order}
            onClick={() => toggleSort("last_sign_in_at")}
          />
        ),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {formatDateTime(row.original.last_sign_in_at)}
          </span>
        ),
      },
      {
        accessorKey: "created_at",
        header: () => (
          <SortHeader
            label="Created"
            active={sort === "created_at"}
            direction={order}
            onClick={() => toggleSort("created_at")}
          />
        ),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {formatDateTime(row.original.created_at)}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <UserActions user={row.original} />,
      },
    ],
    [sort, order, toggleSort],
  )

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <section className="grid gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6600]/10 px-3 py-1 text-xs font-semibold text-[#FF6600]">
            <ShieldCheck className="size-3.5" />
            Admin access
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Users
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Audit buyer and admin accounts, keep roles clear, and suspend access
            before risky checkout operations.
          </p>
        </div>
        <Button asChild size="lg" className="h-10 rounded-xl">
          <Link href="/dashboard/users/new">
            <UserPlus className="size-4" />
            Create user
          </Link>
        </Button>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <SignalTile label="Total users" value={total.toLocaleString("id-ID")} />
        <SignalTile
          label="Visible page"
          value={users.length.toLocaleString("id-ID")}
        />
        <SignalTile
          label="Filtered role"
          value={role ? role : "all"}
          className="capitalize"
        />
      </div>

      <DataTable
        columns={columns}
        data={users}
        rowCount={total}
        pagination={{ pageIndex: page - 1, pageSize: perPage }}
        onPaginationChange={(next) =>
          setQuery({
            page: String(next.pageIndex + 1),
            per_page: String(next.pageSize),
          })
        }
        sorting={sorting}
        onSortingChange={(next) => {
          const item = next[0]
          if (!item) return
          setQuery({
            sort: item.id,
            order: item.desc ? "desc" : "asc",
            page: "1",
          })
        }}
        search={searchValue}
        onSearchChange={setSearchValue}
        filters={filters}
        isLoading={usersQuery.isLoading}
        isError={usersQuery.isError}
        emptyTitle="No users found"
        emptyDescription="Adjust search or filters, then try again."
        errorTitle="Users unavailable"
        errorDescription="Check admin session and backend health."
        mobileRow={mobileRow}
      />
    </div>
  )
}

function UserIdentity({ user }: { user: AdminUser }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className="size-10 rounded-xl">
        <AvatarImage src={user.avatar_url ?? undefined} alt={user.full_name} />
        <AvatarFallback className="rounded-xl bg-[#FF6600]/12 text-xs font-bold text-[#FF6600]">
          {userInitials(user)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">
          {user.full_name}
        </p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
    </div>
  )
}

function mobileRow(row: Row<AdminUser>) {
  const user = row.original

  return (
    <div
      key={user.id}
      className="min-w-0 rounded-xl border border-border bg-background p-3 shadow-sm"
    >
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <div className="min-w-0">
          <UserIdentity user={user} />
        </div>
        <div className="shrink-0">
          <UserActions user={user} />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <RoleBadge role={user.role.code} />
        <StatusBadge status={user.status} />
        <VerificationBadge verified={user.email_verified} />
      </div>
      <Link
        href={`/dashboard/users/${user.id}`}
        className="mt-3 inline-flex max-w-full items-center gap-1.5 truncate text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="truncate">
          Last sign-in {formatDateTime(user.last_sign_in_at)}
        </span>
        <ArrowUpRight className="size-3 shrink-0" />
      </Link>
    </div>
  )
}

function SignalTile({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </p>
      <p className={cn("mt-2 truncate text-2xl font-semibold tracking-tight text-foreground", className)}>
        {value}
      </p>
    </div>
  )
}

function positiveInt(value: string | null, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function parseRole(value: string | null): AdminUserRoleCode | undefined {
  return value === "admin" || value === "buyer" ? value : undefined
}

function parseStatus(value: string | null): AdminUserStatus | undefined {
  return value === "active" || value === "suspended" ? value : undefined
}
