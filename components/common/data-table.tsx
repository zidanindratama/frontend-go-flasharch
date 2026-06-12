"use client"

import type { ReactNode } from "react"
import {
  flexRender,
  getCoreRowModel,
  type ColumnDef,
  type PaginationState,
  type Row,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, ChevronsUpDown, ChevronUp, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export type DataTableFilter = {
  id: string
  label: string
  value: string
  placeholder: string
  options: { label: string; value: string }[]
  onChange: (value: string) => void
}

type DataTableProps<TData> = {
  columns: ColumnDef<TData>[]
  data: TData[]
  rowCount: number
  pagination: PaginationState
  onPaginationChange: (pagination: PaginationState) => void
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  search: string
  onSearchChange: (value: string) => void
  filters?: DataTableFilter[]
  isLoading?: boolean
  isError?: boolean
  emptyTitle: string
  emptyDescription: string
  errorTitle?: string
  errorDescription?: string
  mobileRow: (row: Row<TData>) => ReactNode
}

export function DataTable<TData>({
  columns,
  data,
  rowCount,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  search,
  onSearchChange,
  filters = [],
  isLoading,
  isError,
  emptyTitle,
  emptyDescription,
  errorTitle = "Data unavailable",
  errorDescription = "The backend did not return usable data.",
  mobileRow,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    rowCount,
    state: { pagination, sorting },
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(pagination) : updater
      onPaginationChange(next)
    },
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater
      onSortingChange(next)
    },
    getCoreRowModel: getCoreRowModel(),
  })

  const pageCount = Math.max(1, Math.ceil(rowCount / pagination.pageSize))
  const currentPage = pagination.pageIndex + 1
  const firstRow = rowCount === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1
  const lastRow = Math.min(rowCount, currentPage * pagination.pageSize)

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="grid gap-3 border-b border-border/70 p-3 sm:p-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search users by name or email"
            className="h-10 rounded-xl bg-background pl-9"
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:flex lg:items-center">
          {filters.map((filter) => (
            <Select
              key={filter.id}
              value={filter.value || "all"}
              onValueChange={(value) =>
                filter.onChange(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="h-10 w-full rounded-xl bg-background lg:w-[150px]">
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{filter.placeholder}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </div>

      {isError ? (
        <DataTableState title={errorTitle} description={errorDescription} />
      ) : isLoading ? (
        <DataTableSkeleton columns={columns.length} />
      ) : data.length === 0 ? (
        <DataTableState title={emptyTitle} description={emptyDescription} />
      ) : (
        <>
          <div className="grid gap-2.5 p-3 sm:hidden">{table.getRowModel().rows.map(mobileRow)}</div>
          <div className="hidden overflow-x-auto sm:block">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="h-11 whitespace-nowrap px-4 text-xs font-semibold uppercase text-muted-foreground"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-border/60 transition-colors hover:bg-muted/35"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <div className="grid gap-3 border-t border-border/70 p-3 text-sm text-muted-foreground sm:flex sm:items-center sm:justify-between sm:p-4">
        <p className="tabular-nums">
          Showing {firstRow}-{lastRow} of {rowCount}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={String(pagination.pageSize)}
            onValueChange={(value) =>
              onPaginationChange({ pageIndex: 0, pageSize: Number(value) })
            }
          >
            <SelectTrigger className="h-9 w-[112px] rounded-xl bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={currentPage <= 1}
              onClick={() =>
                onPaginationChange({
                  ...pagination,
                  pageIndex: pagination.pageIndex - 1,
                })
              }
            >
              Previous
            </Button>
            <span className="min-w-20 text-center text-xs tabular-nums">
              {currentPage} / {pageCount}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={currentPage >= pageCount}
              onClick={() =>
                onPaginationChange({
                  ...pagination,
                  pageIndex: pagination.pageIndex + 1,
                })
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export function SortHeader({
  label,
  active,
  direction,
  onClick,
  align = "left",
}: {
  label: string
  active: boolean
  direction?: "asc" | "desc"
  onClick: () => void
  align?: "left" | "right" | "center"
}) {
  const Icon = !active ? ChevronsUpDown : direction === "asc" ? ChevronUp : ChevronDown

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg py-1 text-xs font-semibold uppercase transition-colors hover:text-foreground",
        align === "right" && "ml-auto",
        align === "center" && "mx-auto",
      )}
    >
      {label}
      <Icon className={cn("size-3.5", active && "text-[#FF6600]")} />
    </button>
  )
}

function DataTableState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex min-h-72 items-center justify-center p-6">
      <div className="max-w-sm text-center">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}

function DataTableSkeleton({ columns }: { columns: number }) {
  return (
    <div className="p-3 sm:p-4">
      <div className="grid gap-2.5 sm:hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="hidden sm:block">
        {Array.from({ length: 8 }).map((_, row) => (
          <div
            key={row}
            className="grid gap-3 border-b border-border/50 py-3 last:border-0"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((__, col) => (
              <Skeleton key={col} className="h-5 rounded-md" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
