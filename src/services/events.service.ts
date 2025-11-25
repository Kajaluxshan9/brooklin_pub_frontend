// Events API Service
import api from "./api";
import type { Event } from "../types/api.types";

export const eventsService = {
  // Get all events
  async getAllEvents(): Promise<Event[]> {
    return api.get<Event[]>("/events");
  },

  // Get only active events
  async getActiveEvents(): Promise<Event[]> {
    return api.get<Event[]>("/events/active");
  },

  // Get upcoming events
  async getUpcomingEvents(): Promise<Event[]> {
    return api.get<Event[]>("/events/upcoming");
  },

  // Get event by ID
  async getEventById(id: string): Promise<Event> {
    return api.get<Event>(`/events/${id}`);
  },
};
