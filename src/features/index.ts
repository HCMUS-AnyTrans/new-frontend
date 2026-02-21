// Authentication (renamed from 'authentication' to 'auth')
export * from './auth';

// Marketing features
export * from './landing';
export * from './about';
export * from './pricing';
export * from './contact';

// App features
// Note: dashboard and documents have conflicting type exports (JobStatus, LanguageCode)
// Import them directly from their respective modules when needed
export * from './documents';
// Dashboard exports: use `import { ... } from '@/features/dashboard'` directly
// Settings exports: use `import { ... } from '@/features/settings'` directly
// History exports: use `import { ... } from '@/features/history'` directly
