"use client"

import { useState } from "react"
import Link from "next/link"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Eye, Loader2, Pencil, Trash2, TriangleAlert } from "lucide-react"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { deleteAdminUser, type AdminUser } from "@/lib/api/admin-users"

type UserActionsProps = {
  user: AdminUser
}

export function UserActions({ user }: UserActionsProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const deleteUser = useMutation({
    mutationFn: () => deleteAdminUser(user.id),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("User deleted")
      setOpen(false)
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] })
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(error.message)
    },
  })

  return (
    <TooltipProvider>
      <div className="flex items-center justify-end gap-1">
        <ActionTooltip label="Detail">
          <Button asChild variant="ghost" size="icon-sm" className="rounded-lg">
            <Link href={`/dashboard/users/${user.id}`}>
              <Eye className="size-4" />
              <span className="sr-only">Detail</span>
            </Link>
          </Button>
        </ActionTooltip>
        <ActionTooltip label="Edit">
          <Button asChild variant="ghost" size="icon-sm" className="rounded-lg">
            <Link href={`/dashboard/users/${user.id}/edit`}>
              <Pencil className="size-4" />
              <span className="sr-only">Edit</span>
            </Link>
          </Button>
        </ActionTooltip>
        <AlertDialog open={open} onOpenChange={setOpen}>
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
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 text-destructive">
                <TriangleAlert className="size-5" />
              </AlertDialogMedia>
              <AlertDialogTitle>Delete user?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes {user.email} from user management. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteUser.isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={deleteUser.isPending}
                onClick={(event) => {
                  event.preventDefault()
                  deleteUser.mutate()
                }}
              >
                {deleteUser.isPending ? (
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
    </TooltipProvider>
  )
}

function ActionTooltip({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
