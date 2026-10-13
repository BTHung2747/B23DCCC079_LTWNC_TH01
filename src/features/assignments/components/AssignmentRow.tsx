import { Trash } from "@phosphor-icons/react";
import type { Assignment, Priority } from "../assignmentTypes";
import { getDateParts } from "../assignmentUtils";
import { useDeadline } from "../hooks/useDeadline";

const priorityLabels: Record<Priority, string> = {
  low: "Ưu tiên thấp",
  medium: "Ưu tiên vừa",
  high: "Ưu tiên cao",
};

interface AssignmentRowProps {
  assignment: Assignment;
  onToggle: (assignment: Assignment) => void;
  onDelete: (id: string) => void;
}

export function AssignmentRow({
  assignment,
  onToggle,
  onDelete,
}: AssignmentRowProps) {
  const date = getDateParts(assignment.dueDate);
  const deadline = useDeadline(assignment);

  return (
    <article className={assignment.completed ? "task-row completed" : "task-row"}>
      <button
        className="check-button"
        type="button"
        onClick={() => onToggle(assignment)}
        aria-label={
          assignment.completed
            ? `Bỏ hoàn thành ${assignment.title}`
            : `Đánh dấu hoàn thành ${assignment.title}`
        }
      >
      </button>

      <time
        className={deadline.overdue ? "date-block overdue" : "date-block"}
        dateTime={`${assignment.dueDate}T${assignment.dueTime}`}
      >
        <strong>{date.day}</strong>
        <span>THG {date.month}</span>
        <small>{assignment.dueTime}</small>
      </time>

      <div className="task-copy">
        <span className="subject">{assignment.subject}</span>
        <h3>{assignment.title}</h3>
        <div className="task-meta">
          <span className={`priority priority-${assignment.priority}`}>
            {priorityLabels[assignment.priority]}
          </span>
          <span className={deadline.overdue ? "deadline overdue" : "deadline"}>
            {deadline.label}
          </span>
        </div>
      </div>

      <button
        className="delete-button"
        type="button"
        onClick={() => onDelete(assignment.id)}
        aria-label={`Xoá ${assignment.title}`}
      >
        <Trash size={18} />
      </button>
    </article>
  );
}
