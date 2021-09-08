import { ChatClient } from "@azure/communication-chat";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import { CommunicationIdentityClient } from "@azure/communication-identity";

const config = {
    getChatClient: async (): Promise<{ userId: string; client: ChatClient }> => {
        const endpointUrl = "https://acsdemoforares.communication.azure.com/";

        const connectionString = `endpoint=${endpointUrl};accesskey=PHbMYu8pHWJOQVCd3uo3SPnY1j73C2e83xEwH4kTsWzEzK2iI1njJ5Ymo4n4hEvhuqRELb3feczEU+I1sHRjeQ==`;

        const identityClient = new CommunicationIdentityClient(connectionString);

        let _userId = localStorage.getItem("userid");
        if (!_userId) {
            _userId = (await identityClient.createUser()).communicationUserId;
            localStorage.setItem("userid", _userId);
        }

        const { token } = await identityClient.getToken(
            {
                communicationUserId: _userId
            },
            ["chat"]
        );
        const tokenCredential = new AzureCommunicationTokenCredential(token);
        const chatClient = new ChatClient(endpointUrl, tokenCredential);
        return { userId: _userId, client: chatClient };
    }
};

export default config;
