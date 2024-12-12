// components/Profile/ChangePassword.js
import React from "react";
import { Input, Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const ChangePassword = ({ passwords, handlePasswordChange, handleChangePassword, passwordLoading }) => {
  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontWeight: "bold" }}>Mật khẩu hiện tại</label>
        <Input.Password
          allowClear
          name="password"
          value={passwords.password}
          onChange={handlePasswordChange}
          style={{ height: "40px" }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontWeight: "bold" }}>Mật khẩu mới</label>
        <Input.Password
          allowClear
          name="newPassword"
          value={passwords.newPassword}
          onChange={handlePasswordChange}
          style={{ height: "40px" }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontWeight: "bold" }}>Xác nhận mật khẩu mới</label>
        <Input.Password
          allowClear
          name="confirmNewPassword"
          value={passwords.confirmNewPassword}
          onChange={handlePasswordChange}
          style={{ height: "40px" }}
        />
      </div>

      <Button
        type="primary"
        onClick={handleChangePassword}
        style={{
          width: "100%",
          height: "40px",
          backgroundColor: "#FF8000",
          borderColor: "#FF8000",
          color: "white",
        }}
      >
        {passwordLoading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /> : "Đổi mật khẩu"}
      </Button>
    </div>
  );
};

export default ChangePassword;
