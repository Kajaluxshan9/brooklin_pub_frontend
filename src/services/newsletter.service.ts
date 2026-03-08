import api from "./api";

export const newsletterService = {
  subscribe: (email: string) =>
    api.post<{ message: string }>("/newsletter/subscribe", { email }),

  unsubscribe: (token: string) =>
    api.get<{ message: string }>(`/newsletter/unsubscribe?token=${encodeURIComponent(token)}`),
};
