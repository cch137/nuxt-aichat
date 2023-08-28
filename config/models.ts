interface ModelType {
  name: string;
  value: string;
  isWebBrowsingOptional: boolean;
  isTemperatureOptional: boolean;
  isContextOptional: boolean;
  isStreamAvailable: boolean;
  permissionLevel: number;
}

export default [
  {
    name: 'GPT-3.5-Turbo',
    value: 'gpt3',
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: false,
    permissionLevel: 0,
  },
  {
    name: 'GPT-4',
    value: 'gpt4',
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: false,
    permissionLevel: 0,
  },
  {
    name: 'GPT-Web',
    value: 'gpt-web',
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: false,
    permissionLevel: 0,
  },
  {
    name: 'Claude-2',
    value: 'claude-2',
    isWebBrowsingOptional: false,
    isTemperatureOptional: false,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: 0,
  },
  {
    name: 'Claude-2 (Web)',
    value: 'claude-2-web',
    isWebBrowsingOptional: false,
    isTemperatureOptional: false,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: 0,
  },
  {
    name: 'GPT-3.5-Turbo (stream)',
    value: 'gpt3-fga',
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: 0,
  },
  {
    name: 'GPT-4 (stream)',
    value: 'gpt4-fga',
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: 2,
  },
] as ModelType[]