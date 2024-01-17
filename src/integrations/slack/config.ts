import { IIntegrationConfig } from '@useparagon/core/integration';

/**
 * configuration for a slack
 */
const config: IIntegrationConfig = {
  description: 'Send notifications to Slack',
  overviewText:
    'Connect your Slack workspace to receive notifications and alerts in Slack. Stay connected to important activity by bringing it all together in your Slack workspace.\n       \n\nOur Slack integration enables you to:\n   \n\n• Receive alerts and notifications in your Slack workspace\n• Notify or DM specific team members based on certain activity',
  showWatermark: true,
};

export default config;
