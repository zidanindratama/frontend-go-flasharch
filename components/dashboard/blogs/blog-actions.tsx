"use client"

import Link from "next/link"
import { useState } from "react"
import { Eye, Loader2, Pencil, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
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
import { useDeleteBlogPost } from "@/lib/hooks/use-blogs"
import type { BlogPost } from "@/lib/api/blogs"

type BlogActionsProps = {
  blog: BlogPost
}

export function BlogActions({ blog }: BlogActionsProps) {
  const deleteMutation = useDeleteBlogPost()
  const [open, setOpen] = useState(false)

  return (
    <TooltipProvider>
      <div className="flex items-center justify-end gap-1">
        <ActionTooltip label="Detail">
          <Button
            asChild
            variant="ghost"
            size="icon-sm"
            className="rounded-lg"
          >
            <Link href={`/dashboard/blogs/${blog.id}`}>
              <Eye className="size-4" />
              <span className="sr-only">Detail</span>
            </Link>
          </Button>
        </ActionTooltip>
        <ActionTooltip label="Edit">
          <Button
            asChild
            variant="ghost"
            size="icon-sm"
            className="rounded-lg"
          >
            <Link href={`/dashboard/blogs/${blog.id}/edit`}>
              <Pencil className="size-4" />
              <span className="sr-only">Edit</span>
            </Link>
          </Button>
        </ActionTooltip>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <ActionTooltip label="Delete">
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-lg text-destructive hover:text-destructive"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                <span className="sr-only">Delete</span>
              </Button>
            </AlertDialogTrigger>
          </ActionTooltip>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete blog post?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently removes &quot;{blog.title}&quot; from the
                blog.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteMutation.isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={deleteMutation.isPending}
                onClick={(event) => {
                  event.preventDefault()
                  deleteMutation.mutate(blog.id)
                }}
              >
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
