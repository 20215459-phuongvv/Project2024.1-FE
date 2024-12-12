import React from "react";
import { Table, Pagination, Spin } from "antd";

const BorrowHistory = ({
  loading,
  borrowedBooks,
  totalPages,
  currentPage,
  handlePageChange,
}) => {
  const columns = [
    {
      title: "Người Mượn",
      dataIndex: "user",
      key: "user",
      render: (text, record) => (
        <span>
          {record.readingCard.user.name} - {record.readingCard.user.phone}
        </span>
      ),
    },
    {
      title: "Tên Sách",
      dataIndex: "title",
      key: "title",
      render: (text, record) => <span>{record.book.title}</span>,
    },
    {
      title: "Tác Giả",
      dataIndex: "book.author.name",
      key: "book.author.name",
      render: (text, record) => <span>{record.book.author.name}</span>,
    },
    {
      title: "Nhà Xuất Bản",
      dataIndex: "book.publisher.name",
      key: "book.publisher.name",
      render: (text, record) => <span>{record.book.publisher.name}</span>,
    },
    {
      title: "Ngày Mượn",
      dataIndex: "borrowDate",
      key: "borrowDate",
      render: (text) => <span>{new Date(text).toLocaleDateString()}</span>,
    },
    {
      title: "Ngày Trả",
      dataIndex: "returnDate",
      key: "returnDate",
      render: (text) => <span>{new Date(text).toLocaleDateString()}</span>,
    },
    {
      title: "Số Ngày Quá Hạn",
      dataIndex: "overDueDays",
      key: "overDueDays",
      render: (overDueDays) =>
        overDueDays !== null ? overDueDays : "Không có",
    },
    {
      title: "Trễ Hạn",
      dataIndex: "isLate",
      key: "isLate",
      render: (isLate) => (
        <span style={{ color: isLate ? "red" : "green", fontWeight: "bold" }}>
          {isLate ? "Trễ" : "Đúng Hạn"}
        </span>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{ color: status === 0 ? "red" : "green", fontWeight: "bold" }}
        >
          {status === 0 ? "Chưa Trả" : "Đã Trả"}
        </span>
      ),
    },
  ];

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <div>
          <Table
            columns={columns}
            dataSource={borrowedBooks}
            pagination={false}
            rowKey="id"
          />
          <Pagination
            current={currentPage}
            total={totalPages * 6} // Assuming 6 items per page
            onChange={handlePageChange}
            style={{ marginTop: "20px", textAlign: "center" }}
          />
        </div>
      )}
    </div>
  );
};

export default BorrowHistory;
