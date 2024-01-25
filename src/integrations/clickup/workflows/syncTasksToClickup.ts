import { EventStep, FunctionStep, Workflow } from '@useparagon/core';
import { IContext } from '@useparagon/core/execution';
import { IPersona } from '@useparagon/core/persona';
import { ConditionalInput } from '@useparagon/core/steps/library/conditional';
import { IConnectUser, IPermissionContext } from '@useparagon/core/user';
import {
  IClickupIntegration,
  InputResultMap,
  createInputs,
} from '@useparagon/types/clickup';

import event from '../../../events/newTask';
import personaMeta from '../../../persona.meta';
import sharedInputs from '../inputs';

/**
 * define inputs here which can be used in this workflow only
 */
const inputs = createInputs({});

/**
 * Sync tasks to ClickUp Workflow implementation
 */
export default class extends Workflow<
  IClickupIntegration,
  IPersona<typeof personaMeta>,
  InputResultMap
> {
  /**
   * This property is maintained by Paragon. Do not edit this property.
   */
  readonly id: string = 'e3cfa842-fd7c-4067-ac21-ed1e5f950c04';

  /**
   * name shown in workflow editor
   */
  name: string = 'Sync tasks to ClickUp';

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
    integration: IClickupIntegration,
    context: IContext<InputResultMap>,
    connectUser: IConnectUser<IPersona<typeof personaMeta>>,
  ) {
    /**
     * declare all steps here
     */

    const triggerStep = new EventStep(event);

    const functionStep = new FunctionStep({
      code: function appendTaskLabPrefix(parameters, libraries) {
        return '[TaskLab] ' + parameters.description;
      },
      parameters: { description: triggerStep.output },
      description: 'Create Description',
    });

    const createtaskStep = integration.withIntent(
      integration.intents.CLICKUP_CREATE_TASK,
      {
        listId: context.getInput(sharedInputs.list).list,
        name: triggerStep.output.title,
        description: functionStep.output.result,
      },
    );

    /**
     * chain steps correctly here
     */

    triggerStep.nextStep(functionStep).nextStep(createtaskStep);

    /**
     * pass all steps here so that paragon can keep track of changes
     */
    return this.register({ triggerStep, functionStep, createtaskStep });
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
