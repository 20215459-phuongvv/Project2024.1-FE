import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import Card from "components/card/Card";
import { Input, Button, Typography, Space, message } from "antd";

import { addVipUserLimit, addNormalUserLimit, addMonthlyCardPrice, addYearlyCardPrice, addUpgradeVipPrice, getSetting } from "services/settingService";

const { Title, Text } = Typography;

const Settings = () => {
  const [vipLimit, setVipLimit] = useState("");
  const [normalLimit, setNormalLimit] = useState("");
  const [monthlyCardPrice, setMonthlyCardPrice] = useState("");
  const [yearlyCardPrice, setYearlyCardPrice] = useState("");
  const [upgradeVipPrice, setUpgradeVipPrice] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const vipLimit = await getSetting("VIP_USER_LIMIT");
        const normalLimit = await getSetting("NORMAL_USER_LIMIT");
        const monthlyCardPrice = await getSetting("MONTHLY_CARD_PRICE");
        const yearlyCardPrice = await getSetting("YEARLY_CARD_PRICE");
        const upgradeVipPrice = await getSetting("UPGRADE_VIP_PRICE");

        setVipLimit(vipLimit || "");
        setNormalLimit(normalLimit || "");
        setMonthlyCardPrice(monthlyCardPrice || "");
        setYearlyCardPrice(yearlyCardPrice || "");
        setUpgradeVipPrice(upgradeVipPrice || "");
      } catch (error) {
        message.error("Failed to load settings!");
      }
    };

    fetchSettings();
  }, []);

  const handleVipLimitSubmit = async () => {
    try {
      await addVipUserLimit(parseInt(vipLimit, 10));
      message.success("Giới hạn VIP đã được cập nhật.");
      setVipLimit(vipLimit);
    } catch (error) {
      message.error(error.response?.data?.message || "Không thể cập nhật giới hạn VIP.");
    }
  };

  const handleNormalLimitSubmit = async () => {
    try {
      await addNormalUserLimit(parseInt(normalLimit, 10));
      message.success("Giới hạn thường đã được cập nhật.");
      setNormalLimit(normalLimit);
    } catch (error) {
      message.error(error.response?.data?.message || "Không thể cập nhật giới hạn thường.");
    }
  };

  const handleMonthlyCardSubmit = async () => {
    try {
      await addMonthlyCardPrice(parseInt(monthlyCardPrice, 10));
      message.success("Giá thẻ tháng đã được cập nhật.");
      setNormalLimit(monthlyCardPrice);
    } catch (error) {
      message.error(error.response?.data?.message || "Không thể cập nhật giá thẻ tháng.");
    }
  };

  const handleYearlyCardSubmit = async () => {
    try {
      await addYearlyCardPrice(parseInt(yearlyCardPrice, 10));
      message.success("Giá thẻ năm đã được cập nhật.");
      setNormalLimit(yearlyCardPrice);
    } catch (error) {
      message.error(error.response?.data?.message || "Không thể cập nhật giá thẻ năm.");
    }
  };

  const handleUpgradeVip = async () => {
    try {
      await addUpgradeVipPrice(parseInt(upgradeVipPrice, 10));
      message.success("Giá nâng cấp VIP đã được cập nhật.");
      setNormalLimit(upgradeVipPrice);
    } catch (error) {
      message.error(error.response?.data?.message || "Không thể cập nhật giá nâng cấp VIP.");
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
          Cài đặt chung
        </Title>

        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Text strong>Giới hạn mượn sách Người dùng VIP</Text>
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

          <div>
            <Text strong>Giới hạn mượn sách Người dùng Thường</Text>
            <Input
              placeholder="Nhập giới hạn thường"
              value={normalLimit}
              onChange={(e) => setNormalLimit(e.target.value)}
              type="number"
              style={{ height: "40px", marginTop: "10px" }}
            />
            <Button
              type="primary"
              block
              style={{ marginTop: "10px", height: "40px" }}
              onClick={handleNormalLimitSubmit}
              disabled={!normalLimit || isNaN(normalLimit)}
            >
              Cập nhật Giới hạn Thường
            </Button>
          </div>

          <div>
            <Text strong>Giá thẻ tháng</Text>
            <Input
              placeholder="Nhập giá thẻ tháng"
              value={monthlyCardPrice}
              onChange={(e) => setMonthlyCardPrice(e.target.value)}
              type="number"
              style={{ height: "40px", marginTop: "10px" }}
            />
            <Button
              type="primary"
              block
              style={{ marginTop: "10px", height: "40px" }}
              onClick={handleMonthlyCardSubmit}
              disabled={!monthlyCardPrice || isNaN(monthlyCardPrice)}
            >
              Cập nhật Giá thẻ tháng
            </Button>
          </div>

          <div>
            <Text strong>Giá thẻ năm</Text>
            <Input
              placeholder="Nhập giá thẻ năm"
              value={yearlyCardPrice}
              onChange={(e) => setYearlyCardPrice(e.target.value)}
              type="number"
              style={{ height: "40px", marginTop: "10px" }}
            />
            <Button
              type="primary"
              block
              style={{ marginTop: "10px", height: "40px" }}
              onClick={handleYearlyCardSubmit}
              disabled={!yearlyCardPrice || isNaN(yearlyCardPrice)}
            >
              Cập nhật Giá thẻ năm
            </Button>
          </div>

          <div>
            <Text strong>Giá nâng cấp lên người dùng VIP</Text>
            <Input
              placeholder="Nhập giá nâng cấp lên người dùng VIP"
              value={upgradeVipPrice}
              onChange={(e) => setUpgradeVipPrice(e.target.value)}
              type="number"
              style={{ height: "40px", marginTop: "10px" }}
            />
            <Button
              type="primary"
              block
              style={{ marginTop: "10px", height: "40px" }}
              onClick={handleUpgradeVip}
              disabled={!upgradeVipPrice || isNaN(upgradeVipPrice)}
            >
              Cập nhật Giá nâng cấp lên người dùng VIP
            </Button>
          </div>
        </Space>
      </Card>
    </Box>
  );
};

export default Settings;
