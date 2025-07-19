import { FastifyInstance } from 'fastify'

export default function userRoutes(server: FastifyInstance) {
  server.get('/', async (request, reply) => {
    return await server.prisma.user.findMany()
  })
}
