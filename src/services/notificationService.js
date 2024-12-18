import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}`;

// Đăng ký nhận thông báo từ sách
export const subscribeToBook = async (bookId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.post(
      `${API_URL}/api/notifications/subscribe`,
      { bookId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error subscribing to book:", error);
    throw error;
  }
};

// Hủy đăng ký nhận thông báo từ sách
export const unsubscribeFromBook = async (bookId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.delete(
      `${API_URL}/api/notifications/unsubscribe`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { bookId }, // Gửi ID sách trong body của yêu cầu DELETE
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error unsubscribing from book:", error);
    throw error;
  }
};

// Lấy danh sách các sách đã đăng ký thông báo
export const getSubscriptions = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.get(`${API_URL}/api/notifications/subscribe`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return [];
  }
};

// Lấy danh sách thông báo
export const getNotifications = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.get(`${API_URL}/api/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

// Đánh dấu thông báo đã đọc
export const markNotificationsAsRead = async (userId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.put(
      `${API_URL}/api/notifications/${userId}/read`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    throw error;
  }
};
