// Reexport the native module. On web, it will be resolved to BackgroundTaskModule.web.ts
// and on native platforms to BackgroundTaskModule.ts
export * from './src/BackgroundTask.types';
export { default } from './src/BackgroundTaskModule';

