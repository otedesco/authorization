import { BaseException, ResourceNotFoundError } from "@otedesco/commons";
import _ from "lodash";

const buildResponse = <T>(
  status: number,
  data: T,
): { status: number; data: T } => ({ status, data });

export const success = (data: any) => buildResponse(200, data);

export const notFound = (data: any) => {
  throw new BaseException({
    data,
    status: 404,
    code: ResourceNotFoundError.code,
    message: ResourceNotFoundError.message,
  });
};

export const resolveResponse = async (
  value: Promise<any>,
  options: { notFoundHandler?: typeof notFound; defaultResponse?: any } = {},
) => {
  const { notFoundHandler = notFound, defaultResponse = {} } = options;
  const records = await value;

  if (_.isEmpty(records)) {
    return notFoundHandler(records);
  }

  return success(defaultResponse ?? records);
};

export const createResponse = async <T>(
  value: Promise<T>,
  options: { defaultResponse?: any } = {},
) => {
  const { defaultResponse = { data: null } } = options;
  const records = await value;

  return buildResponse<T>(201, records || defaultResponse);
};
