import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Input,
  Switch,
  Select,
  Upload,
  message,
  Typography,
} from "antd";
import { updateBook } from "services/bookService"; // Assuming you have this service
import { UploadOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function EditBookModal({
  isOpen,
  onClose,
  book,
  fetchBooks,
  authors,
  publishers,
}) {
  const [editBooking, setEditBooking] = useState({
    id: "",
    title: "",
    authorId: 1,
    publisherId: 1,
    isAvailable: true,
    type: 0,
    status: 1,
    thumbnail: null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    authorId: "",
    publisherId: "",
    thumbnail: "",
  });

  const [fileList, setFileList] = useState([]);

  // Khi mở modal, tải thông tin sách hiện tại
  useEffect(() => {
    if (book) {
      setEditBooking({
        id: book.id,
        title: book.title,
        authorId: book.author.id,
        publisherId: book.publisher.id,
        isAvailable: book.isAvailable,
        type: book.type,
        status: book.status,
        thumbnail: book.thumbnail,
      });
      setFileList(
        book.thumbnail
          ? [
              {
                uid: "-1",
                name: "Thumbnail",
                status: "done",
                url: book.thumbnail,
              },
            ]
          : []
      );
      setErrors({ title: "", authorId: "", publisherId: "" });
    }
  }, [book]);

  // Xử lý tải file
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length === 0) {
      setEditBooking({ ...editBooking, thumbnail: null });
    } else if (fileList[0].response) {
      setEditBooking({ ...editBooking, thumbnail: fileList[0].response.url });
    }
  };

  // Nộp form (cập nhật sách)
  const handleSubmit = async () => {
    let valid = true;
    const newErrors = { title: "", authorId: "", publisherId: "", thumbnail: "" };

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

    if (!editBooking.thumbnail) {
      newErrors.thumbnail = "Vui lòng tải ảnh bìa.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    setLoading(true);

    try {
      let updatedThumbnail = editBooking.thumbnail;

      if (typeof updatedThumbnail === "string") {
        updatedThumbnail = null;
      }
      const payload = {
        ...editBooking,
        thumbnail: updatedThumbnail,
      };
      const response = await updateBook(payload);
      if (response.success) {
        message.success("Cập nhật sách thành công.");
        onClose();
        fetchBooks();
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
      footer={null}
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

      <div style={{ marginBottom: 16 }}>
        <label
          style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
        >
          Trạng thái:
        </label>
        <Switch
          checked={editBooking.status === 1}
          onChange={(checked) =>
            setEditBooking({ ...editBooking, status: checked ? 1 : 0 })
          }
          style={{ marginRight: "8px" }}
        />
        <Text>
          {editBooking.status === 1 ? "Hiện sách" : "Ẩn sách"}
        </Text>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
          Ảnh Bìa:
        </label>
        <Upload
          beforeUpload={(file) => {
            // Tạo một bản sao đối tượng `editBooking`
            const updatedBooking = { ...editBooking };

            // Gán tệp mới vào `thumbnail`
            updatedBooking.thumbnail = file;

            // Cập nhật lại state
            setEditBooking(updatedBooking);

            return false; // Ngăn tự động upload
          }}
          accept="image/*"
          maxCount={1}
          fileList={
            editBooking.thumbnail
              ? [
                  {
                    uid: "-1", // ID duy nhất cho file
                    name:
                      typeof editBooking.thumbnail === "string"
                        ? "Ảnh Bìa Hiện Tại" // Đặt tên hiển thị nếu là URL
                        : editBooking.thumbnail.name, // Lấy tên gốc nếu là File
                    status: "done",
                    url:
                      typeof editBooking.thumbnail === "string"
                        ? editBooking.thumbnail // URL ảnh hiện tại
                        : URL.createObjectURL(editBooking.thumbnail), // URL ảnh mới được chọn
                  },
                ]
              : []
          }
          onRemove={() => {
            // Cập nhật state để xóa ảnh
            setEditBooking((prev) => ({
              ...prev,
              thumbnail: null,
            }));
          }}
        >
          <Button icon={<UploadOutlined />}>Chọn Ảnh</Button>
        </Upload>
        {errors.thumbnail && (
          <Text type="danger" style={{ fontSize: "12px" }}>
            {errors.thumbnail}
          </Text>
        )}
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
