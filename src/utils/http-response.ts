import { HttpStatusCode } from "../domain/enums/http.enum";

export function httpResponse(data: unknown, statusCode: HttpStatusCode) {
  return {
    body: JSON.stringify(data),
    statusCode,
  };
}
