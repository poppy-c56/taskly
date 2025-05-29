import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const API_URL =   "http://localhost:8800/api";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include", 
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api", 
  baseQuery,
  tagTypes: ["User", "Task"],
  endpoints: (builder) => ({}),
});

export default apiSlice;
