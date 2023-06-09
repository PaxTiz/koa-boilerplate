import { apiUrl } from "./constants";

export const customFetch = (method: string, url: string, body?: any) => {
  return fetch(apiUrl(url), {
    method,
    body,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
