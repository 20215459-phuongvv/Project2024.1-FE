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
import { getAllPublishers, deletePublisher } from "services/publisherService"; // Sử dụng publisherService thay cho authorService
import { debounce } from "lodash";
import { message } from "antd";
import Card from "components/card/Card";
import EditPublisherModal from "./components/EditPublisherModal"; // Modal chỉnh sửa nhà xuất bản
import CreatePublisherModal from "./components/CreatePublisherModal"; // Modal tạo nhà xuất bản

export default function PublisherManagement() {
  const [publishers, setPublishers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editPublisherData, setEditPublisherData] = useState(null);
  const [selectedPublishers, setSelectedPublishers] = useState([]);
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

  const fetchPublishers = useCallback(
    async (search = searchTerm, page = currentPage) => {
      setLoading(true);
      try {
        const response = await getAllPublishers(page - 1, limit, search);
        const { data, meta } = response;
        setPublishers(data);
        setTotalPages(Math.ceil(meta.total / limit));
      } catch (error) {
        console.error("Lỗi khi lấy thông tin nhà xuất bản:", error);
      }
      setLoading(false);
    },
    [currentPage, limit]
  );

  const debouncedFetchPublishers = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchPublishers(value, 1);
    }, 800),
    [fetchPublishers]
  );

  useEffect(() => {
    fetchPublishers(searchTerm, currentPage);
  }, [fetchPublishers, currentPage]);

  const confirmDeletePublishers = async () => {
    if (selectedPublishers.length === 0) {
      message.error("Vui lòng chọn nhà xuất bản để khóa.");
      return;
    }

    try {
      await deletePublisher(selectedPublishers);
      message.success("Khóa nhà xuất bản thành công.");
      fetchPublishers();
    } catch (error) {
      message.error("Lỗi khi khóa nhà xuất bản.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditClick = (record) => {
    setEditPublisherData(record);
    onEditOpen();
  };

  const columns = [
    {
      title: "Tên Nhà Xuất Bản",
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
      title: "Hành Động",
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
            title="Bạn có chắc chắn muốn khóa nhà xuất bản này?"
            onConfirm={(e) => {
              e.stopPropagation();
              confirmDeletePublishers();
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
            Quản Lý Nhà Xuất Bản
          </Text>
        </Flex>
        <Flex justifyContent="space-between" mb="20px">
          <Input
            placeholder="Tìm kiếm nhà xuất bản..."
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedFetchPublishers(e.target.value);
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
              dataSource={publishers}
              pagination={false}
              rowKey={(record) => record.id}
              style={{ width: "100%", cursor: "pointer" }}
              rowSelection={{
                type: "checkbox",
                onChange: (selectedRowKeys) => {
                  setSelectedPublishers(selectedRowKeys);
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
            <CreatePublisherModal
              isOpen={isCreateOpen}
              onClose={onCreateClose}
              fetchPublishers={fetchPublishers}
            />

            {editPublisherData && (
              <EditPublisherModal
                isOpen={isEditOpen}
                onClose={onEditClose}
                publisher={editPublisherData}
                fetchPublishers={fetchPublishers}
              />
            )}
          </>
        )}
      </Card>
    </Box>
  );
}
