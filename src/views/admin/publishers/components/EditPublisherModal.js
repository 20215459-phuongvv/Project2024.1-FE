import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Switch, message, Typography } from "antd";
import { updatePublisher } from "services/publisherService"; // Assuming you have this service

const { Text } = Typography;

export default function EditPublisherModal({
  isOpen,
  onClose,
  publisher, // The publisher to be edited
  fetchPublishers, // Function to fetch publishers after update
}) {
  const [editPublisher, setEditPublisher] = useState({
    id: "", // Include id in the state
    name: "",
    status: true, // Default status is active
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
  });

  // Set the form with publisher data when the modal is opened
  useEffect(() => {
    if (publisher) {
      setEditPublisher({
        id: publisher.id, // Initialize id from the passed publisher object
        name: publisher.name,
        status: publisher.status === 1, // Assuming 1 means active, 0 means inactive
      });
      setErrors({ name: "" }); // Clear errors
    }
  }, [publisher]);

  // Handle form submission (publisher update)
  const handleSubmit = async () => {
    let valid = true;
    const newErrors = { name: "" };

    if (!editPublisher.name) {
      newErrors.name = "Vui lòng nhập tên nhà xuất bản.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    setLoading(true);

    try {
      // Pass the id along with name and status in the payload
      const response = await updatePublisher(editPublisher); // API call to update publisher with the full editPublisher object
      if (response.success) {
        message.success("Cập nhật nhà xuất bản thành công.");
        onClose();
        fetchPublishers(); // Fetch updated list of publishers
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Cập nhật nhà xuất bản thất bại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa Nhà Xuất Bản"
      visible={isOpen}
      onCancel={onClose}
      footer={null} // Custom footer, not using AntD default
    >
      <div style={{ marginBottom: 16 }}>
        <label
          style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
        >
          Tên Nhà Xuất Bản:
        </label>
        <Input
          placeholder="Nhập tên nhà xuất bản"
          value={editPublisher.name}
          onChange={(e) =>
            setEditPublisher({ ...editPublisher, name: e.target.value })
          }
          style={{ height: "40px" }} // Adjust input height
        />
        {errors.name && (
          <Text type="danger" style={{ fontSize: "12px" }}>
            {errors.name}
          </Text>
        )}
      </div>

      {/* Toggle for publisher status */}
      <div style={{ marginBottom: 16 }}>
        <label
          style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}
        >
          Trạng Thái Nhà Xuất Bản:
        </label>
        <Switch
          checked={editPublisher.status === 1}
          onChange={
            (checked) =>
              setEditPublisher({ ...editPublisher, status: checked ? 1 : 0 }) // 1 for active, 0 for inactive
          }
          style={{ marginRight: "8px" }}
        />
        <Text>{editPublisher.status === 1 ? "Hoạt Động" : "Ngừng Hoạt Động"}</Text>
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
