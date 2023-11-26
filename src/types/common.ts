import {Request} from "express";

export type ErrorsType = {
    errorsMessages: ErrorMessageType[]
}

export type ErrorMessageType = {
    message: string,
    field: string
}

export type Params = {
    id: string
}

export type RequestWithBody<B> = Request<{}, {}, B, {}>
export type RequestWithParams<P> = Request<P, {}, {}, {}>
export type RequestWithParamsAndBody<P, B> = Request<P, {}, B, {}>