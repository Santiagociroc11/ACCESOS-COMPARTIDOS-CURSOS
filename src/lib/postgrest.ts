interface PostgrestConfig {
  url: string;
  apiKey?: string;
}

interface PostgrestError {
  message: string;
  details?: string;
  code?: string;
}

class PostgRESTClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(config: PostgrestConfig) {
    this.baseUrl = config.url.replace(/\/$/, ''); // Remove trailing slash
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (config.apiKey) {
      this.headers['Authorization'] = `Bearer ${config.apiKey}`;
    }

    // Add https:// if no protocol is specified
    if (!this.baseUrl.startsWith('http://') && !this.baseUrl.startsWith('https://')) {
      this.baseUrl = `https://${this.baseUrl}`;
    }

    console.log('PostgREST Client initialized with baseUrl:', this.baseUrl);
    console.log('PostgREST Client headers:', this.headers);
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<{ data: T | null; error: PostgrestError | null }> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const requestOptions = {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
      };

      console.log('=== PostgREST Request Debug ===');
      console.log('Method:', options.method || 'GET');
      console.log('URL:', url);
      console.log('Headers:', requestOptions.headers);
      console.log('Body:', options.body);
      console.log('================================');
      
      const response = await fetch(url, requestOptions);

      console.log('=== PostgREST Response Debug ===');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error Response Body:', errorText);
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch {
          // If not JSON, use the raw text or fallback message
          errorMessage = errorText || errorMessage;
        }

        return {
          data: null,
          error: {
            message: errorMessage,
            code: response.status.toString(),
          },
        };
      }

      const data = await response.text();
      const parsedData = data ? JSON.parse(data) : null;
      console.log('Success Response Body:', parsedData);
      console.log('=================================');
      
      return {
        data: parsedData,
        error: null,
      };
    } catch (error) {
      console.error('PostgREST Network error:', error);
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        },
      };
    }
  }

  // Simulate Supabase's table selection
  from(table: string) {
    return {
      select: (columns: string = '*') => ({
        order: (column: string, options?: { ascending?: boolean }) => ({
          execute: async () => {
            const orderParam = options?.ascending === false ? `${column}.desc` : `${column}.asc`;
            return this.request(`/${table}?select=${columns}&order=${orderParam}`);
          },
        }),
        execute: async () => {
          return this.request(`/${table}?select=${columns}`);
        },
      }),

      insert: (data: any[]) => ({
        execute: async () => {
          console.log('Attempting to insert data:', data);
          return this.request(`/${table}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Prefer': 'return=representation',
            },
          });
        },
      }),

      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          execute: async () => {
            console.log('Attempting to update data:', data, 'where', column, '=', value);
            return this.request(`/${table}?${column}=eq.${value}`, {
              method: 'PATCH',
              body: JSON.stringify(data),
              headers: {
                'Prefer': 'return=representation',
              },
            });
          },
        }),
      }),

      delete: () => ({
        eq: (column: string, value: any) => ({
          execute: async () => {
            console.log('Attempting to delete where', column, '=', value);
            return this.request(`/${table}?${column}=eq.${value}`, {
              method: 'DELETE',
            });
          },
        }),
      }),
    };
  }
}

// Configuration
const postgrestUrl = import.meta.env.VITE_POSTGREST_URL;
const postgrestApiKey = import.meta.env.VITE_POSTGREST_API_KEY;

export const postgrest = new PostgRESTClient({
  url: postgrestUrl,
  apiKey: postgrestApiKey,
}); 