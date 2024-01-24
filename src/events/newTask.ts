import { IEventInit } from '@useparagon/core/event';

export type EventSchema = {
  a: true;
  b: 1;
  c: false;
  d: 'f';
  e: 2;
  f: 'asdf';
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
    a: true,
    b: 1,
    c: false,
    d: 'f',
    e: 2,
    f: 'asdf',
  },
};

export default event;
