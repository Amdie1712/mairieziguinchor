/**
 * Centralized API configuration for the application.
 */

export const BASE_URL = '';
export const API_PREFIX = '/api';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_PREFIX}/auth/login`,
        REGISTER: `${API_PREFIX}/auth/register`,
        ME: `${API_PREFIX}/auth/me`,
        USERS: `${API_PREFIX}/auth/users`,
    },
    ARTICLES: {
        BASE: `${API_PREFIX}/articles`,
        LATEST: `${API_PREFIX}/articles/latest`,
    },
    EVENTS: {
        BASE: `${API_PREFIX}/events`,
    },
    COUNCIL: {
        MEMBERS: `${API_PREFIX}/council/members`,
        SESSIONS: `${API_PREFIX}/council/sessions`,
    },
    REPORTS: {
        BASE: `${API_PREFIX}/reports`,
    },
    MESSAGES: {
        BASE: `${API_PREFIX}/messages`,
    },
    DOSSIERS: {
        BASE: `${API_PREFIX}/dossiers`,
        MY: `${API_PREFIX}/dossiers/my`,
    },
    PROJECTS: {
        BASE: `${API_PREFIX}/projects`,
        STATS: `${API_PREFIX}/projects/stats`,
        TYPE: (type: string) => `${API_PREFIX}/projects/type/${type}`,
    },
    CONTENT: {
        SERVICES: `${API_PREFIX}/content/services`,
        DOCUMENTS: `${API_PREFIX}/content/documents`,
        PROCEDURES: `${API_PREFIX}/content/procedures`,
        PROJECTS: `${API_PREFIX}/content/projects`,
        NEIGHBORHOODS: `${API_PREFIX}/content/neighborhoods`,
        ABOUT: `${API_PREFIX}/content/about`,
        ABOUT_STATS: `${API_PREFIX}/content/about-stats`,
        IMAGES: `${API_PREFIX}/content/images`,
        SYSTEM_IMAGES: `${API_PREFIX}/content/system-images`,
        SEED: `${API_PREFIX}/content/seed`,
    },
    PARTICIPATION: {
        PROJECTS: `${API_PREFIX}/participation/projects`,
        CONTRIBUTE: `${API_PREFIX}/participation/contribute`,
    }
};
