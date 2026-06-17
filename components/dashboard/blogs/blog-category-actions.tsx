"use client"

import { useState } from "react"
import { Loader2, Pencil, Trash2, TriangleAlert } from "lucide-react"
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
import { useDeleteBlogCategory } from "@/lib/hooks/use-blogs"
import type { BlogCategory } from "@/lib/api/blogs"

type BlogCategoryActionsProps = {
  category: BlogCategory
}

export function BlogCategoryActions({ category }: BlogCategoryActionsProps) {
  const [open, setOpen] = useState(false)
  const deleteMutation = useDeleteBlogCategory()

  return (
    <TooltipProvider>
      <div className="flex items-center justify-end gap-1">
        <ActionTooltip label="Edit">
          <Button
            asChild
            variant="ghost"
            size="icon-sm"
            className="rounded-lg"
          >
            <a href={`/dashboard/blogs/categories/${category.id}/edit`}>
              <Pencil className="size-4" />
              <span className="sr-only">Edit</span>
            </a>
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
              <AlertDialogTitle>Delete category?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently removes &quot;{category.name}&quot; from the
                blog categories.
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
                  deleteMutation.mutate(category.id)
                }}
              >
                {deleteMutation.isPending ? (
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
