import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { isApiResponse, isAssignmentList } from "./assignmentGuards";
import { fetchAssignmentsMock } from "./assignmentsApi";
import type {
  Assignment,
  AssignmentFilter,
  LoadingStatus,
  NewAssignment,
} from "./assignmentTypes";

interface AssignmentsState {
  items: Assignment[];
  filter: AssignmentFilter;
  status: LoadingStatus;
  error: string | null;
}

const initialState: AssignmentsState = {
  items: [],
  filter: "all",
  status: "idle",
  error: null,
};

export const fetchAssignments = createAsyncThunk<
  Assignment[],
  void,
  { rejectValue: string; state: { assignments: AssignmentsState } }
>(
  "assignments/fetchAssignments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAssignmentsMock();

      if (!isApiResponse(response, isAssignmentList) || !response.success) {
        return rejectWithValue("Dữ liệu mẫu không đúng định dạng.");
      }

      return response.data;
    } catch {
      return rejectWithValue("Không thể tải danh sách bài tập.");
    }
  },
  {
    condition: (_, { getState }) => getState().assignments.status !== "loading",
  },
);

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<AssignmentFilter>) {
      state.filter = action.payload;
    },
    addAssignment: {
      reducer(state, action: PayloadAction<Assignment>) {
        state.items.unshift(action.payload);
        state.filter = "all";
      },
      prepare(newAssignment: NewAssignment) {
        return {
          payload: {
            ...newAssignment,
            id: crypto.randomUUID(),
            completed: false,
          },
        };
      },
    },
    toggleAssignment(state, action: PayloadAction<string>) {
      const assignment = state.items.find((item) => item.id === action.payload);
      if (assignment) assignment.completed = !assignment.completed;
    },
    deleteAssignment(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Đã có lỗi xảy ra.";
      });
  },
});

export const {
  addAssignment,
  deleteAssignment,
  setFilter,
  toggleAssignment,
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;
