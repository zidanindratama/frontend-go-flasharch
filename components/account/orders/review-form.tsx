"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Loader2, Pencil, Star, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  useCreateProductReview,
  useUpdateProductReview,
  useDeleteProductReview,
} from "@/lib/hooks/use-products"
import type { ProductReview } from "@/lib/api/catalog"
import { reviewSchema, type ReviewValues } from "@/lib/validations/catalog"
import { cn } from "@/lib/utils"

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

function InteractiveStarRating({
  value,
  onChange,
  disabled,
}: {
  value: number
  onChange: (v: number) => void
  disabled?: boolean
}) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1
        const isActive = starValue <= (hovered || value)
        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            className={cn(
              "transition-colors disabled:cursor-not-allowed",
              isActive ? "text-[#FF6600]" : "text-muted-foreground/45",
            )}
            onMouseEnter={() => !disabled && setHovered(starValue)}
            onMouseLeave={() => !disabled && setHovered(0)}
            onClick={() => !disabled && onChange(starValue)}
            aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
          >
            <Star
              className={cn("size-6", isActive && "fill-[#FF6600]")}
            />
          </button>
        )
      })}
    </div>
  )
}

export function ReviewForm({
  productSlug,
  productName,
  thumbnailUrl,
  existingReview,
}: {
  productSlug: string
  productName: string
  thumbnailUrl: string | null
  existingReview?: ProductReview
}) {
  const isEditing = !!existingReview
  const [mode, setMode] = useState<"view" | "form">(isEditing ? "view" : "form")

  const createReview = useCreateProductReview(productSlug)
  const updateReview = useUpdateProductReview(productSlug)
  const deleteReview = useDeleteProductReview(productSlug)
  const isBusy = createReview.isPending || updateReview.isPending || deleteReview.isPending

  const form = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: existingReview?.rating ?? 0,
      title: existingReview?.title ?? "",
      body: existingReview?.body ?? "",
    },
  })

  useEffect(() => {
    if (existingReview) {
      form.reset({
        rating: existingReview.rating,
        title: existingReview.title,
        body: existingReview.body,
      })
    }
  }, [existingReview, form])

  function onSubmit(data: ReviewValues) {
    if (isEditing) {
      updateReview.mutate(data, {
        onSuccess: () => setMode("view"),
      })
    } else {
      createReview.mutate(data, {
        onSuccess: () => setMode("view"),
      })
    }
  }

  function handleDelete() {
    deleteReview.mutate(undefined, {
      onSuccess: () => setMode("form"),
    })
  }

  if (mode === "view" && existingReview) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: smoothEase }}
        className="rounded-xl border border-border bg-muted/40 p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-3.5",
                      i < existingReview.rating
                        ? "fill-[#FF6600] text-[#FF6600]"
                        : "text-muted-foreground/45",
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(existingReview.updated_at).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            {existingReview.title && (
              <p className="text-sm font-semibold text-foreground mb-1">
                {existingReview.title}
              </p>
            )}
            {existingReview.body && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {existingReview.body}
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setMode("form")}
            >
              <Pencil className="size-3.5" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete review</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete your review for this product?
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" disabled={isBusy}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    disabled={isBusy}
                    onClick={handleDelete}
                  >
                    {deleteReview.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: smoothEase }}
      className="rounded-xl border border-border bg-card p-4"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FieldGroup>
          <Field>
            <FieldLabel>Rating</FieldLabel>
            <InteractiveStarRating
              value={form.watch("rating")}
              onChange={(v) => form.setValue("rating", v, { shouldValidate: true })}
              disabled={isBusy}
            />
            {form.formState.errors.rating && (
              <FieldError>{form.formState.errors.rating.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor={`review-title-${productSlug}`}>Title</FieldLabel>
            <Input
              id={`review-title-${productSlug}`}
              placeholder="Summarize your experience"
              disabled={isBusy}
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <FieldError>{form.formState.errors.title.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor={`review-body-${productSlug}`}>Review</FieldLabel>
            <Textarea
              id={`review-body-${productSlug}`}
              placeholder="Tell others what you think about this product"
              disabled={isBusy}
              {...form.register("body")}
            />
          </Field>
        </FieldGroup>

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={isBusy} className="h-9">
            {isBusy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isEditing ? (
              "Update review"
            ) : (
              "Submit review"
            )}
          </Button>
          {isEditing && (
            <Button
              type="button"
              variant="ghost"
              disabled={isBusy}
              onClick={() => {
                form.reset({
                  rating: existingReview.rating,
                  title: existingReview.title,
                  body: existingReview.body,
                })
                setMode("view")
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </motion.div>
  )
}
