import { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'
import repl from 'repl'
import { Prisma, PrismaClient, Role } from '@prisma/client'

interface CreateUserRequest {
  username: string
  password: string
}

const SPECIAL_ROLES: Record<string, Role> = {
  admin: 'ADMIN',
  nikita: 'NIKITA',
}

export default function userRoutes(server: FastifyInstance) {
  server.get('/', async (request, reply) => {
    return await server.prisma.user.findMany()
  })

  server.post<{ Body: CreateUserRequest }>('/', async (request, reply) => {
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
  })
}
