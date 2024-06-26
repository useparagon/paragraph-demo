import { IIntegrationConfig } from '@useparagon/core/integration';

/**
 * configuration for a hubspot
 */
const config: IIntegrationConfig = {
  description: 'Sync records from HubSpot',
  overviewText: `Connect your HubSpot account to sync records from your HubSpot CRM. Enable your sales team to close more deals by keeping your HubSpot CRM records up to date - without manual data entry.  
         

Our HubSpot integration enables you to:  
     

• Automatically create or update records like contacts or deals in HubSpot  
• Sync records from HubSpot  
• Receive updates when new records are created in HubSpot`,
  showWatermark: true,
  workflowDisplayOrder: [],
};

export default config;
