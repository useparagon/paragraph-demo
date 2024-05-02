import {
  EventStep,
  FunctionStep,
  UnselectedStep,
  Workflow,
} from '@useparagon/core';
import { IContext } from '@useparagon/core/execution';
import { IPersona } from '@useparagon/core/persona';
import { ConditionalInput } from '@useparagon/core/steps/library/conditional';
import { IConnectUser, IPermissionContext } from '@useparagon/core/user';
import {
  IMicrosoftTeamsIntegration,
  InputResultMap,
  createInputs,
} from '@useparagon/integrations/microsoftTeams';

import workRequestEvent from '../../../events/workRequest';
import personaMeta from '../../../persona.meta';
import integrationInputs from '../inputs';

/**
 * Notify Teams of Work Requests Workflow implementation
 */
export default class extends Workflow<
  IMicrosoftTeamsIntegration,
  IPersona<typeof personaMeta>,
  InputResultMap
> {
  /**
   * Define workflow steps and orchestration.
   */
  define(
    integration: IMicrosoftTeamsIntegration,
    context: IContext<InputResultMap>,
    connectUser: IConnectUser<IPersona<typeof personaMeta>>,
  ) {
    const triggerStep = new EventStep(workRequestEvent);

    const sendMessageStep = integration.actions.teamsSendMessageInChat(
      {
        message: `${triggerStep.output.SubmitterName} sent a request: ${triggerStep.output.WorkRequestURL}`,
        chatRecipient: context.getInput(integrationInputs.channel).channel,
      },
      { description: 'Send Message' },
    );

    triggerStep.nextStep(sendMessageStep);

    /**
     * Pass all steps used in the workflow to the `.register()`
     * function. The keys used in this function must remain stable.
     */
    return this.register({ triggerStep, sendMessageStep });
  }

  /**
   * The name of the workflow, used in the Dashboard and Connect Portal.
   */
  name: string = 'Notify Teams of Work Requests';

  /**
   * A user-facing description of the workflow shown in the Connect Portal.
   */
  description: string = 'Add a user-facing description of this workflow';

  /**
   * Define workflow-level User Settings. For integration-level User
   * Settings, see ../config.ts.
   * https://docs.useparagon.com/connect-portal/workflow-user-settings
   */
  inputs = createInputs({});

  /**
   * If set to true, the workflow will appear as enabled by default once
   * a user connects their account to the integration.
   * https://docs.useparagon.com/connect-portal/displaying-workflows#default-to-enabled
   */
  defaultEnabled: boolean = false;

  /**
   * If set to true, the workflow will be hidden from all users from the
   * Connect Portal.
   * https://docs.useparagon.com/connect-portal/displaying-workflows#hide-workflow-from-portal-for-all-users
   */
  hidden: boolean = false;

  /**
   * You can restrict the visibility of this workflow to specific users
   * with Workflow Permissions.
   * https://docs.useparagon.com/connect-portal/workflow-permissions
   */
  definePermissions(
    connectUser: IPermissionContext<IPersona<typeof personaMeta>>,
  ): ConditionalInput | undefined {
    return undefined;
  }

  /**
   * This property is maintained by Paragon. Do not edit this property.
   */
  readonly id: string = '142376f0-b90d-4276-8506-c2cc1116f0a7';
}
