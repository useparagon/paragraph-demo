import { createInputs } from '@useparagon/integrations/microsoftTeams';

/**
 * define inputs here which can be used across workflows
 */
const integrationInputs = createInputs({
    channel: {
        id: "channel",
        title: "Select a Microsoft Teams channel",
        type: "channel",
        required: true
    }
});

export default integrationInputs;
