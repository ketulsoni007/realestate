import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  API_URL: string,
  IMAGE_URL: string,
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'Estate',
  appVersion: packageJson.version,
  API_URL: "http://localhost:8080/api/v1/admin",
  IMAGE_URL: "http://localhost:8080/images",
};

export const config: ConfigValue = {
  appName: 'Estate',
  appVersion: packageJson.version,
  API_URL: "http://localhost:8080/api/v1/admin",
  IMAGE_URL: "http://localhost:8080/images",
};
