import { useMemo } from "react";
import type { Assignment } from "../assignmentTypes";
import { getDaysFromToday, isOverdue } from "../assignmentUtils";

type DeadlineSource = Pick<Assignment, "dueDate" | "dueTime" | "completed">;

export function useDeadline(assignment: DeadlineSource) {
  const { dueDate, dueTime, completed } = assignment;

  return useMemo(() => {
    if (completed) return { label: "Đã nộp", overdue: false };

    const days = getDaysFromToday(dueDate);
    if (days === 0 && isOverdue(assignment)) {
      return { label: "Quá hạn hôm nay", overdue: true };
    }
    if (days < 0) {
      return { label: `Quá hạn ${Math.abs(days)} ngày`, overdue: true };
    }
    if (days === 0) return { label: "Nộp hôm nay", overdue: false };
    if (days === 1) return { label: "Còn 1 ngày", overdue: false };
    return { label: `Còn ${days} ngày`, overdue: false };
  }, [assignment, completed, dueDate, dueTime]);
}
