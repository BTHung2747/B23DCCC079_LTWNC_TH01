import {
  createContext,
  useContext,
  type ComponentType,
  type ReactNode,
} from "react";
import type { IconProps } from "@phosphor-icons/react";
import type { AssignmentFilter } from "../assignmentTypes";

interface FilterContextValue {
  value: AssignmentFilter;
  onChange: (value: AssignmentFilter) => void;
  getCount: (value: AssignmentFilter) => number;
}

const FilterContext = createContext<FilterContextValue | null>(null);

function useFilterContext() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("AssignmentFilters.Item phải nằm trong AssignmentFilters.Root");
  }
  return context;
}

interface RootProps extends FilterContextValue {
  children: ReactNode;
}

function Root({ value, onChange, getCount, children }: RootProps) {
  return (
    <FilterContext.Provider value={{ value, onChange, getCount }}>
      <nav className="filter-nav" aria-label="Lọc bài tập">
        <p className="nav-heading">Danh sách</p>
        {children}
      </nav>
    </FilterContext.Provider>
  );
}

interface ItemProps {
  value: AssignmentFilter;
  label: string;
  icon: ComponentType<IconProps>;
}

function Item({ value, label, icon: Icon }: ItemProps) {
  const filters = useFilterContext();
  const active = filters.value === value;

  return (
    <button
      className={active ? "nav-item active" : "nav-item"}
      type="button"
      onClick={() => filters.onChange(value)}
      aria-pressed={active}
    >
      <Icon size={18} weight={active ? "fill" : "regular"} />
      <span>{label}</span>
      <strong>{filters.getCount(value)}</strong>
    </button>
  );
}

// Compound Component pattern: AssignmentFilters.Root + AssignmentFilters.Item.
export const AssignmentFilters = { Root, Item };
