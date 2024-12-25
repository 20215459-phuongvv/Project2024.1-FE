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
  const [borrowDays, setBorrowDays] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState(null);
  const [selectedPublisherId, setSelectedPublisherId] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState(null); // Added availability filter state
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

  // Function to fetch books based on the current page, search query, author, publisher filters, and availability
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
      message.error("Lỗi khi tải sách");
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
  ]); // Fetch books when currentPage, author, publisher, or availability filters change

  const handleBookSelect = (book) => {
    if (book.isAvailable) {
      setSelectedBook(book);
    }
  };

  const handleBorrowBook = async () => {
    if (!selectedBook) {
      message.error("Vui lòng chọn một sách để mượn!");
      return;
    }
    if (borrowDays < 1 || borrowDays > 45) {
      message.error("Số ngày mượn phải nằm trong khoảng từ 1 đến 45!");
      return;
    }

    try {
      const response = await addBorrowBookForUser(selectedBook.id, borrowDays);
      if (response) {
        message.success("Mượn sách thành công!");
        setSelectedBook(null);
        setBorrowDays(15);
        fetchBorrowedBooks();
      }
    } catch (error) {
      message.error("Lỗi khi mượn sách");
    }
  };
  const handleSubscribe = async (bookId) => {
    try {
      await subscribeToBook(bookId);
      message.success("Đăng ký nhận thông báo thành công!");
      fetchBooks();
    } catch (error) {
      message.error("Lỗi khi đăng ký nhận thông báo.");
    }
  };

  const handleUnsubscribe = async (bookId) => {
    try {
      await unSubscribeToBook(bookId);
      message.success("Hủy đăng ký nhận thông báo thành công!");
      fetchBooks();
    } catch (error) {
      message.error("Lỗi khi hủy đăng ký nhận thông báo.");
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    debouncedFetchBooks(e.target.value);
  };

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <Row justify="space-between" style={{ marginBottom: "30px" }}>
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              allowClear
              placeholder="Tìm kiếm sách..."
              style={{ width: "12%", height: "40px" }}
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
              style={{ width: "12%", height: "40px" }}
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
              style={{ width: "12%", height: "40px" }}
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
              style={{ width: "12%", height: "40px" }}
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
              style={{ width: "12%", height: "40px" }}
            >
              <Select.Option value={true}>Đã Đăng Ký</Select.Option>
              <Select.Option value={false}>Chưa Đăng Ký</Select.Option>
            </Select>
            <Input
              type="number"
              placeholder="Nhập số ngày mượn"
              min={1}
              max={45}
              value={borrowDays}
              onChange={(e) => setBorrowDays(e.target.value)}
              style={{ width: "12%", height: "40px" }}
            />
            <Button
              type="primary"
              onClick={handleBorrowBook}
              disabled={!selectedBook || borrowDays < 1 || borrowDays > 45}
              style={{ height: "40px" }}
            >
              Xác Nhận Mượn Sách
            </Button>
          </Row>
          <Row gutter={[16, 16]}>
            {books.map((book) => (
              <Col span={6} key={book.id}>
                <Card
                  hoverable
                  style={{
                    border:
                      selectedBook?.id === book.id ? "2px solid blue" : "",
                    opacity: book.isAvailable ? 1 : 0.5, // Make unavailable books faded
                    cursor: book.isAvailable ? "pointer" : "not-allowed", // Disable click for unavailable books
                    // textAlign: "center",
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
                        borderRadius: "5px 5px 0 0",
                      }}
                    />
                  }
                  onClick={() => handleBookSelect(book)} // Only handle click for available books
                >
                  <Card.Meta
                    title={book.title}
                    description={
                      <>
                        <div>{`${book.author.name}`}</div>
                        <div>{`${book.publisher.name}`}</div>
                        <div
                          style={{
                            color: book.isAvailable ? "green" : "red",
                            fontWeight: "bold",
                            marginTop: "5px",
                          }}
                        >
                          {book.isAvailable ? "Còn Sách" : "Hết Sách"}
                        </div>
                      </>
                    }
                  />
                  {book.isSubscribe ? (
                    <Button
                      type="default"
                      block
                      onClick={() => handleUnsubscribe(book.id)}
                      style={{ marginTop: "10px", color: "red" }}
                    >
                      Hủy đăng ký
                    </Button>
                  ) : (
                    <Button
                      type="default"
                      block
                      onClick={() => handleSubscribe(book.id)}
                      style={{ marginTop: "10px", color: "green" }}
                    >
                      Đăng ký nhận tin
                    </Button>
                  )}
                </Card>
              </Col>
            ))}
          </Row>

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalBooks} // Correct total for pagination
            onChange={handlePageChange}
            style={{ marginTop: 20, textAlign: "center" }}
          />
        </>
      )}
    </div>
  );
};

export default RegisterBorrowBook;
