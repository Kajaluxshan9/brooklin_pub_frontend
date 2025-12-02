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
  cvFile?: File;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const contactService = {
  /**
   * Submit the contact form to the backend
   * @param formData - The contact form data
   * @returns Promise with success status and message
   */
  async submitContactForm(formData: ContactFormData): Promise<ContactResponse> {
    // If there's a CV file, use FormData for multipart upload
    if (formData.cvFile) {
      const multipartData = new FormData();
      multipartData.append("name", formData.name);
      multipartData.append("email", formData.email);
      if (formData.phone) multipartData.append("phone", formData.phone);
      multipartData.append("subject", formData.subject);
      multipartData.append("message", formData.message);
      if (formData.position)
        multipartData.append("position", formData.position);
      multipartData.append("cvFile", formData.cvFile);

      // Use fetch directly for multipart form data (don't set Content-Type header, browser sets it with boundary)
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        body: multipartData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return response.json();
    }

    return api.post<ContactResponse>("/contact", formData);
  },
};
