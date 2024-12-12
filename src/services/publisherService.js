import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}`;

// Lấy tất cả nhà xuất bản với phân trang và tìm kiếm
export const getAllPublishers = async (page = 1, size = 5, name = "") => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.get(`${API_URL}/publishers`, {
      params: { page, size, name },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Dữ liệu trả về có trong `data`
  } catch (error) {
    console.error("Error fetching publishers:", error);
    return {
      publishers: [],
      currentPage: 1,
      totalPages: 1,
      totalPublishers: 0,
    };
  }
};

// Thêm nhà xuất bản mới
export const addPublisher = async (publisherData) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.post(
      `${API_URL}/api/admin/publishers`,
      publisherData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error adding publisher:", error);
    throw error;
  }
};

// Cập nhật nhà xuất bản
export const updatePublisher = async (publisherData) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.put(
      `${API_URL}/api/admin/publishers`,
      publisherData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating publisher:", error);
    throw error;
  }
};

// Xóa nhà xuất bản
export const deletePublisher = async (publisherId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.delete(`${API_URL}/api/admin/publishers`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: publisherId, // Truyền `id` trong body
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting publisher:", error);
    throw error;
  }
};
