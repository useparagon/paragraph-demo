import { createInputs } from '@useparagon/integrations/salesforce';

/**
 * define inputs here which can be used across workflows
 */
const integrationInputs = createInputs({
  field_mapping: {
    id: '8eddc0e2-2b01-4334-9b73-e972b71cf7ca',
    title: 'Field Mapping',
    tooltip: 'tooltip',
    required: true,
    type: 'field_mapping',
    useDynamicMapper: false,
    fieldMappings: [
      {
        label: 'ASDF',
        value: 'a',
      },
      {
        label: 'b',
      },
      {
        label: 'c',
      },
    ],
  },
});

export default integrationInputs;
