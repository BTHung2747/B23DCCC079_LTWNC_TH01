function formatDateAtOffset(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// API giả lập cho bài thực hành, không cần backend hay JSON Server.
export async function fetchAssignmentsMock(): Promise<unknown> {
  await new Promise((resolve) => window.setTimeout(resolve, 650));

  return {
    success: true,
    message: "Tải danh sách bài tập thành công",
    data: [
      {
        id: "assignment-1",
        subject: "Lập trình Web nâng cao",
        title: "Hoàn thiện bài thực hành React Patterns",
        dueDate: formatDateAtOffset(2),
        dueTime: "23:59",
        priority: "high",
        completed: false,
      },
      {
        id: "assignment-2",
        subject: "Cơ sở dữ liệu",
        title: "Thiết kế ERD cho hệ thống thư viện",
        dueDate: formatDateAtOffset(5),
        dueTime: "17:00",
        priority: "medium",
        completed: false,
      },
      {
        id: "assignment-3",
        subject: "Mạng máy tính",
        title: "Báo cáo mô hình OSI",
        dueDate: formatDateAtOffset(-2),
        dueTime: "09:00",
        priority: "high",
        completed: false,
      },
      {
        id: "assignment-4",
        subject: "Phân tích thiết kế hệ thống",
        title: "Vẽ biểu đồ Use Case",
        dueDate: formatDateAtOffset(-1),
        dueTime: "14:30",
        priority: "low",
        completed: true,
      },
      {
        id: "assignment-5",
        subject: "Trí tuệ nhân tạo",
        title: "Xây dựng mô hình phân loại dữ liệu",
        dueDate: formatDateAtOffset(1),
        dueTime: "20:00",
        priority: "high",
        completed: false,
      },
      {
        id: "assignment-6",
        subject: "An toàn thông tin",
        title: "Hoàn thành bài lab mã hóa AES",
        dueDate: formatDateAtOffset(3),
        dueTime: "22:00",
        priority: "medium",
        completed: false,
      },
      {
        id: "assignment-7",
        subject: "Kỹ thuật phần mềm",
        title: "Viết đặc tả User Story cho Sprint 1",
        dueDate: formatDateAtOffset(4),
        dueTime: "18:00",
        priority: "medium",
        completed: false,
      },
      {
        id: "assignment-8",
        subject: "Lập trình di động",
        title: "Hoàn thiện màn hình đăng nhập",
        dueDate: formatDateAtOffset(7),
        dueTime: "23:00",
        priority: "high",
        completed: false,
      },
      {
        id: "assignment-9",
        subject: "Hệ điều hành",
        title: "Bài tập lập lịch CPU",
        dueDate: formatDateAtOffset(9),
        dueTime: "16:30",
        priority: "low",
        completed: false,
      },
      {
        id: "assignment-10",
        subject: "Toán rời rạc",
        title: "Ôn tập quan hệ và lý thuyết đồ thị",
        dueDate: formatDateAtOffset(-4),
        dueTime: "19:30",
        priority: "low",
        completed: true,
      },
    ],
  };
}
