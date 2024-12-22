import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { message } from "antd";

const PaymentResult = () => {
  const location = useLocation();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  // Hàm helper parse query params từ URL
  const parseQueryParams = (search) => {
    return Object.fromEntries(new URLSearchParams(search).entries());
  };

  useEffect(() => {
    const queryParams = parseQueryParams(location.search);
    const { vnp_ResponseCode, vnp_Amount, vnp_TxnRef } = queryParams;

    if (!vnp_ResponseCode) {
      message.error("Không có thông tin thanh toán!");
      setStatus("failed");
      setLoading(false);
      return;
    }

    if (vnp_ResponseCode === "00") {
      message.success("Thanh toán thành công!");

      // Redirect về trang chủ sau 3 giây
      setTimeout(() => {
        history.push("/");
      }, 3000); 
    } else {
      message.error("Thanh toán thất bại!");
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
