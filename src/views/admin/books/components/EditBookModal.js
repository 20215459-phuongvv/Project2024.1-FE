import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Input,
  Switch,
  Select,
  message,
  Typography,
} from "antd";
import { updateBook } from "services/bookService"; // Assuming you have this service

const { Text } = Typography;

export default function EditBookModal({
  isOpen,
  onClose,
  book, // The book to be edited
  fetchBooks, // Function to fetch books after update
  authors, // List of authors passed as props
  publishers, // List of publishers passed as props
}) {
  const [editBooking, setEditBooking] = useState({
    id: "", // Add id property here
    title: "",
    authorId: 1, // Default to first author
    publisherId: 1, // Default to first publisher
    isAvailable: true,
    type: 0, // Default type as normal (0)
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    authorId: "",
    publisherId: "",
  });

  // Set the form with book data when the modal is opened
  useEffect(() => {
    if (book) {
      setEditBooking({
        id: book.id, // Set the book ID here
        title: book.title,
        authorId: book.author.id,
        publisherId: book.publisher.id,
        isAvailable: book.isAvailable,
        type: book.type,
      });
      setErrors({ title: "", authorId: "", publisherId: "" }); // Clear errors
    }
  }, [book]);

  // Handle form submission (book update)
  const handleSubmit = async () => {
    let valid = true;
    const newErrors = { title: "", authorId: "", publisherId: "" };

    if (!editBooking.title) {
      newErrors.title = "Vui lòng nhập tên sách.";
      valid = false;
    }

    if (!editBooking.authorId) {
      newErrors.authorId = "Vui lòng chọn tác giả.";
      valid = false;
    }

    if (!editBooking.publisherId) {
      newErrors.publisherId = "Vui lòng chọn nhà xuất bản.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    setLoading(true);

    try {
      const response = await updateBook(editBooking); // Send book.id with the update data
      if (response.success) {
        message.success("Cập nhật sách thành công.");
        onClose();
        fetchBooks(); // Fetch updated list of books
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Cập nhật sách thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa Sách"
      visible={isOpen}
      onCancel={onClose}
      footer={null} // Custom footer, not using AntD default
    >
      <div style={{ marginBottom: 16 }}>
        <label
          style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
        >
          Tên Sách:
        </label>
        <Input
          placeholder="Nhập tên sách"
          value={editBooking.title}
          onChange={(e) =>
            setEditBooking({ ...editBooking, title: e.target.value })
          }
          style={{ height: "40px" }} // Adjust input height
        />
        {errors.title && (
          <Text type="danger" style={{ fontSize: "12px" }}>
            {errors.title}
          </Text>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label
          style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
        >
          Tác Giả:
        </label>
        <Select
          value={editBooking.authorId}
          onChange={(value) =>
            setEditBooking({ ...editBooking, authorId: value })
          }
          style={{ width: "100%" }}
        >
          {authors.map((author) => (
            <Select.Option key={author.id} value={author.id}>
              {author.name}
            </Select.Option>
          ))}
        </Select>
        {errors.authorId && (
          <Text type="danger" style={{ fontSize: "12px" }}>
            {errors.authorId}
          </Text>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label
          style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
        >
          Nhà Xuất Bản:
        </label>
        <Select
          value={editBooking.publisherId}
          onChange={(value) =>
            setEditBooking({ ...editBooking, publisherId: value })
          }
          style={{ width: "100%" }}
        >
          {publishers.map((publisher) => (
            <Select.Option key={publisher.id} value={publisher.id}>
              {publisher.name}
            </Select.Option>
          ))}
        </Select>
        {errors.publisherId && (
          <Text type="danger" style={{ fontSize: "12px" }}>
            {errors.publisherId}
          </Text>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label
          style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
        >
          Trạng Thái Sách:
        </label>
        <Switch
          checked={editBooking.isAvailable}
          onChange={(checked) =>
            setEditBooking({ ...editBooking, isAvailable: checked })
          }
          style={{ marginRight: "8px" }}
        />
        <Text>{editBooking.isAvailable ? "Còn Sách" : "Hết Sách"}</Text>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label
          style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
        >
          Loại Sách:
        </label>
        <Switch
          checked={editBooking.type === 1}
          onChange={(checked) =>
            setEditBooking({ ...editBooking, type: checked ? 1 : 0 })
          }
          style={{ marginRight: "8px" }}
        />
        <Text>
          {editBooking.type === 1 ? "Sách Đặc Biệt" : "Sách Thông Thường"}
        </Text>
      </div>

      <div style={{ textAlign: "right" }}>
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          style={{ marginRight: 8 }}
        >
          Lưu
        </Button>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
      </div>
    </Modal>
  );
}
