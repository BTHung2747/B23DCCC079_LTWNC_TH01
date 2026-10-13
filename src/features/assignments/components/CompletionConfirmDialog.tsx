import { useEffect } from "react";
import { Check, CheckCircle, X } from "@phosphor-icons/react";
import type { Assignment } from "../assignmentTypes";

interface CompletionConfirmDialogProps {
  assignment: Assignment | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function CompletionConfirmDialog({
  assignment,
  onCancel,
  onConfirm,
}: CompletionConfirmDialogProps) {
  useEffect(() => {
    if (!assignment) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [assignment, onCancel]);

  if (!assignment) return null;

  return (
    <div className="confirm-layer" role="presentation" onMouseDown={onCancel}>
      <section
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-heading"
        aria-describedby="confirm-description"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="confirm-close"
          type="button"
          onClick={onCancel}
          aria-label="Đóng xác nhận"
        >
          <X size={19} />
        </button>

        <div className="confirm-content">
          <span className="confirm-icon" aria-hidden="true">
            <CheckCircle size={27} weight="fill" />
          </span>
          <div>
            <span className="confirm-subject">{assignment.subject}</span>
            <h2 id="confirm-heading">Xác nhận hoàn thành</h2>
            <p id="confirm-description">
              <strong>{assignment.title}</strong>
              Bài tập sẽ được chuyển sang danh sách đã hoàn thành.
            </p>
          </div>
        </div>

        <div className="confirm-actions">
          <button className="cancel-button" type="button" onClick={onCancel} autoFocus>
            Quay lại
          </button>
          <button
            className="confirm-button"
            type="button"
            onClick={onConfirm}
          >
            <Check size={16} weight="bold" />
            Đã hoàn thành
          </button>
        </div>
      </section>
    </div>
  );
}
