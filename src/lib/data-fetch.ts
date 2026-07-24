type RequestMethods = "POST" | "DELETE" | "GET" | "PATCH" | "PUT";

interface RequestOptions {
  url: string;
  method?: RequestMethods;
  body?: any;
  token?: string;
  contentType?: "application/json" | "FormData";
  searchParams?: Record<string, any>;
}

export async function makeApiRequest<T>(options: RequestOptions): Promise<T> {
  const {
    url,
    body,
    token = "",
    method = "GET",
    contentType = "application/json",
    searchParams,
  } = options;

  const headers = new Headers();
  let optionRequest: RequestInit = {
    headers,
  };
  optionRequest.method = method;

  if (
    method != "GET" &&
    method != "DELETE" &&
    body &&
    contentType == "application/json"
  ) {
    headers.append("Content-Type", "application/json");
    optionRequest.body = JSON.stringify(body);
  } else {
    optionRequest.body = body;
  }

  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  //    const searchParams = new URLSearchParams();

  //   if (pagination?.page) {
  //     searchParams.append("page", pagination.page.toString());
  //   }
  let partialUrl: string = "";

  if (searchParams) {
    const urlWithSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      urlWithSearchParams.append(key, value.toString());
    }

    partialUrl = urlWithSearchParams.toString();
  }
  const finalUrl = partialUrl != "" ? url.concat("?", partialUrl) : url;

  const request = await fetch(
    `${import.meta.env.VITE_API_URL}/${finalUrl}`,
    optionRequest,
  );
  const data = await request.json();

  return data;
}
