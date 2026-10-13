export const priorities = ["low", "medium", "high"] as const;
export type Priority = (typeof priorities)[number];

export const assignmentFilterValues = [
  "all",
  "pending",
  "overdue",
  "completed",
] as const;
export type AssignmentFilter = (typeof assignmentFilterValues)[number];

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  dueTime: string;
  priority: Priority;
  completed: boolean;
}

// Utility type: dữ liệu từ form không được tự truyền id và completed.
export type NewAssignment = Omit<Assignment, "id" | "completed">;

// Generic: cùng một cấu trúc phản hồi có thể dùng cho mọi kiểu dữ liệu.
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type LoadingStatus = "idle" | "loading" | "succeeded" | "failed";

export interface AssignmentStats {
  total: number;
  pending: number;
  overdue: number;
  completed: number;
  open: number;
}
