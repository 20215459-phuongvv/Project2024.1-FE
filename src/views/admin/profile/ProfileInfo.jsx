// components/Profile/ProfileInfo.js
import React from "react";
import { Input, Button, Avatar, Spin } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Box } from "@chakra-ui/react";

const ProfileInfo = ({
  user,
  avatarPreview,
  isEditingName,
  handleEditName,
  handleInputChange,
  handleUpdateProfile,
  loading,
}) => {
  console.log(user);
  return (
    <Box style={{ marginBottom: "20px" }}>
      <div style={{ textAlign: "center" }}>
        <Avatar size={120} src={avatarPreview} />
        <h2 style={{ fontWeight: "bold", fontSize: "22px" }}>
          {isEditingName ? (
            <Input
              name="name"
              value={user.name}
              onChange={handleInputChange}
              onBlur={handleEditName}
              autoFocus
            />
          ) : (
            <>
              {user.name}
              <EditOutlined
                style={{ marginLeft: "10px", cursor: "pointer" }}
                onClick={handleEditName}
              />
            </>
          )}
        </h2>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontWeight: "bold" }}>Email</label>
        <Input
          allowClear
          disabled
          name="email"
          value={user.email}
          onChange={handleInputChange}
          style={{ height: "40px" }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontWeight: "bold" }}>Số điện thoại</label>
        <Input
          allowClear
          name="phone"
          value={user.phone}
          onChange={handleInputChange}
          style={{ height: "40px" }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontWeight: "bold" }}>Địa chỉ</label>
        <Input
          allowClear
          name="address"
          value={user.address}
          onChange={handleInputChange}
          style={{ height: "40px" }}
        />
      </div>

      <Button
        type="primary"
        onClick={handleUpdateProfile}
        style={{
          width: "100%",
          height: "40px",
          backgroundColor: "#FF8000",
          borderColor: "#FF8000",
          color: "white",
        }}
      >
        {loading ? <Spin /> : "Lưu thay đổi"}
      </Button>
    </Box>
  );
};

export default ProfileInfo;
