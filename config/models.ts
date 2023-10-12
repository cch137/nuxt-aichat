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

export default [
  {
    name: 'GPT-3.5-Turbo',
    value: 'gpt3',
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: 2,
  },
  {
    name: 'GPT-4',
    value: 'gpt4',
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: 2,
  },
  {
    name: 'GPT-Web',
    value: 'gpt-web',
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: false,
    permissionLevel: 2,
    redirectTo: 'gpt3',
  },
  {
    name: 'Claude-2',
    value: 'claude-2',
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: 2,
  },
  {
    name: 'Claude-2 (Web)',
    value: 'claude-2-web',
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: 2,
  },
  {
    name: 'GPT-3.5-Turbo (stream)',
    value: 'gpt3-fga',
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: 2,
    redirectTo: 'gpt3',
  },
  {
    name: 'GPT-4 (stream)',
    value: 'gpt4-fga',
    isWebBrowsingOptional: false,
    isTemperatureOptional: true,
    isContextOptional: true,
    isStreamAvailable: true,
    permissionLevel: 2,
    redirectTo: 'gpt4',
  },
] as ModelType[]
