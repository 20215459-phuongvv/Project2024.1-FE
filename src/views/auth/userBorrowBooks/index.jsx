import React, { useEffect, useState, useCallback } from "react";
import { Tabs, Card, Row, Col, Typography, message, Layout, Button, Modal, Form, Input } from "antd";
import { useHistory } from "react-router-dom"; // To handle navigation
import {
  getAllUserBorrowedBooks,
  getBorrowLimit,
} from "services/borrowBookService"; // Assuming this is the correct API import
import RegisterBorrowBook from "./RegisterBorrowBook";

const { Text } = Typography;
const { TabPane } = Tabs;
const { Header, Content } = Layout;

export default function BorrowBookManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);
  const [isModalVisible, setIsModalVisible] = useState(false);  // State to control modal visibility
  const [form] = Form.useForm(); // For the login form
  const history = useHistory();  // To handle navigation

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

  const handleLogin = async (values) => {
    // Handle login logic here
    console.log("Logging in with values:", values);
    // Close the modal after successful login (For demo purposes, we are just closing it)
    setIsModalVisible(false);
    // Optionally, you can store the user info in localStorage or state
    localStorage.setItem("user", JSON.stringify(values.username));  // Store username as example
    message.success("Đăng nhập thành công!");
  };

  const showModal = () => {

    history.push("/auth/sign-in");
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <Layout>
        <Header style={{ background: "#ffffff", padding: "0 20px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
          <Row justify="space-between" align="middle" style={{ height: "100%" }}>
            <Col>
              <Typography.Title style={{ color: "#1890ff", margin: 0, fontSize: "24px" }}>
                Thư Viện ABC
              </Typography.Title>
            </Col>
            <Col>
              {/* Login button to show modal */}
              <Button
                type="primary"
                onClick={showModal}
                style={{ height: "40px" }}
              >
                Đăng Nhập
              </Button>
            </Col>
          </Row>
        </Header>

        <Content>
          <Card style={{ width: "100%", padding: "25px" }}>
            <Row justify="space-between" style={{ marginBottom: "15px", alignItems: "center" }}>
              <Text style={{ fontSize: "22px", fontWeight: 700 }}>
                Danh Sách Sách Mượn
              </Text>
            </Row>

            <RegisterBorrowBook fetchBorrowedBooks={fetchBorrowedBooks} />
          </Card>
        </Content>
      </Layout>
    </div>
  );
}
