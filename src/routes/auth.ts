import { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'
import { Prisma, Role } from '@prisma/client'
import { UserCredentialsRequest } from '@/types'
import { formatUsername } from '@/hooks/formatUsername'

type AuthLoginResponse = { sessionId: string } | { error: string }

const SPECIAL_ROLES: Record<string, Role> = {
  admin: 'ADMIN',
  nikita: 'NIKITA',
}

export default function authRoutes(server: FastifyInstance) {
  server.post<{ Body: UserCredentialsRequest; Reply: AuthLoginResponse }>(
    '/signIn',
    { preValidation: formatUsername, preParsing: [] }, // TODO get done with hooks
    async (request, reply) => {
      const { prisma } = server
      const { username, password } = request.body

      try {
        // TODO inject abstract db
        const user = await prisma.user.findFirst({
          where: {
            username,
          },
        })

        if (!user) {
          reply.code(404)
          return { error: 'USER_NOT_FOUND' }
        }

        console.log(user)

        if (!(await bcrypt.compare(password, user.passwordHash))) {
          reply.code(401)
          return { error: 'WRONG_PASSWORD' }
        }

        const session = await prisma.authSession.create({
          data: {
            userId: user.id,
          },
        })

        reply.setCookie('sessionId', session.data, {
          httpOnly: false,
          secure: true,
          sameSite: 'none',
        })

        return { sessionId: session.data }
      } catch (err) {
        console.error(err)
      }
    }
  )

  server.post<{ Body: UserCredentialsRequest }>(
    '/signUp',
    { preValidation: formatUsername, preParsing: [] }, // TODO get done with hooks
    async (request, reply) => {
      const { prisma } = server
      const { username, password } = request.body

      const passwordHash = await bcrypt.hash(password, 5)

      try {
        return await prisma.user.create({
          data: {
            username: username.trim().toLowerCase(),
            passwordHash,
            role: SPECIAL_ROLES[username],
          },
        })
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            reply.code(400)
            return { error: 'USER_ALREADY_EXISTS' }
          }
        }
        throw err
      }
    }
  )

  server.get('/cookie', async (request, reply) => {
    return { user: request.user }
  })
}
