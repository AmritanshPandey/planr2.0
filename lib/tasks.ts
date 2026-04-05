import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CreateTaskInput, Task, TaskStatus } from "@/lib/task-types";
import { createTaskSchema, firstValidationError } from "@/lib/validation";

function formatDuration(timeStart: string, timeEnd: string): string {
  const [startHour, startMinute] = timeStart.split(":").map(Number);
  const [endHour, endMinute] = timeEnd.split(":").map(Number);

  const startTotal = startHour * 60 + startMinute;
  let endTotal = endHour * 60 + endMinute;

  if (endTotal <= startTotal) {
    endTotal += 24 * 60;
  }

  const minutes = endTotal - startTotal;

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

function tasksCollection(userId: string) {
  if (!db) {
    throw new Error(
      "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* values in .env.local."
    );
  }

  return collection(db, "users", userId, "tasks");
}

export function subscribeToTasks(
  userId: string,
  onData: (tasks: Task[]) => void,
  onError?: (error: Error) => void
) {
  if (!db) {
    onError?.(
      new Error(
        "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* values in .env.local."
      )
    );
    return () => undefined;
  }

  const tasksQuery = query(tasksCollection(userId), orderBy("createdAt", "desc"));

  return onSnapshot(
    tasksQuery,
    (snapshot) => {
      const tasks = snapshot.docs.map((taskDoc) => {
        const data = taskDoc.data() as Omit<Task, "id">;
        return {
          id: taskDoc.id,
          ...data,
        };
      });

      onData(tasks);
    },
    (error) => {
      onError?.(error as Error);
    }
  );
}

export async function createTask(userId: string, input: CreateTaskInput) {
  const parsed = createTaskSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(firstValidationError(parsed.error));
  }

  const { title, timeStart, timeEnd } = parsed.data;

  await addDoc(tasksCollection(userId), {
    title,
    timeStart,
    timeEnd,
    duration: formatDuration(timeStart, timeEnd),
    status: "Upcoming" as TaskStatus,
    createdAt: Date.now(),
  });
}

export async function toggleTaskStatus(
  userId: string,
  taskId: string,
  currentStatus: TaskStatus
) {
  if (!db) {
    throw new Error(
      "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* values in .env.local."
    );
  }

  const nextStatus: TaskStatus = currentStatus === "Done" ? "Upcoming" : "Done";
  await updateDoc(doc(db, "users", userId, "tasks", taskId), {
    status: nextStatus,
  });
}

export async function removeTask(userId: string, taskId: string) {
  if (!db) {
    throw new Error(
      "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* values in .env.local."
    );
  }

  await deleteDoc(doc(db, "users", userId, "tasks", taskId));
}
