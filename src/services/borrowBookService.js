import axios from "axios";

// Lấy API URL từ biến môi trường
const API_URL = `${process.env.REACT_APP_API_URL}/api/admin/borrow`;
const API_URL_USER = `${process.env.REACT_APP_API_URL}/api/borrow`;

// Hàm lấy danh sách các sách đã mượn với phân trang (page và size)
export const getAllBorrowedBooks = async (
  page = 0,
  size = 10,
  searchParams = {}
) => {
  try {
    const user = JSON.parse(localStorage.getItem("user")); // Get user information from localStorage
    const token = user ? user.jwt : null; // Get JWT token from user

    const {
      search = "", // Search term
      status = null, // Status filter
      isLate = null, // Late status filter
      bookName = "", // Book name filter
      userEmail = "", // User name filter
    } = searchParams;

    // Send request to fetch borrowed books with search parameters and pagination
    const response = await axios.get(API_URL, {
      params: {
        page,
        size,
        search,
        status,
        isLate,
        bookName,
        userEmail,
      },
      headers: {
        Authorization: `Bearer ${token}`, // Add token to the Authorization header
      },
    });

    return response.data; // Return API response data
  } catch (error) {
    console.error("Error fetching borrowed books list:", error);
    throw error; // Throw error if there's any issue
  }
};

export const getAllUserBorrowedBooks = async (page = 0, size = 10) => {
  try {
    const user = JSON.parse(localStorage.getItem("user")); // Lấy thông tin người dùng từ localStorage
    const token = user ? user.jwt : null; // Lấy token từ user (JWT token)

    // Gửi request lấy danh sách các sách đã mượn với các tham số phân trang
    const response = await axios.get(API_URL_USER, {
      params: { page, size },
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
      },
    });

    return response.data; // Trả về dữ liệu API
  } catch (error) {
    console.error("Lỗi khi lấy danh sách mượn sách:", error);
    throw error; // Ném lỗi nếu có vấn đề
  }
};
// Hàm cập nhật trạng thái trả sách
export const returnBorrowedBook = async (id) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    // Gửi request cập nhật trạng thái trả sách với ID sách mượn
    const response = await axios.put(
      `${API_URL}/${id}`,
      null, // Không cần gửi body nếu API không yêu cầu
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Trả về dữ liệu từ API sau khi cập nhật trạng thái trả sách
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái trả sách:", error);
    throw error; // Ném lỗi nếu có vấn đề
  }
};
// Hàm lấy giới hạn mượn sách của người dùng
export const getBorrowLimit = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    // Gửi request lấy giới hạn mượn sách
    const response = await axios.get(`${API_URL_USER}/limits`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Trả về dữ liệu API
  } catch (error) {
    console.error("Lỗi khi lấy giới hạn mượn sách:", error);
    throw error; // Ném lỗi nếu có vấn đề
  }
};
