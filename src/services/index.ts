// API service modules for microservice integration
// Example service structure

export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export class ApiService {
  private baseURL: string

  constructor(baseURL: string = import.meta.env.VITE_API_BASE_URL || '/api') {
    this.baseURL = baseURL
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`)
    return response.json()
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return response.json()
  }
}

export const apiService = new ApiService()

