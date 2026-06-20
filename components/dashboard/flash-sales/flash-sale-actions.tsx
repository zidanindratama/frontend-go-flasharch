"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  AlertTriangle,
  ChevronRight,
  Loader2,
  Play,
  RefreshCw,
  RotateCcw,
  Square,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  updateFlashSaleStatus,
  preloadFlashSale,
  releaseExpiredReservations,
  type FlashSaleStatus,
} from "@/lib/api/flash-sale"
import {
  canSchedule,
  canRun,
  canRevertDraft,
  canEnd,
  canCancel,
  canPreload,
  canRelease,
} from "./flash-sale-utils"
import { getErrorMessage } from "@/lib/api/errors"

interface FlashSaleActionsProps {
  saleId: string
  status: FlashSaleStatus
  redisPreloadedAt: string | null
  activeItems?: number
  readinessReady?: boolean
  readinessLoading?: boolean
}

export function FlashSaleActions({
  saleId,
  status,
  redisPreloadedAt,
  activeItems = 0,
  readinessReady,
  readinessLoading,
}: FlashSaleActionsProps) {
  const queryClient = useQueryClient()
  const [confirmAction, setConfirmAction] = useState<string | null>(null)

  const statusMutation = useMutation({
    mutationFn: (newStatus: FlashSaleStatus) => updateFlashSaleStatus(saleId, { status: newStatus }),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Status updated")
      await queryClient.invalidateQueries({ queryKey: ["admin.flashSales", saleId] })
      await queryClient.invalidateQueries({ queryKey: ["admin.flashSales"] })
      await queryClient.invalidateQueries({ queryKey: ["admin.flashSales", saleId, "readiness"] })
      await queryClient.invalidateQueries({ queryKey: ["admin.flashSales", saleId, "report"] })
      setConfirmAction(null)
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to update status"))
      setConfirmAction(null)
    },
  })

  const preloadMutation = useMutation({
    mutationFn: () => preloadFlashSale(saleId),
    onSuccess: async () => {
      const { toast } = await import("sonner")
      toast.success("Redis stock preloaded")
      await queryClient.invalidateQueries({ queryKey: ["admin.flashSales", saleId] })
      await queryClient.invalidateQueries({ queryKey: ["admin.flashSales", saleId, "readiness"] })
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to preload Redis"))
    },
  })

  const releaseMutation = useMutation({
    mutationFn: () => releaseExpiredReservations(saleId),
    onSuccess: async (data) => {
      const { toast } = await import("sonner")
      const released = data.data.data.released
      toast.success(released > 0 ? `${released} reservations released` : "No expired reservations")
      await queryClient.invalidateQueries({ queryKey: ["admin.flashSales", saleId] })
      await queryClient.invalidateQueries({ queryKey: ["admin.flashSales", saleId, "report"] })
    },
    onError: async (error) => {
      const { toast } = await import("sonner")
      toast.error(getErrorMessage(error, "Failed to release reservations"))
    },
  })

  const handleAction = (action: string) => {
    setConfirmAction(action)
  }

  const confirmHandler = () => {
    if (!confirmAction) return
    switch (confirmAction) {
      case "schedule":
        statusMutation.mutate("scheduled")
        break
      case "draft":
        statusMutation.mutate("draft")
        break
      case "run":
        statusMutation.mutate("running")
        break
      case "end":
        statusMutation.mutate("ended")
        break
      case "cancel":
        statusMutation.mutate("cancelled")
        break
    }
  }

  const isLoading = statusMutation.isPending || preloadMutation.isPending || releaseMutation.isPending
  const canStart = canRun(status) && !!redisPreloadedAt && readinessReady === true
  const canScheduleWithItems = canSchedule(status) && activeItems > 0

  if (!canScheduleWithItems && !canRevertDraft(status) && !canRun(status) && !canEnd(status) && !canCancel(status) && !canPreload(status) && !canRelease(status)) {
    return null
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {canPreload(status) && (!redisPreloadedAt || readinessReady === false) && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl"
            onClick={() => preloadMutation.mutate()}
            disabled={isLoading}
          >
            {preloadMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            Preload Redis
          </Button>
        )}

        {canRevertDraft(status) && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl"
            onClick={() => handleAction("draft")}
            disabled={isLoading}
          >
            <RotateCcw className="size-4" />
            Revert draft
          </Button>
        )}

        {canRelease(status) && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl"
            onClick={() => releaseMutation.mutate()}
            disabled={isLoading}
          >
            {releaseMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            Release Expired
          </Button>
        )}

        {canScheduleWithItems && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl border-blue-500/30 text-blue-600 hover:bg-blue-500/5 dark:text-blue-400"
            onClick={() => handleAction("schedule")}
            disabled={isLoading}
          >
            <ChevronRight className="size-4" />
            Schedule for automatic launch
          </Button>
        )}

        {canRun(status) && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl border-[#39FF14]/30 text-[#1a8a0a] hover:bg-[#39FF14]/5 dark:text-[#39FF14]"
            onClick={() => handleAction("run")}
            disabled={isLoading || readinessLoading || !canStart}
          >
            <Play className="size-4" />
            Start Sale
          </Button>
        )}

        {canEnd(status) && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl"
            onClick={() => handleAction("end")}
            disabled={isLoading}
          >
            <Square className="size-4" />
            End
          </Button>
        )}

        {canCancel(status) && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl border-[#DC143C]/30 text-[#DC143C] hover:bg-[#DC143C]/5"
            onClick={() => handleAction("cancel")}
            disabled={isLoading}
          >
            <X className="size-4" />
            Cancel
          </Button>
        )}
      </div>

      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-[#DC143C]" />
              Confirm {confirmAction}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === "cancel"
                ? "This will cancel the flash sale. This action cannot be undone."
                : confirmAction === "end"
                ? "This will end the flash sale immediately. Active reservations will still expire naturally."
                : confirmAction === "run"
                ? "This will start the flash sale. Make sure Redis is preloaded first."
                : confirmAction === "draft"
                ? "This will move the scheduled sale back to draft so timing and items can be revised."
                : confirmAction === "schedule"
                ? "This hands the sale to the scheduler. Redis will be preloaded automatically, the sale will start at or after the scheduled start time, and it will end after the scheduled end time."
                : `Change status to ${confirmAction}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Abort</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmHandler}
              disabled={isLoading}
              className={confirmAction === "cancel" ? "bg-[#DC143C] hover:bg-[#DC143C]/90" : ""}
            >
              {statusMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
