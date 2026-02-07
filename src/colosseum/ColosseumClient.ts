interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export class ColosseumClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://agents.colosseum.com/api';
  }

  async request(endpoint: string, options: RequestOptions = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getStatus(): Promise<any> {
    return this.request('/agents/status');
  }

  async createProject(projectData: any): Promise<any> {
    return this.request('/my-project', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  }

  async updateProject(projectData: any): Promise<any> {
    return this.request('/my-project', {
      method: 'PUT',
      body: JSON.stringify(projectData)
    });
  }

  async submitProject(): Promise<any> {
    return this.request('/my-project/submit', {
      method: 'POST'
    });
  }

  async createForumPost(title: string, body: string, tags: string[] = []): Promise<any> {
    return this.request('/forum/posts', {
      method: 'POST',
      body: JSON.stringify({ title, body, tags })
    });
  }

  async getForumPosts(params: Record<string, any> = {}): Promise<any> {
    const query = new URLSearchParams(params).toString();
    return this.request(`/forum/posts?${query}`);
  }
}
