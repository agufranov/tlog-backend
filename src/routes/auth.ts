import { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'

interface UserCredentialsRequest {
  username: string
  password: string
}

type UserCredentialsResponse = { sessionId: string } | { error: string }

export default function authRoutes(server: FastifyInstance) {
  server.post<{ Body: UserCredentialsRequest; Reply: UserCredentialsResponse }>(
    '/login',
    async (request, reply) => {
      const { prisma } = server
      const { username, password } = request.body

      const user = await prisma.user.findFirst({
        where: {
          username: username.trim().toLowerCase(),
        },
      })

      if (!user) {
        reply.code(404)
        return { error: 'USER_NOT_FOUND' }
      }

      if (!(await bcrypt.compare(password, user.passwordHash))) {
        reply.code(401)
        return { error: 'WRONG_PASSWORD' }
      }

      const session = await prisma.authSession.create({
        data: {
          userId: user.id,
        },
      })

      return { sessionId: session.data }
    }
  )
}
