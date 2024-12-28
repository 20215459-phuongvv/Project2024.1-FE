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
  Popconfirm,
  Pagination,
  Input,
  Select,
  Button,
  Tag,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { getAllBooks, deleteBooks } from "services/bookService";
import { debounce } from "lodash";
import { message } from "antd";
import Card from "components/card/Card";
import EditBookModal from "./components/EditBookModal";
import CreateBookModal from "./components/CreateBookModal";
import { getAllAuthors } from "services/authorService";
import { getAllPublishers } from "services/publisherService";

export default function BookManagement() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editBookData, setEditBookData] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState(null);
  const [selectedPublisherId, setSelectedPublisherId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);
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

  const fetchBooks = useCallback(
    async (
      search = searchTerm,
      page = currentPage,
      authorId = selectedAuthorId,
      publisherId = selectedPublisherId,
      status = selectedStatus
    ) => {
      setLoading(true);
      try {
        const response = await getAllBooks(
          page - 1,
          limit,
          search,
          authorId,
          publisherId,
          status
        );
        const { data, meta } = response;
        setBooks(data);
        setTotalPages(Math.ceil(meta.total / limit));
      } catch (error) {
        console.error("Lỗi khi lấy sách:", error);
      }
      setLoading(false);
    },
    [currentPage, limit, selectedAuthorId, selectedPublisherId, selectedStatus]
  );

  const debouncedFetchBooks = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchBooks(value, 1);
    }, 800),
    [fetchBooks]
  );

  useEffect(() => {
    const fetchAuthorsAndPublishers = async () => {
      try {
        const authorsResponse = await getAllAuthors(0, 1000);
        const publishersResponse = await getAllPublishers(0, 1000);

        setAuthors(authorsResponse.data);
        setPublishers(publishersResponse.data);
      } catch (error) {
        console.error("Error fetching authors or publishers:", error);
      }
    };

    fetchAuthorsAndPublishers();
  }, []);

  useEffect(() => {
    fetchBooks(searchTerm, currentPage, selectedAuthorId, selectedPublisherId, selectedStatus);
  }, [fetchBooks, currentPage, selectedAuthorId, selectedPublisherId, selectedStatus]);

  const confirmDeleteBooks = async () => {
    if (selectedBooks.length === 0) {
      message.error("Vui lòng chọn sách để xóa.");
      return;
    }

    try {
      await deleteBooks(selectedBooks);
      message.success("Xóa sách thành công.");
      fetchBooks();
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi xóa sách.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditClick = (record) => {
    setEditBookData(record);
    onEditOpen();
  };

  const columns = [
    {
      title: "Hình Ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail) => (
        <img
          src={
            thumbnail || "https://i.pinimg.com/originals/66/8a/8c/668a8cccacc792924fa588b4adca8f68.gif"
          }
          alt="Book Thumbnail"
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            borderRadius: "5px",
            boxShadow: "0 0 5px rgba(0,0,0,0.1)",
          }}
        />
      ),
    },
    {
      title: "Tên Sách",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Tác Giả",
      dataIndex: "author",
      key: "author",
      render: (author) => author?.name,
    },
    {
      title: "Nhà Xuất Bản",
      dataIndex: "publisher",
      key: "publisher",
      render: (publisher) => publisher?.name,
    },
    {
      title: "Loại sách",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === 0 ? "default" : "gold"}>
          {type === 0 ? "Sách Thường" : "Sách Đặc Biệt"}
        </Tag>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "isAvailable",
      key: "isAvailable",
      render: (isAvailable) => (
        <span
          style={{ color: isAvailable ? "green" : "red", fontWeight: "bold" }}
        >
          {isAvailable ? "Còn Sách" : "Hết Sách"}
        </span>
      ),
    },
    {
      title: "Ẩn/Hiện",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{ color: status === 1 ? "green" : "red", fontWeight: "bold" }}
        >
          {status === 1 ? "Hiện" : "Ẩn"}
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
            title="Bạn có chắc muốn xóa sách này không?"
            onConfirm={(e) => {
              e.stopPropagation();
              confirmDeleteBooks();
            }}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="danger"
              style={{ marginLeft: "10px" }}
              onClick={(e) => e.stopPropagation()}
            >
              Xóa
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
            Quản Lý Sách
          </Text>
        </Flex>
        <Flex justifyContent="space-between" mb="20px">
          <Input
            placeholder="Tìm kiếm sách..."
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedFetchBooks(e.target.value);
            }}
            style={{ width: "20%" }}
          />
          <Select
            placeholder="Chọn Tác Giả"
            value={selectedAuthorId}
            allowClear
            onChange={(value) => {
              setSelectedAuthorId(value);
              fetchBooks(searchTerm, currentPage, value, selectedPublisherId, selectedStatus);
            }}
            style={{ width: "20%", marginLeft: "10px", height: "40px" }}
          >
            {authors.map((author) => (
              <Select.Option key={author.id} value={author.id}>
                {author.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="Chọn Nhà Xuất Bản"
            value={selectedPublisherId}
            allowClear
            onChange={(value) => {
              setSelectedPublisherId(value);
              fetchBooks(searchTerm, currentPage, selectedAuthorId, value, selectedStatus);
            }}
            style={{ width: "20%", marginLeft: "10px", height: "40px" }}
          >
            {publishers.map((publisher) => (
              <Select.Option key={publisher.id} value={publisher.id}>
                {publisher.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="Trạng thái"
            value={selectedStatus} 
            allowClear
            onChange={(value) => {
              setSelectedStatus(value);
              fetchBooks(searchTerm, currentPage, selectedAuthorId, selectedPublisherId, value);
            }}
            style={{ width: "20%", marginLeft: "10px", height: "40px" }}
          >
            <Select.Option key="1" value={1}>
              Hiện
            </Select.Option>
            <Select.Option key="0" value={0}>
              Ẩn
            </Select.Option>
          </Select>
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
              dataSource={books}
              pagination={false}
              rowKey={(record) => record.id}
              style={{ width: "100%", cursor: "pointer" }}
              rowSelection={{
                type: "checkbox",
                onChange: (selectedRowKeys) => {
                  setSelectedBooks(selectedRowKeys);
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
            <CreateBookModal
              isOpen={isCreateOpen}
              onClose={onCreateClose}
              fetchBooks={fetchBooks}
              authors={authors}
              publishers={publishers}
            />
            {editBookData && (
              <EditBookModal
                isOpen={isEditOpen}
                onClose={onEditClose}
                book={editBookData}
                fetchBooks={fetchBooks}
                authors={authors}
                publishers={publishers}
              />
            )}
          </>
        )}
      </Card>
    </Box>
  );
}
