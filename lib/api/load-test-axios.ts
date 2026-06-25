import axios from "axios"

export const loadTestApi = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_LOAD_TEST_API_URL ??
    "http://localhost:18080/api/v1",
  headers: { "Content-Type": "application/json" },
})
