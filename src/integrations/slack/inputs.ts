import { createInputs } from '@useparagon/integrations/slack';

/**
 * define inputs here which can be used across workflows
 */
const integrationInputs = createInputs({
    "channel": {
        id: "channel",
        title: "Select a Slack Channel",
        type: "channel",
        required: true
    }
});

export default integrationInputs;
