interface ModelType {
  name: string;
  value: string;
  isWebBrowsingOptional: boolean;
  isTemperatureOptional: boolean;
  isContextOptional: boolean;
  isStreamAvailable: boolean;
  permissionLevel: number;
  redirectTo: string;
}

const MIN_LEVEL = 0;

export default [
  {
    name: 'GPT-3.5-Turbo',
    value: 'gpt3',
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: MIN_LEVEL,
  },
  {
    name: 'GPT-4',
    value: 'gpt4',
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: MIN_LEVEL,
  },
  {
    name: 'GPT-Web',
    value: 'gpt-web',
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: false,
    permissionLevel: MIN_LEVEL,
    redirectTo: 'gpt3',
  },
  {
    name: 'Claude-2',
    value: 'claude-2',
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: MIN_LEVEL,
  },
  {
    name: 'Claude-2 (Web)',
    value: 'claude-2-web',
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: MIN_LEVEL,
  },
  {
    name: 'GPT-3.5-Turbo (stream)',
    value: 'gpt3-fga',
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: MIN_LEVEL,
    redirectTo: 'gpt3',
  },
  {
    name: 'GPT-4 (stream)',
    value: 'gpt4-fga',
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: MIN_LEVEL,
    redirectTo: 'gpt4',
  },
] as ModelType[]
