import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/admin/settings`;

// Add VIP User Limit
export const addVipUserLimit = async (value) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.post(
      `${API_URL}/vip-user-limit`,
      { value }, // Payload with the value
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Return the API response
  } catch (error) {
    console.error("Error adding VIP user limit:", error);
    throw error; // Re-throw error to handle it in the calling code
  }
};

// Add Normal User Limit
export const addNormalUserLimit = async (value) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.post(
      `${API_URL}/normal-user-limit`,
      { value }, // Payload with the value
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Return the API response
  } catch (error) {
    console.error("Error adding normal user limit:", error);
    throw error; // Re-throw error to handle it in the calling code
  }
};
