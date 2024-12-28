import React, { useState, useEffect, useCallback } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Card,
  message,
  Spin,
  Pagination,
  Select,
  Modal,
  Descriptions,
} from "antd";
import { getAllBooks, addBorrowBookForUser } from "services/userService";
import { debounce } from "lodash";
import { getAllAuthors } from "services/authorService";
import { getAllPublishers } from "services/publisherService";
import { subscribeToBook, unSubscribeToBook } from "services/bookService";

const RegisterBorrowBook = ({ fetchBorrowedBooks }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowModalVisible, setBorrowModalVisible] = useState(false); // For borrow book modal
  const [modalVisible, setModalVisible] = useState(false); // For book detail modal
  const [borrowDays, setBorrowDays] = useState(15); // Default 15 days
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState(null);
  const [selectedPublisherId, setSelectedPublisherId] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [selectedIsSubscribe, setSelectedIsSubscribe] = useState(null);
  const pageSize = 8;

  // Fetch authors and publishers on initial load
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

  // Debounced function for search input change
  const debouncedFetchBooks = useCallback(
    debounce((search) => {
      setCurrentPage(1);
      fetchBooks(search);
    }, 800),
    []
  );

  // Fetch books
  const fetchBooks = async (
    search = searchQuery,
    authorId = selectedAuthorId,
    publisherId = selectedPublisherId,
    isAvailable = selectedAvailability,
    isSubscribe = selectedIsSubscribe
  ) => {
    setLoading(true);
    try {
      const response = await getAllBooks(
        currentPage - 1,
        pageSize,
        search,
        authorId,
        publisherId,
        isAvailable,
        isSubscribe
      );
      setBooks(response.data);
      setTotalBooks(response.meta.total);
    } catch (error) {
      console.error("Error fetching books:", error);
      message.error(error.response?.data?.message || "Lỗi khi tải sách");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, [
    currentPage,
    selectedAuthorId,
    selectedPublisherId,
    selectedAvailability,
    selectedIsSubscribe,
  ]);

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setModalVisible(true);
  };

  const handleBorrowBook = async () => {
    if (borrowDays < 1 || borrowDays > 45) {
      message.error("Số ngày mượn phải nằm trong khoảng từ 1 đến 45!");
      return;
    }

    try {
      const response = await addBorrowBookForUser(selectedBook.id, borrowDays);
      if (response) {
        message.success(response.message);
        setSelectedBook(null);
        setBorrowModalVisible(false); // Close borrow modal
        fetchBorrowedBooks();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi mượn sách");
    }
  };

  const handleSubscribe = async (bookId) => {
    try {
      const response = await subscribeToBook(bookId);
      message.success(response.message);
      fetchBooks();
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi đăng ký nhận thông báo.");
    }
  };

  const handleUnsubscribe = async (bookId) => {
    try {
      const response = await unSubscribeToBook(bookId);
      message.success(response.message);
      fetchBooks();
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi hủy đăng ký nhận thông báo.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    debouncedFetchBooks(e.target.value);
  };

  const openBorrowModal = (book) => {
    setSelectedBook(book);
    setBorrowModalVisible(true);
  };

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          {/* Tìm kiếm và lọc */}
          <Row justify="space-between" style={{ marginBottom: "30px" }}>
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              allowClear
              placeholder="Tìm kiếm sách..."
              style={{ width: "18%", height: "40px" }}
            />
            <Select
              placeholder="Chọn Tác Giả"
              value={selectedAuthorId}
              allowClear
              onChange={(value) => {
                setSelectedAuthorId(value);
                fetchBooks(
                  searchQuery,
                  value,
                  selectedPublisherId,
                  selectedAvailability
                );
              }}
              style={{ width: "18%", height: "40px" }}
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
                fetchBooks(
                  searchQuery,
                  selectedAuthorId,
                  value,
                  selectedAvailability
                );
              }}
              style={{ width: "18%", height: "40px" }}
            >
              {publishers.map((publisher) => (
                <Select.Option key={publisher.id} value={publisher.id}>
                  {publisher.name}
                </Select.Option>
              ))}
            </Select>
            <Select
              placeholder="Trạng thái sách"
              value={selectedAvailability}
              allowClear
              onChange={(value) => {
                setSelectedAvailability(value);
                fetchBooks(
                  searchQuery,
                  selectedAuthorId,
                  selectedPublisherId,
                  value
                );
              }}
              style={{ width: "18%", height: "40px" }}
            >
              <Select.Option value={1}>Còn Sách</Select.Option>
              <Select.Option value={0}>Hết Sách</Select.Option>
            </Select>
            <Select
              placeholder="Trạng thái đăng ký"
              value={selectedIsSubscribe}
              allowClear
              onChange={(value) => {
                setSelectedIsSubscribe(value);
                fetchBooks(
                  searchQuery,
                  selectedAuthorId,
                  selectedPublisherId,
                  selectedAvailability,
                  value
                );
              }}
              style={{ width: "18%", height: "40px" }}
            >
              <Select.Option value={1}>Đã Đăng Ký</Select.Option>
              <Select.Option value={0}>Chưa Đăng Ký</Select.Option>
            </Select>

          </Row>

          {/* Danh sách sách */}
          <Row gutter={[16, 16]}>
            {books.map((book) => (
              <Col span={6} key={book.id}>
                <Card
                  hoverable={book.isAvailable} // Disable hover if book is not available
                  style={{
                    border: selectedBook?.id === book.id ? "2px solid blue" : "",
                    cursor: book.isAvailable ? "pointer" : "not-allowed", // Disable pointer if book is not available
                    opacity: book.isAvailable ? 1 : 0.5, // Dim card if book is not available
                  }}
                  cover={
                    <img
                      alt={book.title}
                      src={
                        book.thumbnail ||
                        "https://i.pinimg.com/originals/66/8a/8c/668a8cccacc792924fa588b4adca8f68.gif"
                      }
                      style={{
                        width: "100%",
                        height: "300px",
                        objectFit: "cover",
                      }}
                    />
                  }
                >
                  <Card.Meta
                    onClick={() => handleBookSelect(book)} // Only allow click if book is available
                    title={book.title}
                    description={
                      <>
                        <div><strong>Tác giả:</strong> {book.author?.name}</div>
                        <div><strong>Nhà xuất bản:</strong> {book.publisher?.name}</div>
                        <div>
                          <strong>Trạng thái:</strong>{" "}
                          {book.isAvailable ? (
                            <span style={{ color: "green", fontWeight: "bold" }}>Còn sách</span>
                          ) : (
                            <span style={{ color: "red", fontWeight: "bold" }}>Hết sách</span>
                          )}
                        </div>
                      </>
                    }
                  />
                  <div style={{ marginTop: "10px", textAlign: "center" }}>
                    <Button
                      type="primary"
                      onClick={book.isAvailable ? () => openBorrowModal(book) : null}
                      disabled={!book.isAvailable} // Disable button if book is not available
                      style={{ marginRight: "10px", marginBottom: "10px", width: "100%" }}

                    >
                      Mượn Sách
                    </Button>
                    {book.isSubscribe ? (
                      <Button
                        type="default"
                        style={{ color: "red", width: "100%"  }}
                        onClick={() => handleUnsubscribe(book.id)}
                      >
                        Hủy đăng ký
                      </Button>
                    ) : (
                      <Button
                        type="default"
                        style={{ color: "green", width: "100%"  }}
                        onClick={() => handleSubscribe(book.id)}
                      >
                        Đăng ký nhận tin
                      </Button>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>


          {/* Modal Chi tiết sách */}
          {selectedBook && (
            <Modal
              visible={modalVisible}
              title={<h2 style={{ textAlign: "center" }}>Chi tiết sách</h2>}
              onCancel={() => setModalVisible(false)}
              footer={[
                <Button
                  key="close"
                  onClick={() => setModalVisible(false)}
                  style={{
                    background: "#ccc",
                    color: "#333",
                    borderRadius: "5px",
                    padding: "10px 20px",
                  }}
                >
                  Đóng
                </Button>,
              ]}
              centered
              width={800} // Tăng chiều rộng của Modal
            >
              <Row gutter={[16, 16]} align="middle">
                {/* Hình ảnh sách */}
                <Col span={8}>
                  <img
                    src={
                      selectedBook.thumbnail ||
                      "https://i.pinimg.com/originals/66/8a/8c/668a8cccacc792924fa588b4adca8f68.gif" // Hình ảnh mặc định
                    }
                    alt={selectedBook.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                      borderRadius: "5px",
                      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                    }}
                  />
                </Col>

                {/* Thông tin sách */}
                <Col span={16}>
                  <Descriptions bordered size="small" column={1}>
                    <Descriptions.Item label="Tên sách">
                      {selectedBook.title}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tác giả">
                      {selectedBook.author?.name || "Không rõ"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Nhà xuất bản">
                      {selectedBook.publisher?.name || "Không rõ"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                      {selectedBook.isAvailable ? (
                        <span style={{ color: "green" }}>Còn sách</span>
                      ) : (
                        <span style={{ color: "red" }}>Hết sách</span>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Loại sách">
                      {selectedBook.type === 0 ? "Văn học" : "Khác"}
                    </Descriptions.Item>
                    {/* <Descriptions.Item label="Trạng thái kích hoạt">
                      {selectedBook.status === 1 ? "Kích hoạt" : "Ngừng hoạt động"}
                    </Descriptions.Item> */}
                    <Descriptions.Item label="Ngày cập nhật">
                      {selectedBook.updatedAt
                        ? new Date(selectedBook.updatedAt).toLocaleDateString()
                        : "Chưa cập nhật"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Cập nhật bởi">
                      {selectedBook.updatedBy || "Không rõ"}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </Modal>
          )}



          {/* Modal Mượn sách */}
          {selectedBook && (
            <Modal
              visible={borrowModalVisible}
              title="Mượn Sách"
              onCancel={() => setBorrowModalVisible(false)}
              footer={[
                <Button
                  key="confirm"
                  type="primary"
                  onClick={handleBorrowBook}
                >
                  Xác nhận mượn sách
                </Button>,
                <Button
                  key="close"
                  onClick={() => setBorrowModalVisible(false)}
                >
                  Đóng
                </Button>,
              ]}
            >
              <p style={{ marginBottom: 10 }}>
                <strong>Bạn đang mượn:</strong> {selectedBook.title}
              </p>
              <Input
                type="number"
                min={1}
                max={45}
                value={borrowDays}
                onChange={(e) => setBorrowDays(e.target.value)}
                placeholder="Nhập số ngày mượn (1 - 45)"
              />
            </Modal>
          )}

          {/* Phân trang */}
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalBooks}
            onChange={handlePageChange}
            style={{ marginTop: "20px", textAlign: "center" }}
          />
        </>
      )}
    </div>
  );
};

export default RegisterBorrowBook;
