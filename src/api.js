import axios from "axios";

export const fetchDataFromApi = async (url) => {
  try {
    const { data } = await axios.get("https://shop-server-btcc.onrender.com" + url);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};


export const postData = async (url, fromdata) => {
  try {
    const { data } = await axios.post("https://shop-server-btcc.onrender.com" + url, fromdata);
    return data;
  } catch (error) {
    console.error("POST Error:", error.response?.data || error.message);
    throw error;
  }
};


export const Deletedata = async (url) => {
  try{
    const { data } = await axios.delete(`https://shop-server-btcc.onrender.com${url}`);
    return data
  }catch (error) {
    console.error ("Delete Error:-", error.response?.data || error.message);
    throw error
  }
}

// http://localhost:4000
// https://shop-server-btcc.onrender.com
