import type { Assignment, AssignmentFilter } from "./assignmentTypes";

function startOfDay(value: string | Date) {
  const date = typeof value === "string" ? new Date(`${value}T00:00:00`) : value;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getLocalTimeKey(date = new Date()) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function getDaysFromToday(dueDate: string) {
  const dayInMs = 24 * 60 * 60 * 1000;
  return Math.round(
    (startOfDay(dueDate).getTime() - startOfDay(new Date()).getTime()) / dayInMs,
  );
}

export function isOverdue(
  assignment: Pick<Assignment, "dueDate" | "dueTime" | "completed">,
) {
  const deadline = new Date(`${assignment.dueDate}T${assignment.dueTime}:00`);
  return !assignment.completed && deadline.getTime() < Date.now();
}

export function matchesFilter(
  assignment: Assignment,
  filter: AssignmentFilter,
) {
  if (filter === "pending") {
    return !assignment.completed && !isOverdue(assignment);
  }
  if (filter === "overdue") return isOverdue(assignment);
  if (filter === "completed") return assignment.completed;
  return true;
}

export function getDateParts(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: String(date.getMonth() + 1).padStart(2, "0"),
  };
}
