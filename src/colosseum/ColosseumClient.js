export class ColosseumClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://agents.colosseum.com/api';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
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

  async getStatus() {
    return this.request('/agents/status');
  }

  async createProject(projectData) {
    return this.request('/my-project', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  }

  async updateProject(projectData) {
    return this.request('/my-project', {
      method: 'PUT',
      body: JSON.stringify(projectData)
    });
  }

  async submitProject() {
    return this.request('/my-project/submit', {
      method: 'POST'
    });
  }

  async createForumPost(title, body, tags = []) {
    return this.request('/forum/posts', {
      method: 'POST',
      body: JSON.stringify({ title, body, tags })
    });
  }

  async getForumPosts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/forum/posts?${query}`);
  }
}
