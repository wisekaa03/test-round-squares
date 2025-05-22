/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export type BadRequestException = object;

export type UnauthorizedException = object;

export type ForbiddenException = object;

export type NotFoundException = object;

export type NotAcceptableException = object;

export type ConflictException = object;

export type InternalServerErrorException = object;

export interface User {
  /**
   * Идентификатор пользователя
   * @format uuid
   */
  id: string;
  /**
   * Имя
   * @maxLength 50
   * @example "John"
   */
  name: string;
  /**
   * Время создания
   * @format date-time
   * @example "2021-01-01T00:00:00.000Z"
   */
  createdAt?: string;
  /**
   * Время изменения
   * @format date-time
   * @example "2021-01-01T00:00:00.000Z"
   */
  updatedAt?: string;
}

export interface LoginRequest {
  /**
   * Имя
   * @maxLength 50
   * @example "John"
   */
  name: string;
  /**
   * Пароля пользователя (должен удовлетворять минимальным требованиям)
   * @format password
   * @minLength 8
   * @maxLength 30
   * @pattern /((?=.*\d)|(?=.*\W+))(?![.
   * ])(?=.*[A-Z])(?=.*[a-z]).*$/
   * @example "Secret~12345678"
   */
  password: string;
}

export interface AuthenticationPayload {
  /**
   * Тип: Bearer
   * @example "bearer"
   */
  type: string;
  /**
   * Токен, используемый в Authorization: Bearer
   * @example "eyJcbGciOcJIUcI1xxxxxxxxxxxxxxxx"
   */
  token: string;
}

export interface AuthResponse {
  /** Возвращаемый токен */
  payload: AuthenticationPayload;
  /** Пользователь */
  data: User;
}

export interface RegisterRequest {
  /**
   * Имя
   * @maxLength 50
   * @example "John"
   */
  name?: string;
  /**
   * Пароля пользователя (должен удовлетворять минимальным требованиям)
   * @minLength 8
   * @maxLength 32
   * @pattern /((?=.*d)|(?=.*W+))(?![.
   * ])(?=.*[A-Z])(?=.*[a-z]).*$/
   * @example "Secret~12345678"
   */
  password: string;
}

export interface TapRequest {
  /**
   * Раунд ID
   * @format uuid
   */
  roundId: string;
}

export interface TapResponse {
  /**
   * Количество тапов
   * @example 1
   */
  tap: number;
  /**
   * Очки за раунд
   * @example 1
   */
  score: number;
  /**
   * Общие очки за раунд
   * @example 1
   */
  roundScore: number;
}

export interface RoundWinner {
  /**
   * Идентификатор раунда
   * @format uuid
   */
  id: string;
  /**
   * Время начала
   * @format date-time
   * @example "2021-01-01T00:00:00.000Z"
   */
  startTime: string;
  /**
   * Время начала
   * @format date-time
   * @example "2021-01-01T00:00:00.000Z"
   */
  endTime: string;
  /**
   * Идентификатор победителя
   * @format uuid
   */
  winnerUserId: string;
  /**
   * Имя победителя
   * @format string
   * @example "nikita"
   */
  winnerUserName: string;
  /** Сколько тапнул */
  tapId: string;
  /** Сколько очков */
  tapScore: number;
  /** Сколько очков в раунде */
  roundScore: number;
}

export interface Rounds {
  /** Список раундов */
  data: RoundWinner[];
}

export interface Round {
  /**
   * Идентификатор раунда
   * @format uuid
   */
  id: string;
  /**
   * Время создания
   * @format date-time
   * @example "2021-01-01T00:00:00.000Z"
   */
  startTime: string;
  /**
   * Время окончания
   * @format date-time
   * @example "2021-01-01T00:00:00.000Z"
   */
  endTime: string;
  /**
   * Общее количество очков
   * @example 1
   */
  score: number;
  /**
   * Время создания
   * @format date-time
   * @example "2021-01-01T00:00:00.000Z"
   */
  createdAt?: string;
  /**
   * Время изменения
   * @format date-time
   * @example "2021-01-01T00:00:00.000Z"
   */
  updatedAt?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title No title
 * @version 1.0.0
 * @contact
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags auth
     * @name AuthGet
     * @summary Проверяет, авторизован ли пользователь и выдает о пользователе полную информацию
     * @request GET:/api/auth
     * @secure
     */
    authGet: (params: RequestParams = {}) =>
      this.request<
        User,
        | BadRequestException
        | UnauthorizedException
        | ForbiddenException
        | NotFoundException
        | NotAcceptableException
        | ConflictException
        | InternalServerErrorException
      >({
        path: `/api/auth`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthLogin
     * @summary Авторизация пользователя
     * @request POST:/api/auth/login
     */
    authLogin: (data: LoginRequest, params: RequestParams = {}) =>
      this.request<
        AuthResponse,
        | BadRequestException
        | UnauthorizedException
        | ForbiddenException
        | NotFoundException
        | NotAcceptableException
        | ConflictException
        | InternalServerErrorException
      >({
        path: `/api/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthRegister
     * @summary Регистрация пользователя
     * @request POST:/api/auth/register
     */
    authRegister: (data: RegisterRequest, params: RequestParams = {}) =>
      this.request<
        AuthResponse,
        | BadRequestException
        | UnauthorizedException
        | ForbiddenException
        | NotFoundException
        | NotAcceptableException
        | ConflictException
        | InternalServerErrorException
      >({
        path: `/api/auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags tap
     * @name Tap
     * @summary Тапаем
     * @request POST:/api/tap
     * @secure
     */
    tap: (data: TapRequest, params: RequestParams = {}) =>
      this.request<
        any,
        | BadRequestException
        | UnauthorizedException
        | ForbiddenException
        | NotFoundException
        | NotAcceptableException
        | ConflictException
        | InternalServerErrorException
        | TapResponse
      >({
        path: `/api/tap`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags round
     * @name RoundGet
     * @summary Раунды The Last of Guss
     * @request GET:/api/round
     * @secure
     */
    roundGet: (params: RequestParams = {}) =>
      this.request<
        any,
        | BadRequestException
        | UnauthorizedException
        | ForbiddenException
        | NotFoundException
        | NotAcceptableException
        | ConflictException
        | InternalServerErrorException
        | Rounds
      >({
        path: `/api/round`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags round
     * @name RoundStart
     * @summary Начало нового раунда The Last of Guss
     * @request POST:/api/round
     * @secure
     */
    roundStart: (params: RequestParams = {}) =>
      this.request<
        any,
        | BadRequestException
        | UnauthorizedException
        | ForbiddenException
        | NotFoundException
        | NotAcceptableException
        | ConflictException
        | InternalServerErrorException
        | Round
      >({
        path: `/api/round`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
}
