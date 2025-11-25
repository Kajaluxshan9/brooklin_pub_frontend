// Specials API Service
import api from "./api";
import type { Special } from "../types/api.types";

export const specialsService = {
  // Get all specials
  async getAllSpecials(): Promise<Special[]> {
    return api.get<Special[]>("/specials");
  },

  // Get only active specials
  async getActiveSpecials(): Promise<Special[]> {
    return api.get<Special[]>("/specials/active");
  },

  // Get special by ID
  async getSpecialById(id: string): Promise<Special> {
    return api.get<Special>(`/specials/${id}`);
  },
};
