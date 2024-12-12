import {
  Box,
  Flex,
  CircularProgress,
  useDisclosure,
  Button as ChakraButton,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { Table, Pagination, Input, Button, message, Popconfirm } from "antd"; // Import Popconfirm
import React, { useEffect, useState, useCallback } from "react";
import {
  getAllBorrowedBooks,
  returnBorrowedBook,
} from "services/borrowBookService";
import { debounce } from "lodash";
import Card from "components/card/Card";

export default function BorrowBookManagement() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;
  const textColor = useColorModeValue("secondaryGray.900", "white");

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  // Fetch danh sách sách mượn (Borrowed Books)
  const fetchBorrowedBooks = useCallback(
    async (search = searchTerm, page = currentPage) => {
      setLoading(true);
      try {
        const response = await getAllBorrowedBooks(page - 1, limit, search);
        const { data, meta } = response;
        setBorrowedBooks(data);
        setTotalPages(Math.ceil(meta.total / limit));
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách mượn:", error);
      }
      setLoading(false);
    },
    [currentPage, limit]
  );

  // Debounce cho tìm kiếm
  const debouncedFetchBorrowedBooks = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchBorrowedBooks(value, 1);
    }, 800),
    [fetchBorrowedBooks]
  );

  // Fetch danh sách sách mượn khi component mount hoặc khi thay đổi phân trang
  useEffect(() => {
    fetchBorrowedBooks(searchTerm, currentPage);
  }, [fetchBorrowedBooks, currentPage]);

  // Hàm xử lý khi trả sách
  const handleReturnBook = async (id) => {
    try {
      await returnBorrowedBook(id);
      message.success("Trả sách thành công");
      fetchBorrowedBooks(); // Lấy lại danh sách sách sau khi trả
    } catch (error) {
      message.error("Lỗi khi trả sách");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "Người mượn",
      dataIndex: "user", // Truy cập vào book.title
      key: "user",
      render: (text, record) => (
        <span>
          {record.readingCard.user.name} - {record.readingCard.user.phone}
        </span>
      ), // Hiển thị tên sách
    },
    {
      title: "Tên Sách",
      dataIndex: "title", // Truy cập vào book.title
      key: "title",
      render: (text, record) => <span>{record.book.title}</span>, // Hiển thị tên sách
    },
    {
      title: "Tên Tác Giả",
      dataIndex: "book.author.name", // Truy cập vào book.author.name
      key: "book.author.name",
      render: (text, record) => <span>{record.book.author.name}</span>,
    },
    {
      title: "Nhà Xuất Bản",
      dataIndex: "book.publisher.name", // Truy cập vào book.publisher.name
      key: "book.publisher.name",
      render: (text, record) => <span>{record.book.publisher.name}</span>,
    },
    {
      title: "Ngày Mượn",
      dataIndex: "borrowDate", // Truy cập vào borrowDate
      key: "borrowDate",
      render: (text) => <span>{new Date(text).toLocaleDateString()}</span>, // Hiển thị ngày mượn, chuyển đổi sang định dạng ngày dễ đọc
    },
    {
      title: "Ngày Trả",
      dataIndex: "returnDate", // Truy cập vào returnDate
      key: "returnDate",
      render: (text) => <span>{new Date(text).toLocaleDateString()}</span>, // Hiển thị ngày hết hạn, chuyển đổi sang định dạng ngày dễ đọc
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
      dataIndex: "isLate", // Truy cập vào isLate
      key: "isLate",
      render: (isLate) => (
        <span
          style={{
            color: isLate ? "red" : "green", // Nếu trễ thì màu đỏ, nếu đúng hạn thì màu xanh
            fontWeight: "bold",
          }}
        >
          {isLate ? "Trễ" : "Đúng Hạn"}{" "}
        </span>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status", // Truy cập vào isLate
      key: "status",
      render: (status) => (
        <span
          style={{
            color: status === 0 ? "red" : "green", // Nếu trễ thì màu đỏ, nếu đúng hạn thì màu xanh
            fontWeight: "bold",
          }}
        >
          {status === 0 ? "Chưa trả" : "Đã trả"}{" "}
        </span>
      ),
    },
    {
      title: "Thao Tác",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {/* Check if the book is returned (status === 0 means not returned) */}
          {record.status === 0 ? (
            // If the book is not returned, show "Đã Trả Sách" button without onClick
            <Popconfirm
              title="Bạn có chắc chắn người dùng đã trả sách này?"
              onConfirm={() => handleReturnBook(record.id)} // Call handleReturnBook if confirmed
              okText="Có"
              cancelText="Không"
            >
              <Button
                style={{
                  marginLeft: "10px",
                  backgroundColor: "#32CD32",
                  borderColor: "#32CD32",
                  color: "white",
                }}
              >
                Đánh dấu trả sách
              </Button>
            </Popconfirm>
          ) : (
            // If the book has been returned, show "Đánh dấu trả sách" button
            <Button
              style={{
                marginLeft: "10px",
                backgroundColor: "#32CD32",
                borderColor: "#32CD32",
                color: "white",
              }}
            >
              Người dùng đã trả sách
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} w="100%">
      <Card
        direction="column"
        w="100%"
        px="25px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Flex justify="space-between" mb="15px" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Quản Lý Sách Mượn
          </Text>
        </Flex>
        <Flex justifyContent="space-between" mb="20px">
          <Input
            placeholder="Tìm kiếm sách mượn..."
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedFetchBorrowedBooks(e.target.value);
            }}
            style={{ width: "40%" }}
          />
          <ChakraButton colorScheme="brand" onClick={onCreateOpen}>
            Thêm Mới
          </ChakraButton>
        </Flex>

        {loading ? (
          <Flex justifyContent="center" mt="20px">
            <CircularProgress isIndeterminate color="blue.300" />
          </Flex>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={borrowedBooks}
              pagination={false}
              rowKey={(record) => record.id}
              style={{ width: "100%", cursor: "pointer" }}
            />
            <Pagination
              current={currentPage}
              total={totalPages * limit}
              pageSize={limit}
              onChange={handlePageChange}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </>
        )}
      </Card>
    </Box>
  );
}
