import { TaskCard, type Task } from "@/components/dashboard/task-card";

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="text-center text-sm text-[#71717a] py-8">No tasks yet.</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task, index) => (
        <TaskCard key={task.id} task={task} index={index} />
      ))}
    </div>
  );
}
