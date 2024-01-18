import { ConditionalStep, EventStep, Workflow } from '@useparagon/core';
import { IContext } from '@useparagon/core/execution';
import * as Operators from '@useparagon/core/operator';
import { IPersona } from '@useparagon/core/persona';
import { ConditionalInput } from '@useparagon/core/steps/library/conditional';
import { IConnectUser, IPermissionContext } from '@useparagon/core/user';
import {
  ISalesforceIntegration,
  InputResultMap,
  createInputs,
} from '@useparagon/types/salesforce';

import event from '../../../events/newTask';
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

    const triggerStep = new EventStep(event);

    const descriptionStep = integration.withIntent(
      integration.intents.SALESFORCE_SEARCH_RECORDS,
      {
        recordType: 'Task',
        filterFormula: Operators.StringContains(
          'subject',
          context.getOutput(triggerStep).title,
        ),
      },
    );

    const doesexistStep = new ConditionalStep({
      if: Operators.ArrayIsNotEmpty(context.getOutput(descriptionStep).result),
      description: 'Does exist?',
    });

    const descriptionStep1 = integration.withIntent(
      integration.intents.SALESFORCE_UPDATE_RECORD,
      { recordType: 'Task', recordId: '' },
    );

    const descriptionStep2 = integration.withIntent(
      integration.intents.SALESFORCE_CREATE_RECORD,
      {
        recordType: 'Task',
        'field-Name': context.getOutput(triggerStep),
        'field-taskSubtype': 'task',
        'field-subject': context.getOutput(triggerStep).title,
      },
    );

    /**
     * chain steps correctly here
     */

    triggerStep
      .nextStep(descriptionStep)
      .nextStep(
        doesexistStep.whenTrue(descriptionStep1).whenFalse(descriptionStep2),
      );

    /**
     * pass all steps here so that paragon can keep track of changes
     */
    return this.register({
      triggerStep,
      descriptionStep,
      doesexistStep,
      descriptionStep1,
      descriptionStep2,
    });
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
