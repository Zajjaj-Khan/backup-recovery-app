import { NativeModule, requireNativeModule } from 'expo';

import { BackgroundTaskModuleEvents } from './BackgroundTask.types';

declare class BackgroundTaskModule extends NativeModule<BackgroundTaskModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<BackgroundTaskModule>('BackgroundTask');
