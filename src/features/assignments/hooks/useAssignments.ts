import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  addAssignment,
  deleteAssignment,
  fetchAssignments,
  setFilter,
  toggleAssignment,
} from "../assignmentsSlice";
import type {
  AssignmentFilter,
  AssignmentStats,
  NewAssignment,
} from "../assignmentTypes";
import { isOverdue, matchesFilter } from "../assignmentUtils";

export function useAssignments() {
  const dispatch = useAppDispatch();
  const { items, filter, status, error } = useAppSelector(
    (state) => state.assignments,
  );

  useEffect(() => {
    if (status === "idle") void dispatch(fetchAssignments());
  }, [dispatch, status]);

  const visibleAssignments = useMemo(
    () =>
      items
        .filter((item) => matchesFilter(item, filter))
        .sort((a, b) => {
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          return a.dueDate.localeCompare(b.dueDate);
        }),
    [filter, items],
  );

  const stats = useMemo<AssignmentStats>(() => {
    const completed = items.filter((item) => item.completed).length;
    const overdue = items.filter(isOverdue).length;
    const pending = items.filter(
      (item) => !item.completed && !isOverdue(item),
    ).length;

    return {
      total: items.length,
      completed,
      overdue,
      pending,
      open: items.length - completed,
    };
  }, [items]);

  const changeFilter = useCallback(
    (value: AssignmentFilter) => dispatch(setFilter(value)),
    [dispatch],
  );
  const add = useCallback(
    (value: NewAssignment) => dispatch(addAssignment(value)),
    [dispatch],
  );
  const toggle = useCallback(
    (id: string) => dispatch(toggleAssignment(id)),
    [dispatch],
  );
  const remove = useCallback(
    (id: string) => dispatch(deleteAssignment(id)),
    [dispatch],
  );
  const retry = useCallback(() => void dispatch(fetchAssignments()), [dispatch]);

  return {
    assignments: items,
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
  };
}
