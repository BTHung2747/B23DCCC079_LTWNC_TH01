import type { ApiResponse, Assignment, Priority } from "./assignmentTypes";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isPriority(value: unknown): value is Priority {
  return value === "low" || value === "medium" || value === "high";
}

export function isAssignment(value: unknown): value is Assignment {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.subject === "string" &&
    typeof value.title === "string" &&
    typeof value.dueDate === "string" &&
    typeof value.dueTime === "string" &&
    /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value.dueTime) &&
    isPriority(value.priority) &&
    typeof value.completed === "boolean"
  );
}

export function isAssignmentList(value: unknown): value is Assignment[] {
  return Array.isArray(value) && value.every(isAssignment);
}

// Generic type guard: kiểm tra cả vỏ phản hồi lẫn dữ liệu bên trong.
export function isApiResponse<T>(
  value: unknown,
  isData: (candidate: unknown) => candidate is T,
): value is ApiResponse<T> {
  if (!isRecord(value)) return false;

  return (
    typeof value.success === "boolean" &&
    typeof value.message === "string" &&
    isData(value.data)
  );
}
