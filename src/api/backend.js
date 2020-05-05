import axios from "axios";

const baseURL = process.env.REACT_APP_BACKEND_URL;

const selectData = ({ data }) => data;

export const http = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

export const fetchUser = ({ username }, options = {}) =>
  http.get(`/user?username=${username}`, options).then(selectData);

export const searchPhotos = ({ search }, options = {}) =>
  http.get(`/search?search=${search}`, options).then(selectData);

export const classifyPhoto = ({ photo, results }, options = {}) =>
  http.post(
    "/classify",
    {
      photo,
      classification: {
        results,
        validation: "good"
      }
    },
    options
  );

export const fetchClassifiedPhotos = (options) =>
  http.get("/classified", options).then(selectData);
