// components/Profile/index.js
import React, { useState, useEffect } from "react";
import { Tabs, message } from "antd";
import { Box } from "@chakra-ui/react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import CardInfo from "./CardInfo";
import { updateProfile } from "services/userService";
import { changePassword } from "services/userService";
import Card from "components/card/Card";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    phone: "",
    address: "",
    role: "",
  });
  const [passwords, setPasswords] = useState({
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (storedUser) {
      setUser({
        name: storedUser.username,
        phone: storedUser.phone,
        address: storedUser.address,
        role: storedUser.role,
        email: storedUser.email,
      });
      setAvatarPreview(
        storedUser.avatar ||
          "https://i.pinimg.com/originals/94/e4/cb/94e4cb5ae194975f6dc84d1495c3abcd.gif"
      );
    } else {
      message.error("Không tìm thấy thông tin người dùng trong localStorage");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  const handleUpdateProfile = async () => {
    if (!user.name || !user.phone) {
      message.warning("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setLoading(true);

    try {
      await updateProfile(user);
      message.success(
        "Cập nhật hồ sơ thành công. Vui lòng đăng nhập lại để cập nhật thông tin"
      );
    } catch (error) {
      message.error("Cập nhật hồ sơ thất bại");
    }

    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (!passwords.password || !passwords.newPassword) {
      message.warning("Vui lòng nhập mật khẩu đầy đủ");
      return;
    }
    setPasswordLoading(true);

    try {
      await changePassword(passwords.password, passwords.newPassword);
      message.success("Đổi mật khẩu thành công");
      setPasswords({
        password: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      message.error("Đổi mật khẩu thất bại");
    }

    setPasswordLoading(false);
  };

  const handleEditName = () => {
    setIsEditingName(!isEditingName);
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
        <Tabs
          defaultActiveKey="1"
          centered
          tabBarStyle={{
            fontWeight: "bold",
            fontSize: "16px",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <Tabs.TabPane tab="Hồ Sơ" key="1">
            <ProfileInfo
              user={user}
              avatarPreview={avatarPreview}
              isEditingName={isEditingName}
              handleEditName={handleEditName}
              handleInputChange={handleInputChange}
              handleUpdateProfile={handleUpdateProfile}
              loading={loading}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Đổi Mật Khẩu" key="2">
            <ChangePassword
              passwords={passwords}
              handlePasswordChange={handlePasswordChange}
              handleChangePassword={handleChangePassword}
              passwordLoading={passwordLoading}
            />
          </Tabs.TabPane>

          {user.role === "USER" && (
            <Tabs.TabPane tab="Thông Tin Thẻ Đọc" key="3">
              <CardInfo />
            </Tabs.TabPane>
          )}
        </Tabs>
      </Card>
    </Box>
  );
};

export default Profile;
