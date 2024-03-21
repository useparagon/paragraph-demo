import { IEventInit } from '@useparagon/core/event';

export type EventSchema = {
  title: 'Example Title';
  description: "Example description";
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
    title: 'Example Title',
    description: 'Example description'
  },
};

export default event;
