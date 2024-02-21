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
 * Use `inputs` to define Workflow Settings.
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


  name: string = 'Sync records from Salesforce';
  description: string = 'Add a user-facing description of this workflow';

  inputs = inputs;
  defaultEnabled: boolean = false;
  hidden: boolean = false;

  /**
   * Define workflow steps and orchestration.
   */
  define(
    integration: ISalesforceIntegration,
    context: IContext<InputResultMap>,
    connectUser: IConnectUser<IPersona<typeof personaMeta>>,
  ) {
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
        type: "bearer",
        token: context.getEnvironmentSecret("API_SECRET")
      },
      bodyType: "json",
      body: {
        user_id: connectUser.userId,
        contact: triggerStep.output.result
      },
      description: "Send to my API"
    });

    triggerStep.nextStep(sendToMyAPI);

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
