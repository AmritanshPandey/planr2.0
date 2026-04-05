"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { StatsCard } from "@/components/dashboard/stats-card";
import { TaskList } from "@/components/dashboard/task-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { signOutCurrentUser } from "@/lib/auth";
import { firebaseEnvReady } from "@/lib/firebase";
import { createTask, removeTask, subscribeToTasks, toggleTaskStatus } from "@/lib/tasks";
import type { Task } from "@/lib/task-types";

function formatToday() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [timeStart, setTimeStart] = useState("09:00");
  const [timeEnd, setTimeEnd] = useState("10:00");
  const [taskLoading, setTaskLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const unsubscribe = subscribeToTasks(
      user.uid,
      (nextTasks) => {
        setTasks(nextTasks);
      },
      (snapshotError) => {
        showToast({
          title: "Sync failed",
          description: snapshotError.message,
          variant: "error",
          durationMs: 4500,
        });
      }
    );

    return unsubscribe;
  }, [user, showToast]);

  const doneTasks = useMemo(
    () => tasks.filter((task) => task.status === "Done").length,
    [tasks]
  );
  const upcomingTasks = useMemo(
    () => tasks.filter((task) => task.status === "Upcoming").length,
    [tasks]
  );

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [loading, user, router]);

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      return;
    }

    setTaskLoading(true);

    try {
      await createTask(user.uid, { title, timeStart, timeEnd });
      setTitle("");
      showToast({
        title: "Task added",
        description: "Your task was created successfully.",
        variant: "success",
      });
    } catch (createError) {
      showToast({
        title: "Could not add task",
        description:
          createError instanceof Error ? createError.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setTaskLoading(false);
    }
  }

  async function handleToggleTask(task: Task) {
    if (!user) {
      return;
    }

    setTaskLoading(true);

    try {
      await toggleTaskStatus(user.uid, task.id, task.status);
      showToast({
        title: "Task updated",
        description:
          task.status === "Done"
            ? "Marked as upcoming."
            : "Marked as done.",
        variant: "success",
      });
    } catch (toggleError) {
      showToast({
        title: "Could not update task",
        description:
          toggleError instanceof Error ? toggleError.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setTaskLoading(false);
    }
  }

  async function handleDeleteTask(task: Task) {
    if (!user) {
      return;
    }

    setTaskLoading(true);

    try {
      await removeTask(user.uid, task.id);
      showToast({
        title: "Task deleted",
        description: "The task was removed.",
        variant: "success",
      });
    } catch (deleteError) {
      showToast({
        title: "Could not delete task",
        description:
          deleteError instanceof Error ? deleteError.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setTaskLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center py-10">
        <p className="text-sm text-muted-foreground">Loading your workspace...</p>
      </main>
    );
  }

  if (!firebaseEnvReady) {
    return (
      <main className="mx-auto flex min-h-[75vh] w-full max-w-2xl flex-col justify-center gap-4 py-10">
        <h1 className="text-3xl font-bold text-foreground">Firebase Setup Required</h1>
        <p className="text-sm text-muted-foreground">
          Create a <span className="text-foreground">.env.local</span> file and add all
          NEXT_PUBLIC_FIREBASE_* variables from your Firebase web app config.
        </p>
        <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
          <p>NEXT_PUBLIC_FIREBASE_API_KEY=</p>
          <p>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=</p>
          <p>NEXT_PUBLIC_FIREBASE_PROJECT_ID=</p>
          <p>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=</p>
          <p>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=</p>
          <p>NEXT_PUBLIC_FIREBASE_APP_ID=</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 py-10 text-center">
        <h1 className="text-3xl font-bold text-foreground">Redirecting...</h1>
        <p className="text-sm text-muted-foreground">Taking you to authentication.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-8 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Execution Board
          </p>
          <h2 className="text-3xl font-bold text-foreground">{formatToday()}</h2>
          <p className="text-xs text-muted-foreground">Signed in as {user.email}</p>
        </div>

        <Button type="button" variant="outline" onClick={() => void signOutCurrentUser()}>
          Sign Out
        </Button>
      </div>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Overview
        </h3>
        <div className="flex flex-col gap-4 sm:flex-row">
          <StatsCard title="Total Tasks" value={tasks.length} />
          <StatsCard title="Upcoming" value={upcomingTasks} />
          <StatsCard title="Done" value={doneTasks} />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Add Task
        </h3>
        <form
          onSubmit={handleCreateTask}
          className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto_auto]"
        >
          <Input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <Input
            type="time"
            value={timeStart}
            onChange={(event) => setTimeStart(event.target.value)}
            required
          />
          <Input
            type="time"
            value={timeEnd}
            onChange={(event) => setTimeEnd(event.target.value)}
            required
          />
          <Button type="submit" disabled={taskLoading}>
            Add
          </Button>
        </form>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Today&#39;s Tasks
        </h3>
        <TaskList
          tasks={tasks}
          onToggleStatus={(task) => void handleToggleTask(task)}
          onDelete={(task) => void handleDeleteTask(task)}
          busy={taskLoading}
        />
      </section>

    </main>
  );
}
