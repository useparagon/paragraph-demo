import { IIntegrationConfig } from '@useparagon/core/integration';

/**
 * configuration for a googledrive
 */
const config: IIntegrationConfig = {
  description: 'Save files to Google Drive',
  overviewText: `Connect your Google account and sync files from your Google Drive.

Our Google Drive integration enables you to:

• Save files to your Google Drive
• Sync files from your Google Drive`,
  showWatermark: true,
  workflowDisplayOrder: [],
};

export default config;
