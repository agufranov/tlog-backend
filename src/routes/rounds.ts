import { FastifyInstance } from 'fastify'

export async function roundRoutes(server: FastifyInstance) {
  server.get('/rounds', async (request, reply) => {
    return { x: 42 }
  })
}
