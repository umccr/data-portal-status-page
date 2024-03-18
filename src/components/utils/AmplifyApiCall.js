import { get } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth"

export class AmplifyApiCall {
  static async getAuthToken() {
        return (await fetchAuthSession()).tokens?.idToken?.toString();
    }
  static async get(apiName, path, queryParameter) {
    return await (await get({
      apiName,
      path,
      options: {
        headers: { Authorization: `Bearer ${await AmplifyApiCall.getAuthToken()}` },
        queryParams: queryParameter
      },
    }).response).body.json()
  }
}
