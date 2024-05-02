import {
  ConditionalStep,
  IntegrationRequestStep,
  RequestStep,
  Workflow,
} from '@useparagon/core';
import { IContext } from '@useparagon/core/execution';
import * as Operators from '@useparagon/core/operator';
import { IPersona } from '@useparagon/core/persona';
import { ConditionalInput } from '@useparagon/core/steps/library/conditional';
import { IConnectUser, IPermissionContext } from '@useparagon/core/user';
import {
  ISalesforceIntegration,
  InputResultMap,
  createInputs,
} from '@useparagon/integrations/salesforce';

import personaMeta from '../../../persona.meta';
import sharedInputs from '../inputs';

/**
 * Sync contacts from Salesforce Workflow implementation
 */
export default class extends Workflow<
  ISalesforceIntegration,
  IPersona<typeof personaMeta>,
  InputResultMap
> {
  /**
   * Define workflow steps and orchestration.
   */
  define(
    integration: ISalesforceIntegration,
    context: IContext<InputResultMap>,
    connectUser: IConnectUser<IPersona<typeof personaMeta>>,
  ) {
    const triggerStep = integration.triggers.recordCreated({
      recordType: 'Contact',
      recordsFilterFormula: undefined,
      objectMapping: `${context.getInput(sharedInputs.field_mapping).record_type}`,
    });

    const requestStep = new RequestStep({
      autoRetry: false,
      continueWorkflowOnError: false,
      description: 'Search By Email',
      url: `https://api.myapp.io/api/contacts?email=${triggerStep.output.contact.email}`,
      method: 'GET',
      params: {},
      headers: {},
    });

    const ifelseStep = new ConditionalStep({
      if: Operators.ArrayIsNotEmpty(requestStep.output.response.body.data),
      description: 'Check If Exists',
    });

    const updateContactStep = new RequestStep({
      autoRetry: false,
      continueWorkflowOnError: false,
      description: 'Update Contact',
      url: `https://api.myapp.io/api/contacts`,
      method: 'PATCH',
      params: {},
      headers: {},
      authorization: {
        type: 'bearer',
        token: `${context.getEnvironmentSecret('API_SECRET')}`,
      },
      body: {
        user_id: connectUser.userId,
        contact: `${triggerStep.output.result}`,
        contact_id: `${requestStep.output.response.body['0'].id}`,
      },
      bodyType: 'json',
    });

    const createContactStep = new RequestStep({
      autoRetry: false,
      continueWorkflowOnError: false,
      description: 'Create Contact',
      url: `https://api.myapp.io/api/contacts`,
      method: 'POST',
      params: {},
      headers: {},
      authorization: {
        type: 'bearer',
        token: `${context.getEnvironmentSecret('API_SECRET')}`,
      },
      body: { user_id: connectUser.userId, contact: triggerStep.output.result },
      bodyType: 'json',
    });

    const integrationRequestStep = new IntegrationRequestStep({
      autoRetry: true,
      continueWorkflowOnError: false,
      description: 'Search Deals in Stages',
      method: 'POST',
      url: (pageToken: string) =>
        `/crm/v3/objects/deals/search?q=testquery is ${pageToken}`,
      params: { q: (pageToken: string) => `testquery is ${pageToken}` },
      headers: { 'Content-Type': 'application/json' },
      body: { limit: '2', after: (pageToken: string) => `${pageToken}` },
      bodyType: 'json',
      pagination: (currentStep) => ({
        pageToken: `${currentStep.output.response.body.paging.next.after}`,
        outputPath: `${currentStep.output.response.body.results}`,
        stopCondition: Operators.DoesNotExist(
          `${currentStep.output.response.body.paging.next.after}`,
        ),
      }),
    });

    triggerStep
      .nextStep(requestStep)
      .nextStep(
        ifelseStep.whenTrue(updateContactStep).whenFalse(createContactStep),
      )
      .nextStep(integrationRequestStep);

    /**
     * Pass all steps used in the workflow to the `.register()`
     * function. The keys used in this function must remain stable.
     */
    return this.register({
      triggerStep,
      requestStep,
      ifelseStep,
      updateContactStep,
      createContactStep,
      integrationRequestStep,
    });
  }

  /**
   * The name of the workflow, used in the Dashboard and Connect Portal.
   */
  name: string = 'Sync contacts from Salesforce';

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
  readonly id: string = 'd82119e3-ede9-4aa5-8883-a8ae0b846450';
}
