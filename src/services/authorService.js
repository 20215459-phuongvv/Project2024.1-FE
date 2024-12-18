import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}`;

// Lấy tất cả tác giả với phân trang và tìm kiếm
export const getAllAuthors = async (page = 1, size = 5, name = "") => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.get(`${API_URL}/authors`, {
      params: { page, size, name },
      headers: {
        Authorization: token ? `Bearer ${token}` : null,
      },
    });

    return response.data; // Dữ liệu trả về có trong `data`
  } catch (error) {
    console.error("Error fetching authors:", error);
    return {
      authors: [],
      currentPage: 1,
      totalPages: 1,
      totalAuthors: 0,
    };
  }
};

// Thêm tác giả mới
export const addAuthor = async (authorData) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.post(
      `${API_URL}/api/admin/authors`,
      authorData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error adding author:", error);
    throw error;
  }
};

// Cập nhật tác giả
export const updateAuthor = async (authorData) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.put(
      `${API_URL}/api/admin/authors`,
      authorData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating author:", error);
    throw error;
  }
};

// Xóa tác giả
export const deleteAuthor = async (authorId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.delete(`${API_URL}/api/admin/authors`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: authorId, // Truyền `id` trong body
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting author:", error);
    throw error;
  }
};
