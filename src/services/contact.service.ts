import api from "./api";

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  reservationDate?: string;
  reservationTime?: string;
  guestCount?: number;
  position?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export const contactService = {
  /**
   * Submit the contact form to the backend
   * @param formData - The contact form data
   * @returns Promise with success status and message
   */
  async submitContactForm(formData: ContactFormData): Promise<ContactResponse> {
    return api.post<ContactResponse>("/contact", formData);
  },
};

export default contactService;
