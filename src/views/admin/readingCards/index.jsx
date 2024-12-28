import {
  Box,
  Flex,
  CircularProgress,
  useDisclosure,
  Button as ChakraButton,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { Table, Popconfirm, Pagination, Input, Button } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import {
  getReadingCards,
  warnReadingCard,
  banReadingCard,
  unbanReadingCard,
} from "services/readingCardService";
import { debounce } from "lodash";
import { message } from "antd";
import Card from "components/card/Card";

export default function ReadingCardManagement() {
  const [readingCards, setReadingCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editReadingCardData, setEditReadingCardData] = useState(null);
  const [selectedReadingCards, setSelectedReadingCards] = useState([]);
  const limit = 10;
  const textColor = useColorModeValue("secondaryGray.900", "white");

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  // Fetch thẻ đọc (Reading Cards)
  const fetchReadingCards = useCallback(
    async (search = searchTerm, page = currentPage) => {
      setLoading(true);
      try {
        const response = await getReadingCards(page - 1, limit, search);
        const { data, meta } = response;
        setReadingCards(data);
        setTotalPages(Math.ceil(meta.total / limit));
      } catch (error) {
        console.error("Lỗi khi lấy thẻ đọc:", error);
      }
      setLoading(false);
    },
    [currentPage, limit]
  );

  // Debounce cho tìm kiếm
  const debouncedFetchReadingCards = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchReadingCards(value, 1);
    }, 800),
    [fetchReadingCards]
  );

  // Fetch thẻ đọc khi component mount
  useEffect(() => {
    fetchReadingCards(searchTerm, currentPage);
  }, [fetchReadingCards, currentPage]);

  // Các hành động như Cảnh Báo, Cấm và Mở Khóa thẻ đọc
  const handleWarn = async (id) => {
    try {
      await warnReadingCard(id);
      message.success("Cảnh báo thẻ đọc thành công");
      fetchReadingCards();
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi cảnh báo thẻ đọc");
    }
  };

  const handleBan = async (id) => {
    try {
      await banReadingCard(id);
      message.success("Cấm thẻ đọc thành công");
      fetchReadingCards();
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi cấm thẻ đọc");
    }
  };

  const handleUnban = async (id) => {
    try {
      await unbanReadingCard(id);
      message.success("Mở khóa thẻ đọc thành công");
      fetchReadingCards();
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi mở khóa thẻ đọc");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditClick = (record) => {
    setEditReadingCardData(record);
    onEditOpen();
  };

  const columns = [
    {
      title: "Mã Thẻ Đọc",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "Ngày Hết Hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{ color: status === 1 ? "green" : "red", fontWeight: "bold" }}
        >
          {status === 1 ? "Hoạt Động" : "Đã Cấm"}
        </span>
      ),
    },
    {
      title: "Tên Người Dùng",
      key: "userName",
      render: (text, record) =>
        record.user ? record.user.name : "Không có tên", // Kiểm tra nếu có đối tượng user
    },
    {
      title: "Email Người Dùng",
      key: "userEmail",
      render: (text, record) =>
        record.user ? record.user.email : "Không có email", // Kiểm tra nếu có đối tượng user
    },
    {
      title: "Số điện thoại",
      key: "phone",
      render: (text, record) =>
        record.user ? record.user.phone : "Không có số điện thoại", // Kiểm tra nếu có đối tượng user
    },
    {
      title: "Số Lần Vi Phạm",
      dataIndex: "violationCount",
      key: "violationCount",
      render: (violationCount) => (violationCount ? violationCount : "0"),
    },
    {
      title: "Thao Tác",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            style={{
              marginLeft: "10px",
              backgroundColor: "#FF6347",
              borderColor: "#FF6347",
              color: "white",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleWarn(record.id);
            }}
          >
            Cảnh Báo
          </Button>

          <Button
            style={{
              marginLeft: "10px",
              backgroundColor: "#FF4500",
              borderColor: "#FF4500",
              color: "white",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleBan(record.id);
            }}
          >
            Cấm
          </Button>

          <Button
            style={{
              marginLeft: "10px",
              backgroundColor: "#32CD32",
              borderColor: "#32CD32",
              color: "white",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleUnban(record.id);
            }}
          >
            Mở Khóa
          </Button>
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
            Quản Lý Thẻ Đọc
          </Text>
        </Flex>
        <Flex justifyContent="space-between" mb="20px">
          <Input
            placeholder="Tìm kiếm thẻ đọc..."
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedFetchReadingCards(e.target.value);
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
              dataSource={readingCards}
              pagination={false}
              rowKey={(record) => record.id}
              style={{ width: "100%", cursor: "pointer" }}
              rowSelection={{
                type: "checkbox",
                onChange: (selectedRowKeys) => {
                  setSelectedReadingCards(selectedRowKeys);
                },
              }}
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
