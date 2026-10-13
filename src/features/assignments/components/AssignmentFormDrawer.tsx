import { useState, type FormEvent } from "react";
import { CalendarDots, X } from "@phosphor-icons/react";
import { DeadlinePicker } from "./DeadlinePicker";
import {
  priorities,
  type NewAssignment,
  type Priority,
} from "../assignmentTypes";
import { getLocalDateKey, getLocalTimeKey } from "../assignmentUtils";

const priorityLabels: Record<Priority, string> = {
  low: "thấp",
  medium: "vừa",
  high: "cao",
};

const subjectSuggestions = [
  "Lập trình Web nâng cao",
  "Cơ sở dữ liệu",
  "Mạng máy tính",
  "Phân tích thiết kế hệ thống",
  "Trí tuệ nhân tạo",
  "An toàn thông tin",
  "Kỹ thuật phần mềm",
  "Lập trình di động",
  "Hệ điều hành",
  "Toán rời rạc",
] as const;

interface AssignmentFormDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (assignment: NewAssignment) => void;
}

export function AssignmentFormDrawer({
  open,
  onClose,
  onSubmit,
}: AssignmentFormDrawerProps) {
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("23:59");
  const [dateError, setDateError] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const today = getLocalDateKey();
  const currentTime = getLocalTimeKey();

  if (!open) return null;

  function resetForm() {
    setSubject("");
    setTitle("");
    setDueDate("");
    setDueTime("23:59");
    setDateError("");
    setPriority("medium");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!subject.trim() || !title.trim() || !dueTime) return;
    if (!dueDate) {
      setDateError("Vui lòng chọn ngày nộp.");
      return;
    }
    if (isDeadlineInPast(dueDate, dueTime)) {
      setDateError("Hạn nộp không được sớm hơn thời điểm hiện tại.");
      return;
    }

    onSubmit({
      subject: subject.trim(),
      title: title.trim(),
      dueDate,
      dueTime,
      priority,
    });
    resetForm();
    onClose();
  }

  function isDeadlineInPast(date: string, time: string) {
    return date < today || (date === today && time < currentTime);
  }

  function updateDeadline(date: string, time: string) {
    setDueDate(date);
    setDueTime(time);
    setDateError(
      date && time && isDeadlineInPast(date, time)
        ? "Hạn nộp không được sớm hơn thời điểm hiện tại."
        : "",
    );
  }

  return (
    <div className="drawer-layer" role="presentation" onMouseDown={onClose}>
      <aside
        className="form-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-heading"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <span>Bài tập mới</span>
            <h2 id="form-heading">Thêm vào lịch học</h2>
          </div>
          <button
            className="close-button"
            type="button"
            onClick={onClose}
            aria-label="Đóng form"
          >
            <X size={21} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Môn học</span>
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Chọn hoặc nhập tên môn học"
              list="subject-suggestions"
              autoFocus
              required
            />
            <datalist id="subject-suggestions">
              {subjectSuggestions.map((suggestion) => (
                <option key={suggestion} value={suggestion} />
              ))}
            </datalist>
          </label>

          <label className="field">
            <span>Tên bài tập</span>
            <textarea
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Nội dung cần hoàn thành"
              rows={4}
              required
            />
          </label>

          <DeadlinePicker
            dueDate={dueDate}
            dueTime={dueTime}
            today={today}
            currentTime={currentTime}
            error={dateError}
            onChange={updateDeadline}
          />

          <fieldset className="priority-field">
            <legend>Độ ưu tiên</legend>
            <div className="priority-options">
              {priorities.map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="priority"
                    value={value}
                    checked={priority === value}
                    onChange={() => setPriority(value)}
                  />
                  <span>{priorityLabels[value]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button className="submit-button" type="submit">
            <CalendarDots size={19} weight="bold" />
            Lưu bài tập
          </button>
        </form>
      </aside>
    </div>
  );
}
