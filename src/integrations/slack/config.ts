import { IIntegrationConfig } from '@useparagon/core/integration';

/**
 * configuration for a slack
 */
const config: IIntegrationConfig = {
  description: 'Send notifications to Slack',
  overviewText: `Connect your Slack workspace to receive notifications and alerts in Slack. Stay connected to important activity by bringing it all together in your Slack workspace.
       

Our Slack integration enables you to:
   

• Receive alerts and notifications in your Slack workspace
• Notify or DM specific team members based on certain activity`,
  showWatermark: true,
  workflowDisplayOrder: [],
};

export default config;
