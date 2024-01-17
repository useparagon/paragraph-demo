import { IEventInit } from '@useparagon/core/event';

export type EventSchema = {
  title: 'Test';
  priority: 'P2';
};

const event: IEventInit<EventSchema> = {
  /**
   *  name of event
   */
  name: 'New Task',

  /**
   * schema of event payload
   */
  schema: {
    title: 'Test',
    priority: 'P2',
  },
};

export default event;
