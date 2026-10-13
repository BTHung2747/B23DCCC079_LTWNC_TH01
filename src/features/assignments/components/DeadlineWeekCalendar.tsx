import { useEffect, useMemo, useState } from "react";
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
  CheckCircle,
  Clock,
  ClockCountdown,
  Flag,
  X,
} from "@phosphor-icons/react";
import type { Assignment } from "../assignmentTypes";
import {
  getDaysFromToday,
  getDateParts,
  getLocalDateKey,
  isOverdue,
} from "../assignmentUtils";

const dayLabels = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];
const priorityLabels = {
  low: "Thấp",
  medium: "Vừa",
  high: "Cao",
} as const;

function startOfWeek(date: Date) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = result.getDay();
  result.setDate(result.getDate() + (day === 0 ? -6 : 1 - day));
  return result;
}

function addDays(date: Date, amount: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function formatWeekRange(start: Date, end: Date) {
  const startText = `${String(start.getDate()).padStart(2, "0")}/${String(
    start.getMonth() + 1,
  ).padStart(2, "0")}`;
  const endText = `${String(end.getDate()).padStart(2, "0")}/${String(
    end.getMonth() + 1,
  ).padStart(2, "0")}/${end.getFullYear()}`;
  return `${startText} - ${endText}`;
}

function getEntryStatus(assignment: Assignment) {
  if (assignment.completed) return "Đã nộp";
  if (isOverdue(assignment)) return "Quá hạn";
  return "Sắp đến hạn";
}

function formatFullDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function getDetailedStatus(assignment: Assignment) {
  if (assignment.completed) return "Đã nộp";

  const days = getDaysFromToday(assignment.dueDate);
  if (days === 0 && isOverdue(assignment)) return "Quá hạn hôm nay";
  if (days === 0) return "Hạn hôm nay";
  if (days < 0) return `Quá hạn ${Math.abs(days)} ngày`;
  return `Còn ${days} ngày`;
}

interface DeadlineWeekCalendarProps {
  assignments: Assignment[];
}

export function DeadlineWeekCalendar({ assignments }: DeadlineWeekCalendarProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const todayKey = getLocalDateKey();
  const weekStart = useMemo(
    () => addDays(startOfWeek(new Date()), weekOffset * 7),
    [weekOffset],
  );
  const days = useMemo(
    () => dayLabels.map((label, index) => ({ label, date: addDays(weekStart, index) })),
    [weekStart],
  );
  const weekEnd = days[days.length - 1].date;
  const weekKeys = new Set(days.map((day) => getLocalDateKey(day.date)));
  const deadlineCount = assignments.filter((item) => weekKeys.has(item.dueDate)).length;
  const selectedAssignment = assignments.find(
    (assignment) => assignment.id === selectedAssignmentId,
  );
  const selectedDate = selectedAssignment
    ? getDateParts(selectedAssignment.dueDate)
    : null;

  useEffect(() => {
    if (!selectedAssignment) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedAssignmentId(null);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAssignment]);

  function changeWeek(offset: number) {
    setSelectedAssignmentId(null);
    setWeekOffset(offset);
  }

  return (
    <section className="calendar-section" aria-labelledby="calendar-heading">
      <div className="calendar-heading-row">
        <div>
          <div className="calendar-title-line">
            <CalendarBlank size={20} weight="duotone" />
            <h2 id="calendar-heading">Lịch deadline</h2>
          </div>
          <p>
            {formatWeekRange(weekStart, weekEnd)}, {deadlineCount} bài đến hạn
          </p>
        </div>

        <div className="calendar-controls" aria-label="Chuyển tuần">
          <button
            className="calendar-nav-button"
            type="button"
            onClick={() => changeWeek(weekOffset - 1)}
            aria-label="Tuần trước"
          >
            <CaretLeft size={17} weight="bold" />
          </button>
          <button
            className="calendar-current-button"
            type="button"
            onClick={() => changeWeek(0)}
            disabled={weekOffset === 0}
          >
            Tuần này
          </button>
          <button
            className="calendar-nav-button"
            type="button"
            onClick={() => changeWeek(weekOffset + 1)}
            aria-label="Tuần sau"
          >
            <CaretRight size={17} weight="bold" />
          </button>
        </div>
      </div>

      <div className="calendar-scroll" tabIndex={0}>
        <div className="week-grid">
          {days.map((day) => {
            const dateKey = getLocalDateKey(day.date);
            const dayAssignments = assignments
              .filter((item) => item.dueDate === dateKey)
              .sort(
                (a, b) =>
                  Number(a.completed) - Number(b.completed) ||
                  a.dueTime.localeCompare(b.dueTime),
              );
            const current = dateKey === todayKey;

            return (
              <section
                className={current ? "week-day current" : "week-day"}
                key={dateKey}
                aria-label={`${day.label}, ${day.date.getDate()} tháng ${day.date.getMonth() + 1}`}
              >
                <header>
                  <span>{day.label}</span>
                  <strong>{day.date.getDate()}</strong>
                </header>

                <div className="day-deadlines">
                  {dayAssignments.length === 0 ? (
                    <span className="no-deadline">Trống</span>
                  ) : (
                    dayAssignments.map((assignment) => {
                      const overdue = isOverdue(assignment);
                      const entryClass = assignment.completed
                        ? "deadline-entry completed"
                        : overdue
                          ? "deadline-entry overdue"
                          : "deadline-entry";

                      return (
                        <button
                          className={`${entryClass}${
                            selectedAssignmentId === assignment.id ? " selected" : ""
                          }`}
                          key={assignment.id}
                          type="button"
                          onClick={() =>
                            setSelectedAssignmentId((currentId) =>
                              currentId === assignment.id ? null : assignment.id,
                            )
                          }
                          aria-expanded={selectedAssignmentId === assignment.id}
                          aria-controls="deadline-detail-dialog"
                        >
                          <span>{assignment.subject}</span>
                          <strong title={assignment.title}>{assignment.title}</strong>
                          <small>
                            {assignment.dueTime} · {getEntryStatus(assignment)}
                          </small>
                        </button>
                      );
                    })
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {selectedAssignment && (
        <div
          className="deadline-detail-layer"
          role="presentation"
          onMouseDown={() => setSelectedAssignmentId(null)}
        >
          <section
            className={`deadline-detail-card ${
              selectedAssignment.completed
                ? "completed"
                : isOverdue(selectedAssignment)
                  ? "overdue"
                  : "upcoming"
            }`}
            id="deadline-detail-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="deadline-detail-heading"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <time
                className="deadline-detail-date"
                dateTime={selectedAssignment.dueDate}
              >
                <strong>{selectedDate?.day}</strong>
                <span>THG {selectedDate?.month}</span>
              </time>
              <div className="deadline-detail-heading">
                <span>{selectedAssignment.subject}</span>
                <h3 id="deadline-detail-heading">{selectedAssignment.title}</h3>
                <p>
                  <Clock size={14} weight="duotone" aria-hidden="true" />
                  <span>
                    {formatFullDate(selectedAssignment.dueDate)} · {selectedAssignment.dueTime}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAssignmentId(null)}
                aria-label="Đóng chi tiết deadline"
                autoFocus
              >
                <X size={18} />
              </button>
            </header>

            <div className="deadline-detail-grid">
              <div
                className={`detail-priority priority-${selectedAssignment.priority}`}
              >
                <Flag size={19} weight="duotone" aria-hidden="true" />
                <span>
                  Độ ưu tiên
                  <strong>{priorityLabels[selectedAssignment.priority]}</strong>
                </span>
              </div>
              <div
                className={
                  selectedAssignment.completed
                    ? "detail-status completed"
                    : isOverdue(selectedAssignment)
                      ? "detail-status overdue"
                      : "detail-status upcoming"
                }
              >
                {selectedAssignment.completed ? (
                  <CheckCircle size={19} weight="duotone" aria-hidden="true" />
                ) : (
                  <ClockCountdown size={19} weight="duotone" aria-hidden="true" />
                )}
                <span>
                  Trạng thái
                  <strong>{getDetailedStatus(selectedAssignment)}</strong>
                </span>
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
