import { TaskCard } from "@/components/dashboard/task-card";
import type { Task } from "@/lib/task-types";

interface TaskListProps {
  tasks: Task[];
  onToggleStatus?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  busy?: boolean;
}

export function TaskList({
  tasks,
  onToggleStatus,
  onDelete,
  busy = false,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">No tasks yet.</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task, index) => (
        <TaskCard
          key={task.id}
          task={task}
          index={index}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          busy={busy}
        />
      ))}
    </div>
  );
}
