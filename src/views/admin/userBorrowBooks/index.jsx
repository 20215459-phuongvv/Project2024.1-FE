import React, { useEffect, useState, useCallback } from "react";
import { Tabs, Card, Row, Col, Typography, Spin } from "antd";
import {
  getAllUserBorrowedBooks,
  getBorrowLimit,
} from "services/borrowBookService"; // Assuming this is the correct API import
import RegisterBorrowBook from "./RegisterBorrowBook";
import BorrowHistory from "./BorrowHistory";

const { Text } = Typography;
const { TabPane } = Tabs;

export default function BorrowBookManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);
  const [borrowLimit, setBorrowLimit] = useState(null); // New state for borrow limit

  // Fetch borrowed books with page and size
  const fetchBorrowedBooks = useCallback(
    async (search = searchTerm, page = currentPage) => {
      setLoading(true);
      try {
        const response = await getAllUserBorrowedBooks(page - 1, limit, search);
        const { data, meta } = response;
        setBorrowedBooks(data);
        setTotalPages(Math.ceil(meta.total / limit));
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách mượn:", error);
      }
      setLoading(false);
    },
    [currentPage, limit, searchTerm]
  );

  // Fetch borrow limit
  const fetchBorrowLimit = useCallback(async () => {
    try {
      const response = await getBorrowLimit();
      const { data } = response;
      setBorrowLimit(data.value); // Set the borrow limit from the API response
    } catch (error) {
      console.error("Lỗi khi lấy giới hạn mượn sách:", error);
    }
  }, []);

  useEffect(() => {
    fetchBorrowedBooks(searchTerm, currentPage);
    fetchBorrowLimit(); // Call the API to get the borrow limit
  }, [fetchBorrowedBooks, currentPage, searchTerm, fetchBorrowLimit]);

  // Handle pagination change
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    fetchBorrowedBooks(searchTerm, page);
  };

  return (
    <div style={{ paddingTop: "80px", width: "100%" }}>
      <Card style={{ width: "100%", padding: "25px" }}>
        <Row
          justify="space-between"
          style={{ marginBottom: "15px", alignItems: "center" }}
        >
          <Text style={{ fontSize: "22px", fontWeight: 700 }}>
            Quản Lý Mượn Sách
          </Text>
          {borrowLimit !== null ? (
            <Text style={{ fontSize: "16px", color: "#595959" }}>
              Giới hạn mượn sách: <strong>{borrowLimit}</strong> sách
            </Text>
          ) : (
            <Spin size="small" />
          )}
        </Row>

        <Tabs defaultActiveKey="1" style={{ width: "100%" }}>
          <TabPane tab="Đăng Ký Mượn Sách" key="1">
            <RegisterBorrowBook fetchBorrowedBooks={fetchBorrowedBooks} />
          </TabPane>
          <TabPane tab="Lịch Sử Mượn" key="2">
            <BorrowHistory
              loading={loading}
              borrowedBooks={borrowedBooks}
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
