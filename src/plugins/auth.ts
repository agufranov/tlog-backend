import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { User } from '@prisma/client'

declare module 'fastify' {
  interface FastifyRequest {
    user?: Pick<User, 'id' | 'username'>
  }
}

// TODO maybe not plugin, but hook?
export default fp(async (server: FastifyInstance) => {
  server.addHook('preParsing', async (request) => {
    const { sessionId } = request.cookies
    try {
      const session = await request.server.prisma.authSession.findUnique({
        where: { data: sessionId },
        select: { user: { select: { id: true, username: true, role: true } } },
      })

      request.user = session?.user
    } catch (err) {
      throw err
    }
  })
})
