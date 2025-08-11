import { StatusResponse } from '../enums/web.enum';

export interface IWebResponse<T> {
  status: StatusResponse;
  message?: string | string[];
  data: T;
}
