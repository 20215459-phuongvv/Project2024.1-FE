import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Tag,
  Spin,
  Button,
  Modal,
  Form,
  Select,
  InputNumber,
  message, // Import message for feedback
} from "antd";
import { getCardInfo, requestPayment, requestUpgradeVipPayment } from "services/userService"; // Import API call

const { Meta } = Card;

const CardInfo = () => {
  const [cardInfo, setCardInfo] = useState(null); // Store the card info
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [isRenewModalVisible, setIsRenewModalVisible] = useState(false); // Gia hạn modal
  const [form] = Form.useForm(); // Form instance
  const fetchCardInfo = async () => {
    try {
      const response = await getCardInfo(); // Call API
      setCardInfo(response.data); // Set card info in state
    } catch (err) {
      setError("Không thể tải thông tin thẻ đọc.");
      console.error(err);
    } finally {
      setLoading(false); // Stop loading after API call
    }
  };
  // Fetch card info from the API
  useEffect(() => {
    fetchCardInfo(); // Fetch card info when the component is mounted
  }, []);

  // Handle registration of reading card
  const handleRegisterCard = async (values) => {
    try {
      // Call the API to register the reading card
      const response = await requestPayment(values);
      const paymentUrl = response.data.paymentUrl;
      if (paymentUrl) {
        localStorage.setItem("pendingCardRegistration", JSON.stringify(values));
        window.location.href = paymentUrl;
      } else {
        message.error(error.response?.data?.message || "Không lấy được URL thanh toán. Vui lòng thử lại!");
      }
      // After successful registration, fetch the updated card info
      setIsModalVisible(false); // Close the modal
      form.resetFields(); // Reset form fields
      fetchCardInfo();
    } catch (error) {
      message.error(error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại!"); // Show error message
      console.error("Error registering card: ", error);
    }
  };

  const handleUpgradeVip = async () => {
    try {
      const response = await requestUpgradeVipPayment();
      const paymentUrl = response.data.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        message.error(error.response?.data?.message || "Không lấy được URL thanh toán. Vui lòng thử lại!");
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchCardInfo();
    } catch (error) {
      message.error(error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại!"); // Show error message
    }
  };
  // If the data is loading, show a loading spinner
  if (loading) {
    return <Spin size="large" />;
  }

  // If there's an error, display an error message
  if (error) {
    return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;
  }

  // If no card info is available, show a placeholder with the register button
  if (!cardInfo) {
    return (
      <div style={styles.cardContainer}>
        <Button 
          type="primary" 
          onClick={() => setIsModalVisible(true)}
          style={{
            width: "100%",
            height: "40px",
            backgroundColor: "#FF8000",
            borderColor: "#FF8000",
            color: "white",
          }}>
          Đăng ký thẻ đọc
        </Button>

        {/* Modal for Registering Card */}
        <Modal
          title="Đăng ký thẻ đọc"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          centered
        >
          <Form
            form={form}
            onFinish={(values) => handleRegisterCard({ ...values, isRegistering: 1 })}
            layout="vertical"
            initialValues={{
              type: 0, // Default to Monthly
              numberOfPeriod: 1,
              isRegistering: 1
            }}
          >
            <Form.Item
              label="Loại thẻ"
              name="type"
              rules={[{ required: true, message: "Vui lòng chọn loại thẻ!" }]}
            >
              <Select>
                <Select.Option value={0}>Thẻ tháng</Select.Option>
                <Select.Option value={1}>Thẻ năm</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Số kỳ"
              name="numberOfPeriod"
              rules={[{ required: true, message: "Vui lòng nhập số kỳ!" }]}
            >
              <InputNumber min={1} max={12} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }

  // Destructure the card info for easier access
  const {
    code,
    type,
    violationCount,
    startDate,
    expiryDate,
    status,
    updatedAt,
    user,
  } = cardInfo;

  return (
    <div style={styles.cardContainer}>
      <Card style={styles.card} bordered={false} bodyStyle={styles.cardBody}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>Thông Tin Thẻ Đọc</h2>
        </div>

        {/* User Info Section */}
        <Row gutter={[16, 16]} style={styles.userInfoSection}>
          <Col span={6}>
            {/* Display image as a rectangle */}
            <img
              src="https://i.pinimg.com/originals/94/e4/cb/94e4cb5ae194975f6dc84d1495c3abcd.gif" // Random avatar
              alt="User Avatar"
              style={styles.userImage}
            />
          </Col>
          <Col span={18}>
            <div style={styles.cardItem}>
              <strong>Họ và tên:</strong>
              <p>{user.name}</p>
            </div>
            <div style={styles.cardItem}>
              <strong>Loại người dùng:</strong>
              <p>
                {user.role == "USER" ? "Người dùng thường" : "Người dùng VIP"}
                <Button 
                  type="primary" 
                  onClick={handleUpgradeVip}
                  style={{
                    width: "30%",
                    height: "30px",
                    backgroundColor: "#FF8000",
                    borderColor: "#FF8000",
                    color: "white",
                    marginLeft: "30px",
                    visibility: user.role == "USER" ? "visible" : "hidden",
                  }}
                >
                  Nâng cấp lên VIP
                </Button>
              </p>
            </div>
            <div style={styles.cardItem}>
              <strong>Email:</strong>
              <p>{user.email}</p>
            </div>
            <div style={styles.cardItem}>
              <strong>Số điện thoại:</strong>
              <p>{user.phone}</p>
            </div>
            <div style={styles.cardItem}>
              <strong>Địa chỉ:</strong>
              <p>{user.address}</p>
            </div>
          </Col>
        </Row>

        {/* Card Info Section */}
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div style={styles.cardItem}>
              <strong>Mã thẻ:</strong>
              <p>{code}</p>
            </div>
          </Col>
          <Col span={12}>
            <div style={styles.cardItem}>
              <strong>Loại thẻ:</strong>
              <p>{type === 0 ? "Thẻ tháng" : "Thẻ năm"}</p>
            </div>
          </Col>
          <Col span={12}>
            <div style={styles.cardItem}>
              <strong>Số lần vi phạm:</strong>
              <p>{violationCount}</p>
            </div>
          </Col>
          <Col span={12}>
            <div style={styles.cardItem}>
              <strong>Ngày bắt đầu:</strong>
              <p>{new Date(startDate).toLocaleDateString()}</p>
            </div>
          </Col>
          <Col span={12}>
            <div style={styles.cardItem}>
              <strong>Ngày hết hạn:</strong>
              <p>{new Date(expiryDate).toLocaleDateString()}</p>
            </div>
          </Col>
          <Col span={12}>
            <div style={styles.cardItem}>
              <strong>Trạng thái:</strong>
              <Tag 
                color={status === 1 ? "green" : "red"}
                style={{ marginLeft: "20px" }}
              >
                {status === 1 ? "Hoạt động" : "Không hoạt động"}
              </Tag>
            </div>
          </Col>
          <Col span={12}>
            <div style={styles.cardItem}>
              <strong>Cập nhật lần cuối:</strong>
              <p>{new Date(updatedAt).toLocaleString()}</p>
            </div>
          </Col>
        </Row>
        <div style={{ textAlign: "center" }}>
          <Button 
            type="primary" 
            onClick={() => setIsRenewModalVisible(true)}
            style={{
              width: "50%",
              height: "40px",
              backgroundColor: "#FF8000",
              borderColor: "#FF8000",
              color: "white",
            }}
          >
            Gia hạn thẻ đọc
          </Button>
        </div>
      </Card>
      <Modal
        title="Gia hạn thẻ đọc"
        visible={isRenewModalVisible}
        onCancel={() => setIsRenewModalVisible(false)}
        footer={null}
        centered
      >
        <Form
          form={form}
          onFinish={(values) => handleRegisterCard({ ...values, isRegistering: 0, type: type })}
          layout="vertical"
          initialValues={{ 
            numberOfPeriod: 1 , 
            isRegistering: 0 , 
            type: 0 }}
        >
          <Form.Item
            label="Số kỳ muốn gia hạn"
            name="numberOfPeriod"
            rules={[{ required: true, message: "Vui lòng nhập số kỳ!" }]}
          >
            <InputNumber min={1} max={12} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Gia hạn
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const styles = {
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
  },
  card: {
    width: "600px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
  },
  cardBody: {
    padding: "20px",
  },
  cardHeader: {
    textAlign: "center",
    marginBottom: "20px",
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: 0,
    color: "#333",
  },
  userInfoSection: {
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid #f0f0f0",
  },
  cardItem: {
    marginBottom: "16px",
  },
  userImage: {
    width: "90%", // Full width of the column
    height: "120px", // Set a fixed height to create a rectangle
    objectFit: "cover", // Ensure the image covers the entire area without distorting
    borderRadius: "8px", // Optionally add border radius to smooth the edges
  },
};

export default CardInfo;
