// API Configuration and Utilities
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

/**
 * Helper function to get the full URL for an image.
 * Handles both relative paths (from local storage) and absolute URLs (legacy S3).
 * @param url - The image URL (can be relative like /uploads/... or absolute https://...)
 * @returns The full URL to access the image
 */
export const getImageUrl = (url: string | undefined | null): string => {
  if (!url) return '';

  // If it's already an absolute URL (http:// or https://), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it's a data URL (base64), return as-is
  if (url.startsWith('data:')) {
    return url;
  }

  // If it's a relative path starting with /, prepend the API base URL
  if (url.startsWith('/')) {
    return `${API_BASE_URL}${url}`;
  }

  // Otherwise, assume it's a relative path and prepend API base URL with /
  return `${API_BASE_URL}/${url}`;
};

export interface ApiError {
  message: string;
  statusCode?: number;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        message: `HTTP error! status: ${response.status}`,
        statusCode: response.status,
      };
      try {
        const errorData = await response.json();
        error.message = errorData.message || error.message;
      } catch {
        // If JSON parsing fails, use default message
      }
      throw error;
    }
    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return this.handleResponse<T>(response);
  }
}

export const api = new ApiService(API_BASE_URL);
export default api;
