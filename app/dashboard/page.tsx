import { StatsCard } from "@/components/dashboard/stats-card";
import { TaskList } from "@/components/dashboard/task-list";
import type { Task } from "@/components/dashboard/task-card";

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Morning review & planning",
    timeStart: "08:00",
    timeEnd: "08:30",
    duration: "30 min",
    status: "Done",
  },
  {
    id: "2",
    title: "Deep work – feature build",
    timeStart: "09:00",
    timeEnd: "11:00",
    duration: "2 hr",
    status: "Done",
  },
  {
    id: "3",
    title: "Team standup",
    timeStart: "11:15",
    timeEnd: "11:30",
    duration: "15 min",
    status: "Done",
  },
  {
    id: "4",
    title: "Lunch break",
    timeStart: "12:30",
    timeEnd: "13:15",
    duration: "45 min",
    status: "Upcoming",
  },
  {
    id: "5",
    title: "Code review session",
    timeStart: "14:00",
    timeEnd: "15:00",
    duration: "1 hr",
    status: "Upcoming",
  },
  {
    id: "6",
    title: "End-of-day wrap-up",
    timeStart: "17:30",
    timeEnd: "18:00",
    duration: "30 min",
    status: "Upcoming",
  },
];

const totalTasks = mockTasks.length;
const doneTasks = mockTasks.filter((t) => t.status === "Done").length;
const upcomingTasks = mockTasks.filter((t) => t.status === "Upcoming").length;

export default function DashboardPage() {
  return (
    <main className="flex flex-col gap-8 py-10">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-[#a1a1aa] uppercase tracking-widest">
          Office Day
        </p>
        <h2 className="text-3xl font-bold text-[#fafafa]">
          Tuesday, April 1, 2025
        </h2>
      </div>

      {/* Stats */}
      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#71717a]">
          Overview
        </h3>
        <div className="flex flex-col gap-4 sm:flex-row">
          <StatsCard title="Total Tasks" value={totalTasks} />
          <StatsCard title="Upcoming" value={upcomingTasks} />
          <StatsCard title="Done" value={doneTasks} />
        </div>
      </section>

      {/* Task list */}
      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#71717a]">
          Today&#39;s Tasks
        </h3>
        <TaskList tasks={mockTasks} />
      </section>
    </main>
  );
}
