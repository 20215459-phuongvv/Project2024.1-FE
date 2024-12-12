import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}`;

// Get all books for the user with pagination
export const getAllBooks = async (
  page = 0,
  size = 6,
  title = "",
  authorId,
  publisherId,
  isAvailable
) => {
  try {
    const response = await axios.get(`${API_URL}/books`, {
      params: { page, size, title, authorId, publisherId, isAvailable },
    });
    return response.data; // Assuming response data has books and pagination details
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

// Add a book to borrow for the user
export const addBorrowBookForUser = async (bookId, numberOfDays) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.post(
      `${API_URL}/api/borrow`,
      { bookId, numberOfDays }, // Assuming you send the book ID in the body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error borrowing book:", error);
    throw error;
  }
};

// Update the user's profile
export const updateProfile = async (profileData) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.put(
      `${API_URL}/api/users/profile`,
      profileData, // The profile data to update
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Change the user's password
export const changePassword = async (password, newPassword) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.put(
      `${API_URL}/api/users/change-password`,
      { password, newPassword }, // The current and new password
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};
export const getCardInfo = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.get(`${API_URL}/api/subscription`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data; // Assuming the API returns the card info in the response body
  } catch (error) {
    console.error("Error fetching card info:", error);
    throw error;
  }
};
export const registerReadingCard = async (data) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.post(
      `${API_URL}/api/subscription/register`,
      data, // The profile data to update
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
