import { get } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth"

// export const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
export async function amplifyGet(apiName, path, queryParameter) {
    const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    return await (await get({
        apiName,
        path,
        options: {
            headers: { Authorization: `Bearer ${authToken}` },
            queryParams: queryParameter
        },
      }).response).body.json()
  }
  