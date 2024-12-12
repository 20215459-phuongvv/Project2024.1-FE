import axios from "axios";

// Lấy API URL từ biến môi trường
const API_URL = `${process.env.REACT_APP_API_URL}/api/admin/reading-cards`;

// Hàm lấy danh sách Reading Cards với phân trang (page và size)
export const getReadingCards = async (page = 0, size = 10) => {
  try {
    const user = JSON.parse(localStorage.getItem("user")); // Lấy thông tin người dùng từ localStorage
    const token = user ? user.jwt : null; // Lấy token từ user (JWT token)

    // Gửi request lấy danh sách Reading Cards với các tham số phân trang
    const response = await axios.get(API_URL, {
      params: { page, size },
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
      },
    });

    return response.data; // Trả về dữ liệu API
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thẻ đọc:", error);
    throw error; // Ném lỗi nếu có vấn đề
  }
};

// Hàm cảnh báo Reading Card
export const warnReadingCard = async (id) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.put(
      `${API_URL}/${id}/warn`,
      null, // Không cần gửi body nếu API không yêu cầu
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Trả về dữ liệu từ API sau khi cảnh báo
  } catch (error) {
    console.error("Lỗi khi cảnh báo thẻ đọc:", error);
    throw error; // Ném lỗi nếu có vấn đề
  }
};

// Hàm cấm Reading Card
export const banReadingCard = async (id) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.put(
      `${API_URL}/${id}/ban`,
      null, // Không cần gửi body nếu API không yêu cầu
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Trả về dữ liệu từ API sau khi cấm
  } catch (error) {
    console.error("Lỗi khi cấm thẻ đọc:", error);
    throw error; // Ném lỗi nếu có vấn đề
  }
};

// Hàm mở khóa (unban) Reading Card
export const unbanReadingCard = async (id) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.put(
      `${API_URL}/${id}/unban`,
      null, // Không cần gửi body nếu API không yêu cầu
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Trả về dữ liệu từ API sau khi mở khóa
  } catch (error) {
    console.error("Lỗi khi mở khóa thẻ đọc:", error);
    throw error; // Ném lỗi nếu có vấn đề
  }
};
