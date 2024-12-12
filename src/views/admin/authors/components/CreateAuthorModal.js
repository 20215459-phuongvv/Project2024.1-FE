import React, { useState } from "react";
import { Modal, Button, Input, message, Typography } from "antd";
import { addAuthor } from "services/authorService"; // Assuming you have this service

const { Text } = Typography;

export default function CreateAuthorModal({
  isOpen,
  onClose,
  fetchAuthors, // Function to refresh the author list after creation
}) {
  const [newAuthor, setNewAuthor] = useState({
    name: "", // The name of the author
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
  });

  const handleSubmit = async () => {
    let valid = true;
    const newErrors = { name: "" };

    if (!newAuthor.name) {
      newErrors.name = "Vui lòng nhập tên tác giả.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    setLoading(true);

    try {
      const response = await addAuthor(newAuthor);
      if (response.success) {
        message.success("Tạo tác giả thành công.");
        onClose();
        setNewAuthor({ name: "" });
        fetchAuthors(); // Refresh the author list
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Tạo tác giả thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Tạo Tác Giả Mới"
      visible={isOpen}
      onCancel={onClose}
      footer={null} // Custom footer, no default buttons
    >
      <div style={{ marginBottom: 16 }}>
        <label
          style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
        >
          Tên Tác Giả:
        </label>
        <Input
          placeholder="Nhập tên tác giả"
          value={newAuthor.name}
          onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
          style={{ height: "40px" }}
        />
        {errors.name && (
          <Text type="danger" style={{ fontSize: "12px" }}>
            {errors.name}
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
