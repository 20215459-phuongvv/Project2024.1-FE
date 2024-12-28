import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/admin/settings`;

export const addVipUserLimit = async (value) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.put(
      `${API_URL}/vip-user-limit`,
      { value },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error adding VIP user limit:", error);
    throw error;
  }
};

export const addNormalUserLimit = async (value) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.put(
      `${API_URL}/normal-user-limit`,
      { value },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error adding normal user limit:", error);
    throw error;
  }
};

export const addMonthlyCardPrice = async (value) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.put(
      `${API_URL}/monthly-card-price`,
      { value },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error adding normal user limit:", error);
    throw error;
  }
};

export const addYearlyCardPrice = async (value) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.put(
      `${API_URL}/yearly-card-price`,
      { value },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error adding normal user limit:", error);
    throw error;
  }
};

export const addUpgradeVipPrice = async (value) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.put(
      `${API_URL}/upgrade-vip-price`,
      { value },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; 
  } catch (error) {
    console.error("Error adding normal user limit:", error);
    throw error; 
  }
};

export const getSetting = async (key) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.jwt : null;

    const response = await axios.get(`${API_URL}/${key}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.data.value;
  } catch (error) {
    console.error("Error getting setting:", error);
    throw error;
  }
}
