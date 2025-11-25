// Opening Hours API Service
import api from "./api";
import type { OpeningHours, OpeningHoursStatus } from "../types/api.types";

export const openingHoursService = {
  // Get all opening hours
  async getAllOpeningHours(): Promise<OpeningHours[]> {
    return api.get<OpeningHours[]>("/opening-hours");
  },

  // Get current status (open/closed)
  async getCurrentStatus(): Promise<OpeningHoursStatus> {
    return api.get<OpeningHoursStatus>("/opening-hours/status");
  },

  // Get opening hours by day
  async getHoursByDay(day: string): Promise<OpeningHours> {
    return api.get<OpeningHours>(`/opening-hours/day/${day}`);
  },

  // Get opening hours by ID
  async getOpeningHoursById(id: string): Promise<OpeningHours> {
    return api.get<OpeningHours>(`/opening-hours/${id}`);
  },
};
