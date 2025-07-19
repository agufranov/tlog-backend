import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import cors from '@fastify/cors'

export default fp(async (server: FastifyInstance) => {
  server.register(cors, {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'X-CSRF-Token',
      'Authorization',
      'Set-Cookie',
    ],
  })
})
