import { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'
import repl from 'repl'
import { Prisma } from '@prisma/client'

interface CreateUserRequest {
  username: string
  password: string
}

export default function userRoutes(server: FastifyInstance) {
  server.get('/', (request, reply) => {
    return { user: 42 }
  })

  server.post<{ Body: CreateUserRequest }>('/', async (request, reply) => {
    console.log(request.body, request.body.username)
    const { prisma } = server
    const { username, password } = request.body

    const passwordHash = await bcrypt.hash(request.body.password, 10)

    try {
      return await prisma.user.create({
        data: { username, passwordHash },
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
