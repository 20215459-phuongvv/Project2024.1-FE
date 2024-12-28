import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { message } from "antd";
import { registerReadingCard, renewReadingCard, upgradeVip } from "services/userService";

const PaymentResult = () => {
  const location = useLocation();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  // Hàm helper parse query params từ URL
  const parseQueryParams = (search) => {
    return Object.fromEntries(new URLSearchParams(search).entries());
  };

  useEffect(async () => {
    const queryParams = parseQueryParams(location.search);
    const { vnp_ResponseCode, vnp_Amount, vnp_TxnRef } = queryParams;

    if (!vnp_ResponseCode) {
      message.error("Không có thông tin thanh toán!");
      setStatus("failed");
      setLoading(false);
      return;
    }

    if (vnp_ResponseCode === "00") {
      const pendingCardRegistration = JSON.parse(localStorage.getItem("pendingCardRegistration"));
      if (pendingCardRegistration) {
        if (pendingCardRegistration.isRegistering == 1) {
          const response = await registerReadingCard(pendingCardRegistration);
          setStatus("success");
          message.success("Thanh toán thành công!");
        } else {
          const response = await renewReadingCard(pendingCardRegistration);
          setStatus("success");
          message.success("Thanh toán thành công!");
        }
      } else {
        const response = await upgradeVip();
        setStatus("success");
        message.success("Thanh toán thành công!");
      }

      
      localStorage.removeItem("pendingCardRegistration");
      // Redirect về trang chủ sau 3 giây
      setTimeout(() => {
        history.push("/");
      }, 3000); 
    } else {
      message.error("Thanh toán thất bại!");
      setTimeout(() => {
        history.push("/");
      }, 3000); 
    }
    setLoading(false);

    // Optional: Gọi API backend để xác thực nếu cần
    // verifyPayment(queryParams);
  }, [location.search]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {loading ? (
        <h2>Đang xử lý giao dịch...</h2>
      ) : (
        <h2>
          {status === "success"
            ? "Giao dịch thành công!"
            : "Giao dịch thất bại. Vui lòng thử lại!"}
        </h2>
      )}
    </div>
  );
};

export default PaymentResult;
