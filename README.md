# Student Deadline Tracker

Ứng dụng React + TypeScript quản lý deadline bài tập cá nhân. Dữ liệu ban đầu được lấy từ mock API chạy trong trình duyệt, vì vậy dự án không cần backend.

## Chạy dự án

```bash
npm install
npm run dev
```

Kiểm tra bản production:

```bash
npm run build
```

## Đối chiếu yêu cầu môn học

### Buổi 1: TypeScript nâng cao

- Generic `ApiResponse<T>` trong `assignmentTypes.ts`.
- Utility type `Omit` tạo `NewAssignment` và `Pick` tạo dữ liệu đầu vào cho hook deadline.
- Type guards `isAssignment`, `isAssignmentList`, `isApiResponse<T>` kiểm tra dữ liệu từ mock API.
- `satisfies`, union type và `Record` giúp kiểm soát cấu hình bộ lọc, ưu tiên.

### Buổi 2: Design pattern React

- Custom hook `useAssignments` đóng gói Redux, async lifecycle, dữ liệu dẫn xuất và actions.
- Custom hook `useDeadline` tính trạng thái còn hạn, hôm nay, quá hạn hoặc đã nộp.
- Compound Component `AssignmentFilters.Root` và `AssignmentFilters.Item` dùng Context để chia sẻ trạng thái bộ lọc.

### Buổi 3: Redux Toolkit + TypeScript

- Feature-based structure trong `src/features/assignments`.
- Store và typed hooks nằm trong `src/app`.
- `createSlice` quản lý thêm, xoá, hoàn thành và lọc bài tập.
- `createAsyncThunk` gọi mock API khi ứng dụng khởi động.
- Có đủ trạng thái loading, error, empty và success.

## Chức năng

- Xem môn học, tên bài tập, hạn nộp, độ ưu tiên và trạng thái.
- Thêm, xoá, đánh dấu hoàn thành hoặc bỏ hoàn thành.
- Lọc tất cả, cần làm, quá hạn và đã hoàn thành.
- Hiển thị `Còn X ngày`, `Quá hạn Y ngày`, `Nộp hôm nay` hoặc `Đã nộp`.
