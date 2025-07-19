import Fastify from 'fastify'
import { roundRoutes } from './routes/rounds'
import userRoutes from './routes/users'
import sensiblePlugin from '@/plugins/sensible'
import prismaPlugin from '@/plugins/prisma'
import corsPlugin from '@/plugins/cors'
import cookiePlugin from '@/plugins/cookie'
import authRoutes from './routes/auth'

const server = Fastify({
  //   logger: true,
})

async function main() {
  server.register(sensiblePlugin)
  server.register(prismaPlugin)
  server.register(corsPlugin)
  server.register(cookiePlugin)

  server.register(userRoutes, { prefix: '/users' })
  server.register(authRoutes, { prefix: '/auth' })
  server.register(roundRoutes)

  server.listen({ port: 3000 }, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })
}

main()
