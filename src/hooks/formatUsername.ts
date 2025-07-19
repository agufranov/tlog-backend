import { UserCredentialsRequest } from '@/types'
import {
  RawServerDefault,
  preValidationAsyncHookHandler,
} from 'fastify'
import { IncomingMessage, ServerResponse } from 'node:http'

export const formatUsername: preValidationAsyncHookHandler<
  RawServerDefault,
  IncomingMessage,
  ServerResponse<IncomingMessage>,
  { Body: UserCredentialsRequest }
> = async (request) => {
  request.body.username = request.body.username.trim().toLowerCase()
}
