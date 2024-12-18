import React, { useState } from "react";
import {
  Modal,
  Button,
  Input,
  Switch,
  Select,
  message,
  Typography,
  Upload,
} from "antd";
import { addBook } from "services/bookService";
import { UploadOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function CreateBookModal({
  isOpen,
  onClose,
  fetchBooks, // Function to refresh the book list after creation
  authors, // List of authors passed from parent
  publishers, // List of publishers passed from parent
}) {
  const [newBook, setNewBook] = useState({
    authorId: "",
    publisherId: "",
    title: "",
    isAvailable: true,
    type: 0,
    thumbnail: null, // New field for thumbnail
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    authorId: "",
    publisherId: "",
    thumbnail: "",
  });

  const handleSubmit = async () => {
    let valid = true;
    const newErrors = { title: "", authorId: "", publisherId: "", thumbnail: "" };

    if (!newBook.title) {
      newErrors.title = "Vui lòng nhập tên sách.";
      valid = false;
    }

    if (!newBook.authorId) {
      newErrors.authorId = "Vui lòng chọn tác giả.";
      valid = false;
    }

    if (!newBook.publisherId) {
      newErrors.publisherId = "Vui lòng chọn nhà xuất bản.";
      valid = false;
    }

    if (!newBook.thumbnail) {
      newErrors.thumbnail = "Vui lòng tải lên ảnh bìa.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("authorId", newBook.authorId);
      formData.append("publisherId", newBook.publisherId);
      formData.append("title", newBook.title);
      formData.append("isAvailable", newBook.isAvailable);
      formData.append("type", newBook.type);
      formData.append("thumbnail", newBook.thumbnail);

      const response = await addBook(formData);
      if (response.success) {
        message.success("Tạo sách thành công.");
        onClose();
        setNewBook({
          authorId: authors[0]?.id || 1,
          publisherId: publishers[0]?.id || 1,
          title: "",
          isAvailable: true,
          type: 0,
          thumbnail: null,
        });
        fetchBooks();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Tạo sách thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Tạo Sách Mới"
      visible={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
          Tên Sách:
        </label>
        <Input
          placeholder="Nhập tên sách"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          style={{ height: "40px" }}
        />
        {errors.title && (
          <Text type="danger" style={{ fontSize: "12px" }}>
            {errors.title}
          </Text>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
          Tác Giả:
        </label>
        <Select
          value={newBook.authorId}
          onChange={(value) => setNewBook({ ...newBook, authorId: value })}
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
        <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
          Nhà Xuất Bản:
        </label>
        <Select
          value={newBook.publisherId}
          onChange={(value) => setNewBook({ ...newBook, publisherId: value })}
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
        <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
          Ảnh Bìa:
        </label>
        <Upload
          beforeUpload={(file) => {
            setNewBook({ ...newBook, thumbnail: file });
            return false; // Prevent automatic upload
          }}
          accept="image/*"
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Chọn Ảnh</Button>
        </Upload>
        {errors.thumbnail && (
          <Text type="danger" style={{ fontSize: "12px" }}>
            {errors.thumbnail}
          </Text>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
          Trạng Thái Sách:
        </label>
        <Switch
          checked={newBook.isAvailable}
          onChange={(checked) =>
            setNewBook({ ...newBook, isAvailable: checked })
          }
        />
        <Text>{newBook.isAvailable ? "Còn Sách" : "Hết Sách"}</Text>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
          Loại Sách:
        </label>
        <Switch
          checked={newBook.type === 1}
          onChange={(checked) =>
            setNewBook({ ...newBook, type: checked ? 1 : 0 })
          }
        />
        <Text>
          {newBook.type === 1 ? "Sách Đặc Biệt" : "Sách Thông Thường"}
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
