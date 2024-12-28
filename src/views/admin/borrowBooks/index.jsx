import {
  Box,
  Flex,
  CircularProgress,
  useDisclosure,
  Button as ChakraButton,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import {
  Table,
  Pagination,
  Input,
  Button,
  message,
  Popconfirm,
  Select,
} from "antd"; // Import Popconfirm
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
  const [searchParams, setSearchParams] = useState({
    search: "",
    status: null,
    isLate: null,
    bookName: "",
    userEmail: "",
  });
  const limit = 10;
  const textColor = useColorModeValue("secondaryGray.900", "white");

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  // Fetch borrowed books based on search parameters
  const fetchBorrowedBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllBorrowedBooks(
        currentPage - 1,
        limit,
        searchParams
      );
      const { data, meta } = response;
      setBorrowedBooks(data);
      setTotalPages(Math.ceil(meta.total / limit));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sách mượn:", error);
    }
    setLoading(false);
  }, [currentPage, searchParams]);

  // Debounce search input to optimize API requests
  const debouncedFetchBorrowedBooks = useCallback(
    debounce(() => fetchBorrowedBooks(), 800),
    [fetchBorrowedBooks]
  );

  // Fetch borrowed books when component mounts or searchParams/state changes
  useEffect(() => {
    fetchBorrowedBooks();
  }, [fetchBorrowedBooks, currentPage]);

  const handleSearchParamChange = (key, value) => {
    setSearchParams((prevParams) => {
      const updatedParams = { ...prevParams, [key]: value };
      return updatedParams;
    });
  };

  // Handle returning borrowed book
  const handleReturnBook = async (id) => {
    try {
      await returnBorrowedBook(id);
      message.success("Trả sách thành công");
      fetchBorrowedBooks(); // Lấy lại danh sách sau khi trả sách
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi trả sách");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "Người Mượn",
      dataIndex: "user",
      key: "user",
      render: (text, record) => (
        <span>
          {record.readingCard.user.name} - {record.readingCard.user.email}
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
      title: "Trạng Thái Trễ Hạn",
      dataIndex: "isLate",
      key: "isLate",
      render: (isLate) => (
        <span style={{ color: isLate ? "red" : "green", fontWeight: "bold" }}>
          {isLate ? "Trễ Hạn" : "Đúng Hạn"}
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
    {
      title: "Thao Tác",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {record.status === 0 ? (
            <Popconfirm
              title="Bạn có chắc chắn sách này đã được trả?"
              onConfirm={() => handleReturnBook(record.id)}
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
                Đánh Dấu Đã Trả
              </Button>
            </Popconfirm>
          ) : (
            <Button
              style={{
                marginLeft: "10px",
                backgroundColor: "#32CD32",
                borderColor: "#32CD32",
                color: "white",
              }}
            >
              Sách Đã Trả
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
            placeholder="Tên Sách"
            allowClear
            value={searchParams.bookName}
            onChange={(e) =>
              handleSearchParamChange("bookName", e.target.value)
            }
            style={{ width: "25%", marginRight: "10px", height: "40px" }}
          />
          <Input
            placeholder="Email Người Mượn"
            allowClear
            value={searchParams.userEmail}
            onChange={(e) =>
              handleSearchParamChange("userEmail", e.target.value)
            }
            style={{ width: "25%", marginRight: "10px", height: "40px" }}
          />
          <Select
            placeholder="Chọn Trạng Thái"
            value={searchParams.status}
            onChange={(value) => handleSearchParamChange("status", value)}
            style={{ width: "25%", marginRight: "10px", height: "40px" }}
            allowClear
          >
            <Select.Option value={0}>Chưa Trả</Select.Option>
            <Select.Option value={1}>Đã Trả</Select.Option>
          </Select>
          <Select
            placeholder="Chọn Trạng Thái Trễ Hạn"
            value={searchParams.isLate}
            onChange={(value) => handleSearchParamChange("isLate", value)}
            style={{ width: "25%", height: "40px" }}
            allowClear
          >
            <Select.Option value={true}>Trễ</Select.Option>
            <Select.Option value={false}>Đúng Hạn</Select.Option>
          </Select>
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
