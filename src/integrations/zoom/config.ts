import { IIntegrationConfig } from '@useparagon/core/integration';

/**
 * configuration for a zoom
 */
const config: IIntegrationConfig = {
  description: 'Sync meetings with Zoom',
  overviewText: `Connect your Zoom account to create new Zoom meetings or create and update meeting registrants. Keep your meetings and events in sync with Zoom - without manual data entry.

    
Our Zoom integration enables you to:
  
• Automatically create or update meetings in Zoom
• Create or update Zoom meeting registrants
• Receive updates when your Zoom meetings are created or updated`,
  showWatermark: true,
  workflowDisplayOrder: [],
};

export default config;
