import { For, Show } from "solid-js";
import { apiBaseUrl } from "../../config";
import { setLoadingState } from "../Loading/Loading";

export interface HandleSubmissionProps {
  data: any;
  apiPath: string;
  setServerErrors: (value: string[] | undefined) => void;
}

export async function handleSubmission({
  data,
  apiPath,
  setServerErrors,
}: HandleSubmissionProps) {
  setLoadingState(true);
  const response = await postData(apiPath, data);
  setLoadingState(false);
  if (response.success === false) {
    setServerErrors(createserverErrors(response));
    return false;
  } else {
    setServerErrors(undefined);
    return response;
  }
}

export interface ServerErrorsProps {
  serverErrors: string[] | undefined;
}

export function ServerErrors(props: ServerErrorsProps) {
  return (
    <Show when={props.serverErrors}>
      <div class="error-message">
        <For each={props.serverErrors}>{(item) => <div>{item}</div>}</For>
      </div>
    </Show>
  );
}

export async function postData(apiPath: string, data: any) {
  const response = await fetch(apiBaseUrl + apiPath, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function getData(apiPath: string, data: any) {
  const response = await fetch(apiBaseUrl + apiPath, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export function createserverErrors(response: any) {
  if (
    response.message !== "Validation failed" ||
    !response?.data?.details?.length
  ) {
    return [response.message];
  }
  return response.data.details.map((detail: any) => {
    return `${detail.message} `;
  });
}
