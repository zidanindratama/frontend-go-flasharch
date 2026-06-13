"use client"

import Link from "next/link"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Eye, Loader2, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
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
import { deleteProduct, type Product } from "@/lib/api/catalog"

type ProductActionsProps = {
  product: Product
}

export function ProductActions({ product }: ProductActionsProps) {
  const queryClient = useQueryClient()
  const deleteProductMutation = useMutation({
    mutationFn: () => deleteProduct(product.id),
    onSuccess: async () => {
      toast.success("Product deleted")
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-product", product.id] }),
      ])
    },
    onError: (error) => toast.error(error.message),
  })

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
            <Link href={`/dashboard/products/${product.id}`}>
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
            <Link href={`/dashboard/products/${product.id}/edit`}>
              <Pencil className="size-4" />
              <span className="sr-only">Edit</span>
            </Link>
          </Button>
        </ActionTooltip>
        <AlertDialog>
          <ActionTooltip label="Delete">
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-lg text-destructive hover:text-destructive"
                disabled={deleteProductMutation.isPending}
              >
                {deleteProductMutation.isPending ? (
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
              <AlertDialogTitle>Delete product?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently removes &quot;{product.name}&quot; from the catalog.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteProductMutation.isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={deleteProductMutation.isPending}
                onClick={(event) => {
                  event.preventDefault()
                  deleteProductMutation.mutate()
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
