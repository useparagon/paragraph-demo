import { ConditionalStep, RequestStep, Workflow } from '@useparagon/core';
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
   * asdfasdf
   */
  define(
    integration: ISalesforceIntegration,
    context: IContext<InputResultMap>,
    connectUser: IConnectUser<IPersona<typeof personaMeta>>,
  ) {
    const triggerStep = integration.triggers.recordCreated({
      recordType: 'Contact',
      recordsFilterFormula: undefined,
    });

    const searchByEmailStep = new RequestStep({
      url: `https://api.myapp.io/api/contacts?email=${triggerStep.output.contact.email}`,
      method: 'GET',
      params: {},
      headers: {},
      description: 'Search By Email',
      autoRetry: false,
      continueWorkflowOnError: false,
    });

    const contactExistsCondition = new ConditionalStep({
      if: Operators.ArrayIsNotEmpty(
        searchByEmailStep.output.response.body.data,
      ),
      description: 'Check If Exists',
    });

    const createContactStep = new RequestStep({
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
      autoRetry: false,
      continueWorkflowOnError: false,
    });

    const updateContactStep = new RequestStep({
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
        contact_id: `${searchByEmailStep.output.response.body[0].id}`,
      },
      bodyType: 'json',
      autoRetry: false,
      continueWorkflowOnError: false,
    });

    triggerStep
      .nextStep(searchByEmailStep)
      .nextStep(
        contactExistsCondition
          .whenTrue(updateContactStep)
          .whenFalse(createContactStep),
      );

    /**
     * Pass all steps used in the workflow to the `.register()`
     * function. The keys used in this function must remain stable.
     */
    return this.register({
      triggerStep,
      searchByEmailStep,
      contactExistsCondition,
      createContactStep,
      updateContactStep,
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
