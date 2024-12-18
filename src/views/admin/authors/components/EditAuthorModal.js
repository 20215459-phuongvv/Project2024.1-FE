import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Switch, message, Typography } from "antd";
import { updateAuthor } from "services/authorService"; // Assuming you have this service

const { Text } = Typography;

export default function EditAuthorModal({
  isOpen,
  onClose,
  author, // The author to be edited
  fetchAuthors, // Function to fetch authors after update
}) {
  const [editAuthor, setEditAuthor] = useState({
    id: "", // Include id in the state
    name: "",
    status: true, // Default status is active
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
  });

  // Set the form with author data when the modal is opened
  useEffect(() => {
    if (author) {
      setEditAuthor({
        id: author.id, // Initialize id from the passed author object
        name: author.name,
        status: author.status === 1, // Assuming 1 means active, 0 means inactive
      });
      setErrors({ name: "" }); // Clear errors
    }
  }, [author]);

  // Handle form submission (author update)
  const handleSubmit = async () => {
    let valid = true;
    const newErrors = { name: "" };

    if (!editAuthor.name) {
      newErrors.name = "Vui lòng nhập tên tác giả.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    setLoading(true);

    try {
      // Pass the id along with name and status in the payload
      const response = await updateAuthor(editAuthor); // API call to update author with the full editAuthor object
      if (response.success) {
        message.success("Cập nhật tác giả thành công.");
        onClose();
        fetchAuthors(); // Fetch updated list of authors
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Cập nhật tác giả thất bại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa Tác Giả"
      visible={isOpen}
      onCancel={onClose}
      footer={null} // Custom footer, not using AntD default
    >
      <div style={{ marginBottom: 16 }}>
        <label
          style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
        >
          Tên Tác Giả:
        </label>
        <Input
          placeholder="Nhập tên tác giả"
          value={editAuthor.name}
          onChange={(e) =>
            setEditAuthor({ ...editAuthor, name: e.target.value })
          }
          style={{ height: "40px" }} // Adjust input height
        />
        {errors.name && (
          <Text type="danger" style={{ fontSize: "12px" }}>
            {errors.name}
          </Text>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label
          style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
        >
          Trạng Thái Tác Giả:
        </label>
        <Switch
          checked={editAuthor.status === 1}
          onChange={(checked) =>
            setEditAuthor({ ...editAuthor, status: checked ? 1 : 0 })
          }
          style={{ marginRight: "8px" }}
        />
        <Text>{editAuthor.status === 1 ? "Hoạt Động" : "Ngừng Hoạt Động"}</Text>
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
