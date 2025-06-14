// src/config/api.config.ts
export const API_CONFIG = {
  BASE_URL: 'http://localhost:9428/api',
  ENDPOINTS: {
    PROFILES: '/profiles',
    QUIZZES: '/quizzes',
    QUESTIONS: '/questions',
    PAIRS: '/pairs',
    THEMES: '/themes',
    QUIZ_CONFIGS: '/quiz-configs'
  }
};

// Helper function to build URLs
export function buildApiUrl(endpoint: string, id?: string | number): string {
  const baseUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
  return id ? `${baseUrl}/${id}` : baseUrl;
}
