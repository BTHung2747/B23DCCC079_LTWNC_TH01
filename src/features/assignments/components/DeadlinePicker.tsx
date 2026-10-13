import { useState } from "react";
import { CaretLeft, CaretRight, Clock } from "@phosphor-icons/react";

const weekdayLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] as const;
const hourOptions = Array.from({ length: 24 }, (_, hour) =>
  String(hour).padStart(2, "0"),
);
const minuteOptions = ["00", "15", "30", "45", "59"] as const;

const monthFormatter = new Intl.DateTimeFormat("vi-VN", {
  month: "long",
  year: "numeric",
});

const selectedDateFormatter = new Intl.DateTimeFormat("vi-VN", {
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const accessibleDateFormatter = new Intl.DateTimeFormat("vi-VN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

interface DeadlinePickerProps {
  dueDate: string;
  dueTime: string;
  today: string;
  currentTime: string;
  error: string;
  onChange: (date: string, time: string) => void;
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getCalendarCells(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const leadingEmptyCells = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  return [
    ...Array.from({ length: leadingEmptyCells }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) =>
      new Date(year, monthIndex, index + 1),
    ),
  ];
}

export function DeadlinePicker({
  dueDate,
  dueTime,
  today,
  currentTime,
  error,
  onChange,
}: DeadlinePickerProps) {
  const initialMonth = dueDate ? fromDateKey(dueDate) : fromDateKey(today);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(initialMonth));
  const currentMonth = startOfMonth(fromDateKey(today));
  const calendarCells = getCalendarCells(visibleMonth);
  const [selectedHour, selectedMinute] = dueTime.split(":");
  const canGoToPreviousMonth = visibleMonth.getTime() > currentMonth.getTime();

  function changeMonth(offset: number) {
    setVisibleMonth(
      (month) => new Date(month.getFullYear(), month.getMonth() + offset, 1),
    );
  }

  function isTimeInPast(time: string) {
    return dueDate === today && time < currentTime;
  }

  return (
    <fieldset
      className="deadline-fieldset"
      aria-invalid={Boolean(error)}
      aria-describedby="due-date-help"
    >
      <legend>Hạn nộp</legend>

      <div className="deadline-picker">
        <section className="deadline-date-pane" aria-labelledby="date-picker-label">
          <header className="picker-pane-header">
            <div>
              <span id="date-picker-label">Ngày nộp</span>
              <strong>
                {dueDate
                  ? selectedDateFormatter.format(fromDateKey(dueDate))
                  : "Chọn một ngày"}
              </strong>
            </div>

            <div className="month-navigation" aria-label="Chuyển tháng">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                disabled={!canGoToPreviousMonth}
                aria-label="Tháng trước"
              >
                <CaretLeft size={16} weight="bold" />
              </button>
              <span>{monthFormatter.format(visibleMonth)}</span>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                aria-label="Tháng sau"
              >
                <CaretRight size={16} weight="bold" />
              </button>
            </div>
          </header>

          <div className="calendar-weekdays" aria-hidden="true">
            {weekdayLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          <div className="date-picker-grid">
            {calendarCells.map((date, index) => {
              if (!date) {
                return <span key={`empty-${index}`} aria-hidden="true" />;
              }

              const dateKey = toDateKey(date);
              const isPast = dateKey < today;
              const isSelected = dateKey === dueDate;
              const isToday = dateKey === today;

              return (
                <button
                  key={dateKey}
                  className={`date-choice${isSelected ? " selected" : ""}${
                    isToday ? " today" : ""
                  }`}
                  type="button"
                  onClick={() => onChange(dateKey, dueTime)}
                  disabled={isPast}
                  aria-label={accessibleDateFormatter.format(date)}
                  aria-pressed={isSelected}
                  aria-current={isToday ? "date" : undefined}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </section>

        <section className="deadline-time-pane" aria-labelledby="time-picker-label">
          <header className="picker-pane-header time-pane-header">
            <div>
              <span id="time-picker-label">Giờ nộp</span>
              <strong>{dueTime}</strong>
            </div>
            <Clock size={21} weight="duotone" aria-hidden="true" />
          </header>

          <span className="time-group-label">Giờ</span>
          <div className="hour-choice-grid" role="group" aria-label="Chọn giờ nộp">
            {hourOptions.map((hour) => {
              const time = `${hour}:${selectedMinute}`;
              return (
                <button
                  key={hour}
                  className={hour === selectedHour ? "time-choice selected" : "time-choice"}
                  type="button"
                  onClick={() => onChange(dueDate, time)}
                  disabled={isTimeInPast(time)}
                  aria-pressed={hour === selectedHour}
                >
                  {hour}:00
                </button>
              );
            })}
          </div>

          <span className="time-group-label minute-label">Phút</span>
          <div className="minute-choice-grid" role="group" aria-label="Chọn phút nộp">
            {minuteOptions.map((minute) => {
              const time = `${selectedHour}:${minute}`;
              return (
                <button
                  key={minute}
                  className={minute === selectedMinute ? "time-choice selected" : "time-choice"}
                  type="button"
                  onClick={() => onChange(dueDate, time)}
                  disabled={isTimeInPast(time)}
                  aria-pressed={minute === selectedMinute}
                >
                  :{minute}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <small
        id="due-date-help"
        className={error ? "field-help field-error" : "field-help"}
        role={error ? "alert" : undefined}
      >
        {error || "Chọn ngày và giờ từ thời điểm hiện tại trở đi."}
      </small>
    </fieldset>
  );
}
