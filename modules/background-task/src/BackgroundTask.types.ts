
export type OnLoadEventPayload = {
  url: string;
};

export type BackgroundTaskModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

