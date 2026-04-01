"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface Task {
  id: string;
  title: string;
  timeStart: string;
  timeEnd: string;
  duration: string;
  status: "Done" | "Upcoming";
}

interface TaskCardProps {
  task: Task;
  index: number;
}

export function TaskCard({ task, index }: TaskCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: "easeOut" }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="cursor-pointer transition-shadow hover:shadow-md hover:shadow-black/30">
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div className="flex flex-col gap-1 min-w-0">
            <p className="font-semibold text-[#fafafa] truncate">{task.title}</p>
            <p className="text-sm text-[#a1a1aa]">
              {task.timeStart} – {task.timeEnd}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                task.status === "Done"
                  ? "bg-emerald-950 text-emerald-400"
                  : "bg-zinc-800 text-zinc-300"
              )}
            >
              {task.status}
            </span>
            <span className="text-xs text-[#71717a]">{task.duration}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
