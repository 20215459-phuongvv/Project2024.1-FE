import React, { useState } from "react";
import { Modal, Button, Input, message, Typography, Switch } from "antd";
import { addPublisher } from "services/publisherService"; // Assuming you have this service

const { Text } = Typography;

export default function CreatePublisherModal({
  isOpen,
  onClose,
  fetchPublishers, // Function to refresh the publisher list after creation
}) {
  const [newPublisher, setNewPublisher] = useState({
    name: "", // The name of the publisher
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
  });

  const handleSubmit = async () => {
    let valid = true;
    const newErrors = { name: "" };

    if (!newPublisher.name) {
      newErrors.name = "Vui lòng nhập tên nhà xuất bản.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    setLoading(true);

    try {
      const response = await addPublisher(newPublisher);
      if (response.success) {
        message.success("Tạo nhà xuất bản thành công.");
        onClose();
        setNewPublisher({ name: "" });
        fetchPublishers(); // Refresh the publisher list
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Tạo nhà xuất bản thất bại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Tạo Nhà Xuất Bản Mới"
      visible={isOpen}
      onCancel={onClose}
      footer={null} // Custom footer, no default buttons
    >
      <div style={{ marginBottom: 16 }}>
        <label
          style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
        >
          Tên Nhà Xuất Bản:
        </label>
        <Input
          placeholder="Nhập tên nhà xuất bản"
          value={newPublisher.name}
          onChange={(e) =>
            setNewPublisher({ ...newPublisher, name: e.target.value })
          }
          style={{ height: "40px" }}
        />
        {errors.name && (
          <Text type="danger" style={{ fontSize: "12px" }}>
            {errors.name}
          </Text>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
          Trạng thái Nhà Xuất Bản:
        </label>
        <Switch
          checked={newPublisher.status === 1}
          onChange={(checked) =>
            setNewPublisher({ ...newPublisher, status: checked ? 1 : 0 })
          }
        />
        <Text>
          {newPublisher.status === 1 ? "Hoạt động" : "Dừng hoạt động"}
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
