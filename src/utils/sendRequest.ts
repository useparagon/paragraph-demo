import { RequestStep } from '@useparagon/core';
import { IContext } from '@useparagon/core/execution';

export const sendRequest = <
  T extends IContext<C>,
  C extends Record<string, unknown>,
>(
  context: T,
  { method, url, body },
) => {
  return new RequestStep({
    method,
    url: `https://api.myapp.io${url}`,
    authorization: {
      type: 'bearer',
      token: context.getEnvironmentSecret('API_SECRET'),
    },
    body,
    autoRetry: true,
    description: `${method} ${url}`
  });
};
