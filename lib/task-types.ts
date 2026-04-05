export type TaskStatus = "Done" | "Upcoming";

export interface Task {
  id: string;
  title: string;
  timeStart: string;
  timeEnd: string;
  duration: string;
  status: TaskStatus;
  createdAt?: number;
}

export interface CreateTaskInput {
  title: string;
  timeStart: string;
  timeEnd: string;
}
