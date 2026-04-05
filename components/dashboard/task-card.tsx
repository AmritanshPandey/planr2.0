"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/task-types";

interface TaskCardProps {
  task: Task;
  index: number;
  onToggleStatus?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  busy?: boolean;
}

export function TaskCard({
  task,
  index,
  onToggleStatus,
  onDelete,
  busy = false,
}: TaskCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: "easeOut" }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="cursor-pointer transition-shadow hover:shadow-md hover:shadow-zinc-500/20">
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div className="flex flex-col gap-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{task.title}</p>
            <p className="text-sm text-muted-foreground">
              {task.timeStart} – {task.timeEnd}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                task.status === "Done"
                  ? "bg-emerald-950 text-emerald-400"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {task.status}
            </span>
            <span className="text-xs text-muted-foreground">{task.duration}</span>
            {(onToggleStatus || onDelete) && (
              <div className="mt-2 flex items-center gap-2">
                {onToggleStatus && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleStatus(task);
                    }}
                  >
                    {task.status === "Done" ? "Mark Upcoming" : "Mark Done"}
                  </Button>
                )}
                {onDelete && (
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    disabled={busy}
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(task);
                    }}
                  >
                    Delete
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
