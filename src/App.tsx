import { useMemo, useState } from "react";
import {
  Archive,
  BookOpen,
  CheckCircle,
  Clock,
  ListChecks,
  Plus,
  Warning,
} from "@phosphor-icons/react";
import { AssignmentFilters } from "./features/assignments/components/AssignmentFilters";
import { AssignmentFormDrawer } from "./features/assignments/components/AssignmentFormDrawer";
import { AssignmentRow } from "./features/assignments/components/AssignmentRow";
import { CompletionConfirmDialog } from "./features/assignments/components/CompletionConfirmDialog";
import { DeadlineWeekCalendar } from "./features/assignments/components/DeadlineWeekCalendar";
import { useAssignments } from "./features/assignments/hooks/useAssignments";
import type {
  Assignment,
  AssignmentFilter,
  AssignmentStats,
} from "./features/assignments/assignmentTypes";

const filters = [
  { value: "all", label: "Tất cả bài tập", icon: ListChecks },
  { value: "pending", label: "Cần làm", icon: Clock },
  { value: "overdue", label: "Quá hạn", icon: Warning },
  { value: "completed", label: "Đã hoàn thành", icon: Archive },
] satisfies Array<{
  value: AssignmentFilter;
  label: string;
  icon: typeof ListChecks;
}>;

function getFilterCount(value: AssignmentFilter, stats: AssignmentStats) {
  if (value === "pending") return stats.pending;
  if (value === "overdue") return stats.overdue;
  if (value === "completed") return stats.completed;
  return stats.total;
}

function LoadingList() {
  return (
    <div className="task-list loading-list" aria-label="Đang tải bài tập">
      {[0, 1, 2].map((item) => (
        <div className="task-skeleton" key={item} aria-hidden="true">
          <span />
          <span />
          <div>
            <span />
            <span />
            <span />
          </div>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pendingCompletion, setPendingCompletion] = useState<Assignment | null>(null);
  const {
    assignments,
    filter,
    status,
    error,
    stats,
    visibleAssignments,
    changeFilter,
    add,
    toggle,
    remove,
    retry,
  } = useAssignments();

  const activeFilterLabel =
    filters.find((item) => item.value === filter)?.label ?? "Tất cả bài tập";

  function handleToggleRequest(assignment: Assignment) {
    if (assignment.completed) {
      toggle(assignment.id);
      return;
    }

    setPendingCompletion(assignment);
  }

  function confirmCompletion() {
    if (!pendingCompletion) return;
    toggle(pendingCompletion.id);
    setPendingCompletion(null);
  }

  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(new Date()),
    [],
  );

  return (
    <div className="planner-shell">
      <aside className="sidebar">
        <a className="brand" href="#main" aria-label="Deadline, về danh sách bài tập">
          <span className="brand-mark" aria-hidden="true">D</span>
          <span>Deadline</span>
        </a>

        <AssignmentFilters.Root
          value={filter}
          onChange={changeFilter}
          getCount={(value) => getFilterCount(value, stats)}
        >
          {filters.map((item) => (
            <AssignmentFilters.Item key={item.value} {...item} />
          ))}
        </AssignmentFilters.Root>

        <div className="semester-note">
          <BookOpen size={20} />
          <div>
            <span>Học kỳ hiện tại</span>
            <strong>{stats.completed} trong {stats.total} bài đã xong</strong>
          </div>
        </div>
      </aside>

      <main id="main" className="planner-main">
        <header className="page-header">
          <div>
            <p className="today">{today}</p>
            <h1>Bài tập của tôi</h1>
            <p className="page-summary">
              {status === "loading"
                ? "Đang lấy danh sách bài tập mẫu..."
                : stats.open === 0
                  ? "Không còn bài tập đang mở."
                  : `${stats.open} bài đang mở, ${stats.overdue} bài đã quá hạn.`}
            </p>
          </div>

          <button className="add-button" type="button" onClick={() => setIsFormOpen(true)}>
            <Plus size={18} weight="bold" />
            Thêm bài tập
          </button>
        </header>

        <div className="workspace-grid">
          <section className="task-section" aria-labelledby="task-heading">
            <div className="list-heading">
              <h2 id="task-heading">{activeFilterLabel}</h2>
              <span>{visibleAssignments.length} bài</span>
            </div>

            <div className="task-section-body">
              {status === "loading" && visibleAssignments.length === 0 ? (
                <LoadingList />
              ) : status === "failed" ? (
                <div className="empty-state error-state" role="alert">
                  <Warning size={38} weight="duotone" />
                  <h3>Chưa tải được dữ liệu</h3>
                  <p>{error}</p>
                  <button type="button" className="retry-button" onClick={retry}>
                    Thử lại
                  </button>
                </div>
              ) : visibleAssignments.length === 0 ? (
                <div className="empty-state">
                  <CheckCircle size={38} weight="duotone" />
                  <h3>Danh sách đang trống</h3>
                  <p>Chọn một mục khác hoặc thêm bài tập mới.</p>
                </div>
              ) : (
                <div className="task-list">
                  {visibleAssignments.map((assignment) => (
                    <AssignmentRow
                      key={assignment.id}
                      assignment={assignment}
                      onToggle={handleToggleRequest}
                      onDelete={remove}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          <div className="calendar-dock">
            <DeadlineWeekCalendar assignments={assignments} />
          </div>
        </div>
      </main>

      <AssignmentFormDrawer
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={add}
      />

      <CompletionConfirmDialog
        assignment={pendingCompletion}
        onCancel={() => setPendingCompletion(null)}
        onConfirm={confirmCompletion}
      />
    </div>
  );
}

export default App;
