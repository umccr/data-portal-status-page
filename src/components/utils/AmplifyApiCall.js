import { get } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth"

export class AmplifyApiCall {
    static getIdTokenFromLocalStorage() {
        return localStorage.getItem(Object.keys(localStorage).filter((keyValue) => keyValue.startsWith("CognitoIdentityServiceProvider") && keyValue.endsWith(".idToken"))[0]);
    }
    static async getAuthToken() {
        return (await fetchAuthSession()).tokens?.idToken?.toString();
    }
    static async get(apiName, path, queryParameter) {
        return await (await get({
            apiName,
            path,
            options: {
                headers: { Authorization: `Bearer ${ AmplifyApiCall.getIdTokenFromLocalStorage() || await AmplifyApiCall.getAuthToken()}` },
                queryParams: queryParameter
            },
        }).response).body.json()
    }
}
