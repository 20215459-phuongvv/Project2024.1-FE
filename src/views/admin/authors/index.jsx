import {
  Box,
  Flex,
  CircularProgress,
  useDisclosure,
  Button as ChakraButton,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { Table, Popconfirm, Pagination, Input, Select, Button } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { getAllAuthors, deleteAuthor } from "services/authorService"; // Thay vì bookService, sử dụng authorService
import { debounce } from "lodash";
import { message } from "antd";
import Card from "components/card/Card";
import EditAuthorModal from "./components/EditAuthorModal"; // Modal chỉnh sửa tác giả
import CreateAuthorModal from "./components/CreateAuthorModal"; // Modal tạo tác giả

export default function AuthorManagement() {
  const [authors, setAuthors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editAuthorData, setEditAuthorData] = useState(null);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const limit = 5;
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

  const fetchAuthors = useCallback(
    async (search = searchTerm, page = currentPage) => {
      setLoading(true);
      try {
        const response = await getAllAuthors(page - 1, limit, search);
        const { data, meta } = response;
        setAuthors(data);
        setTotalPages(Math.ceil(meta.total / limit));
      } catch (error) {
        console.error("Lỗi khi lấy tác giả:", error);
      }
      setLoading(false);
    },
    [currentPage, limit]
  );

  const debouncedFetchAuthors = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchAuthors(value, 1);
    }, 800),
    [fetchAuthors]
  );

  useEffect(() => {
    fetchAuthors(searchTerm, currentPage);
  }, [fetchAuthors, currentPage]);

  const confirmDeleteAuthors = async () => {
    if (selectedAuthors.length === 0) {
      message.error("Vui lòng chọn tác giả để khóa.");
      return;
    }

    try {
      await deleteAuthor(selectedAuthors);
      message.success("Khóa tác giả thành công.");
      fetchAuthors();
    } catch (error) {
      message.error("Lỗi khi khóa tác giả.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditClick = (record) => {
    setEditAuthorData(record);
    onEditOpen();
  };

  const columns = [
    {
      title: "Tên Tác Giả",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{ color: status === 1 ? "green" : "red", fontWeight: "bold" }}
        >
          {status === 1 ? "Hoạt Động" : "Ngừng Hoạt Động"}
        </span>
      ),
    },
    {
      title: "Thao Tác",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            style={{
              backgroundColor: "#FF8000",
              borderColor: "#FF8000",
              color: "white",
            }}
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(record);
            }}
          >
            Chỉnh Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc muốn khóa tác giả này không?"
            onConfirm={(e) => {
              e.stopPropagation();
              confirmDeleteAuthors();
            }}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="danger"
              style={{ marginLeft: "10px" }}
              onClick={(e) => e.stopPropagation()}
            >
              Khóa
            </Button>
          </Popconfirm>
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
            Quản Lý Tác Giả
          </Text>
        </Flex>
        <Flex justifyContent="space-between" mb="20px">
          <Input
            placeholder="Tìm kiếm tác giả..."
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedFetchAuthors(e.target.value);
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
              dataSource={authors}
              pagination={false}
              rowKey={(record) => record.id}
              style={{ width: "100%", cursor: "pointer" }}
              rowSelection={{
                type: "checkbox",
                onChange: (selectedRowKeys) => {
                  setSelectedAuthors(selectedRowKeys);
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
            <CreateAuthorModal
              isOpen={isCreateOpen}
              onClose={onCreateClose}
              fetchAuthors={fetchAuthors}
            />

            {editAuthorData && (
              <EditAuthorModal
                isOpen={isEditOpen}
                onClose={onEditClose}
                author={editAuthorData}
                fetchAuthors={fetchAuthors}
              />
            )}
          </>
        )}
      </Card>
    </Box>
  );
}
