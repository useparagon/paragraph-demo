import { IEventInit } from '@useparagon/core/event';

export type EventSchema = {
  SubmitterName: 'John Doe';
  WorkRequestUID: 991234;
  WorkRequestURL: 'https://test.ignite.inmotionnow.com/WorkRequest/991234';
};

const workRequestEvent: IEventInit<EventSchema> = {
  /**
   *  name of event
   */
  name: 'Work Request',

  /**
   * schema of event payload
   */
  schema: {
    SubmitterName: 'John Doe',
    WorkRequestUID: 991234,
    WorkRequestURL: 'https://test.ignite.inmotionnow.com/WorkRequest/991234',
  },
};

export default workRequestEvent;
