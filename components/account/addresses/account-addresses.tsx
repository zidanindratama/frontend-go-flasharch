"use client"

import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
  TriangleAlert,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  deleteAddress,
  getBuyerAddresses,
  setDefaultAddress,
  type UserAddress,
} from "@/lib/api/account"
import { useAuthStore } from "@/stores/auth"

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

function AddressCard({ address }: { address: UserAddress }) {
  const queryClient = useQueryClient()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const deleteMut = useMutation({
    mutationFn: () => deleteAddress(address.id),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Address deleted")
      setDeleteOpen(false)
      await queryClient.invalidateQueries({ queryKey: ["buyer-addresses"] })
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(error instanceof Error ? error.message : "Delete failed")
    },
  })

  const defaultMut = useMutation({
    mutationFn: () => setDefaultAddress(address.id),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Default address updated")
      await queryClient.invalidateQueries({ queryKey: ["buyer-addresses"] })
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(error instanceof Error ? error.message : "Failed")
    },
  })

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease }}
      className="rounded-xl bg-card p-4 ring-1 ring-foreground/10"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">
              {address.label || "Address"}
            </h2>
            {address.is_default ? (
              <span className="rounded-full bg-[#FF6600]/10 px-2 py-0.5 text-[11px] font-medium text-[#FF6600]">
                Default
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm font-medium text-foreground">
            {address.recipient_name}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{address.phone}</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {address.address_line}, {address.district}, {address.city},{" "}
            {address.province} {address.postal_code}
          </p>
          {address.notes ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Notes: {address.notes}
            </p>
          ) : null}
        </div>
        <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>

      <div className="mt-4 flex items-center gap-1 border-t pt-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                size="icon-sm"
                className="rounded-lg"
              >
                <Link href={`/account/addresses/${address.id}/edit`}>
                  <Pencil className="size-4" />
                  <span className="sr-only">Edit</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {!address.is_default ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-lg"
                  disabled={defaultMut.isPending}
                  onClick={() => defaultMut.mutate()}
                >
                  {defaultMut.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Star className="size-4" />
                  )}
                  <span className="sr-only">Set as default</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Set as default</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}

        <div className="ml-auto">
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AlertDialogContent className="sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive/10 text-destructive">
                  <TriangleAlert className="size-5" />
                </AlertDialogMedia>
                <AlertDialogTitle>Delete address?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes &quot;{address.label}&quot; from your addresses.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleteMut.isPending}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={deleteMut.isPending}
                  onClick={(event) => {
                    event.preventDefault()
                    deleteMut.mutate()
                  }}
                >
                  {deleteMut.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </motion.div>
  )
}

export function AccountAddresses() {
  const token = useAuthStore((s) => s.access_token)
  const { data, isLoading } = useQuery({
    queryKey: ["buyer-addresses"],
    queryFn: async () => {
      const response = await getBuyerAddresses()
      return response.data
    },
    enabled: !!token,
  })

  const addresses = data?.data.items ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04, duration: 0.45, ease }}
          className="text-lg font-bold tracking-tight lg:text-xl"
        >
          My Addresses
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08, duration: 0.35, ease }}
        >
          <Button asChild size="sm" className="gap-1.5 rounded-full">
            <Link href="/account/addresses/new">
              <Plus className="size-4" />
              Add address
            </Link>
          </Button>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : addresses.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex flex-col items-center justify-center rounded-xl bg-card px-4 py-20 text-center ring-1 ring-foreground/10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease }}
            className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF6600]/8"
          >
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <MapPin className="h-7 w-7 text-[#FF6600]/60" />
            </motion.div>
          </motion.div>
          <h2 className="text-base font-semibold tracking-tight">No saved addresses</h2>
          <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Add a shipping address to get started.
          </p>
          <Button asChild className="mt-6 gap-2 rounded-full">
            <Link href="/account/addresses/new">
              <Plus className="h-4 w-4" />
              Add address
            </Link>
          </Button>
        </motion.div>
      )}
    </div>
  )
}
