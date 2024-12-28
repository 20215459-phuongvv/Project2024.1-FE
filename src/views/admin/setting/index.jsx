import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import Card from "components/card/Card";
import { Input, Button, Typography, Space, message } from "antd";

import { addVipUserLimit, addNormalUserLimit } from "services/settingService";

const { Title, Text } = Typography;

const Settings = () => {
  const [vipLimit, setVipLimit] = useState("");
  const [normalLimit, setNormalLimit] = useState("");

  // Function to handle updating VIP limit
  const handleVipLimitSubmit = async () => {
    try {
      await addVipUserLimit(parseInt(vipLimit, 10));
      message.success("Giới hạn VIP đã được cập nhật.");
      setVipLimit(""); // Reset input field
    } catch (error) {
      message.error(error.response?.data?.message || "Không thể cập nhật giới hạn VIP.");
    }
  };

  // Function to handle updating Normal limit
  const handleNormalLimitSubmit = async () => {
    try {
      await addNormalUserLimit(parseInt(normalLimit, 10));
      message.success("Giới hạn thường đã được cập nhật.");
      setNormalLimit(""); // Reset input field
    } catch (error) {
      message.error(error.response?.data?.message || "Không thể cập nhật giới hạn thường.");
    }
  };

  return (
    <Box
      pt={{ base: "130px", md: "80px", xl: "80px" }}
      display="flex"
      justifyContent="center"
      alignItems="center"
      w="100%"
      minH="100vh"
    >
      <Card
        direction="column"
        w="80%"
        maxW="600px"
        px="25px"
        py="20px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Title level={3} style={{ marginBottom: "20px" }}>
          Cài đặt Giới hạn Người dùng
        </Title>

        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* VIP User Limit Section */}
          <div>
            <Text strong>Giới hạn Người dùng VIP</Text>
            <Input
              placeholder="Nhập giới hạn VIP"
              value={vipLimit}
              onChange={(e) => setVipLimit(e.target.value)}
              type="number"
              style={{ height: "40px", marginTop: "10px" }}
            />
            <Button
              type="primary"
              block
              style={{ marginTop: "10px", height: "40px" }}
              onClick={handleVipLimitSubmit}
              disabled={!vipLimit || isNaN(vipLimit)}
            >
              Cập nhật Giới hạn VIP
            </Button>
          </div>

          {/* Normal User Limit Section */}
          <div>
            <Text strong>Giới hạn Người dùng Thường</Text>
            <Input
              placeholder="Nhập giới hạn thường"
              value={normalLimit}
              onChange={(e) => setNormalLimit(e.target.value)}
              type="number"
              style={{ height: "40px", marginTop: "10px" }}
            />
            <Button
              type="default"
              block
              style={{ marginTop: "10px", height: "40px" }}
              onClick={handleNormalLimitSubmit}
              disabled={!normalLimit || isNaN(normalLimit)}
            >
              Cập nhật Giới hạn Thường
            </Button>
          </div>
        </Space>
      </Card>
    </Box>
  );
};

export default Settings;
