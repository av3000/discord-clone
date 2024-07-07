import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum HttpResponses {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export const HttpResponseMessages: { [key in HttpResponses]: string } = {
  [HttpResponses.OK]: "OK",
  [HttpResponses.CREATED]: "Created",
  [HttpResponses.NO_CONTENT]: "No Content",
  [HttpResponses.BAD_REQUEST]: "Bad Request",
  [HttpResponses.UNAUTHORIZED]: "Unauthorized",
  [HttpResponses.FORBIDDEN]: "Forbidden",
  [HttpResponses.NOT_FOUND]: "Not Found",
  [HttpResponses.INTERNAL_SERVER_ERROR]: "Internal Server Error",
};
