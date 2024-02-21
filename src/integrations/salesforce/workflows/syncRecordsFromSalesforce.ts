import { RequestStep, Workflow } from '@useparagon/core';
import { IContext } from '@useparagon/core/execution';
import { IPersona } from '@useparagon/core/persona';
import { ConditionalInput } from '@useparagon/core/steps/library/conditional';
import { IConnectUser, IPermissionContext } from '@useparagon/core/user';
import {
  ISalesforceIntegration,
  InputResultMap,
  createInputs,
} from '@useparagon/types/salesforce';

import personaMeta from '../../../persona.meta';

/**
 * define inputs here which can be used in this workflow only
 */
const inputs = createInputs({});

/**
 * Sync records from Salesforce Workflow implementation
 */
export default class extends Workflow<
  ISalesforceIntegration,
  IPersona<typeof personaMeta>,
  InputResultMap
> {
  /**
   * This property is maintained by Paragon. Do not edit this property.
   */
  readonly id: string = 'd82119e3-ede9-4aa5-8883-a8ae0b84645d';

  /**
   * name shown in workflow editor
   */
  name: string = 'Sync records from Salesforce';

  /**
   * description shown in connect portal for workflow
   */
  description: string = 'Add a user-facing description of this workflow';

  /**
   * inputs used in workflows
   */
  inputs = inputs;

  /**
   * if set to true , workflow will be automatically be enabled
   * after integration connect
   */
  defaultEnabled: boolean = false;

  /**
   * if true , workflow will be hidden from connect portal
   */
  hidden: boolean = false;

  /**
   * defines the workflow
   * @param integration
   * @param context
   * @param user
   */
  define(
    integration: ISalesforceIntegration,
    context: IContext<InputResultMap>,
    connectUser: IConnectUser<IPersona<typeof personaMeta>>,
  ) {
    /**
     * declare all steps here
     */

    const triggerStep = integration.withTrigger(
      integration.triggers.SALESFORCE_TRIGGER_RECORD_CREATED,
      {
        recordType: "Contact"
      },
    );

    const sendToMyAPI = new RequestStep({
      method: "POST",
      url: `https://api.myapp.io/api/contacts`,
      authorization: {
        // @ts-expect-error
        type: "bearer",
        token: context.getEnvironmentSecret("API_SECRET")
      },
      body: {
        user_id: connectUser.userId,
        contact: triggerStep.output.result
      },
      description: "Send to my API"
    });
    /**
     * chain steps correctly here
     */

    triggerStep.nextStep(sendToMyAPI);

    /**
     * pass all steps here so that paragon can keep track of changes
     */
    return this.register({ triggerStep, sendToMyAPI });
  }

  /**
   * define permissions for workflow
   * @param context
   */
  definePermissions(
    connectUser: IPermissionContext<IPersona<typeof personaMeta>>,
  ): ConditionalInput | undefined {
    return undefined;
  }
}
