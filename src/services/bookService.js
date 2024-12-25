import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}`;

// Lấy tất cả sách với phân trang
export const getAllBooks = async (
  page = 0,
  size = 5,
  title = "",
  authorId,
  publisherId,
  status
) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.get(`${API_URL}/api/admin/books`, {
      params: { page, size, title, authorId, publisherId, status },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Giả sử dữ liệu trả về có trong `data`
  } catch (error) {
    console.error("Error fetching books:", error);
    return {
      books: [],
      currentPage: 0,
      totalPages: 1,
      totalBooks: 0,
    };
  }
};

// Thêm sách mới
export const addBook = async (formData) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.post(`${API_URL}/api/admin/books`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
};

// Cập nhật sách
export const updateBook = async (formData) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.put(`${API_URL}/api/admin/books`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Đảm bảo gửi dữ liệu dưới dạng form data
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

export const deleteBooks = async (idList) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.delete(`${API_URL}/api/admin/books`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Đảm bảo gửi dữ liệu dưới dạng JSON
      },
      data: idList, // Truyền danh sách ID sách trong body của yêu cầu DELETE
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting books:", error);
    throw error;
  }
};
export const subscribeToBook = async (bookId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.post(
      `${API_URL}/api/notifications/subscribe`,
      { bookId }, // Payload body with bookId
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Return API response
  } catch (error) {
    console.error("Error subscribing to book notifications:", error);
    throw error;
  }
};
export const unSubscribeToBook = async (bookId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.delete(`${API_URL}/api/notifications/unsubscribe`, {
      data: { bookId },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });


    return response.data; // Return API response
  } catch (error) {
    console.error("Error subscribing to book notifications:", error);
    throw error;
  }
};
