import Fastify from 'fastify'
import { roundRoutes } from './routes/rounds'
import userRoutes from './routes/users'
import cors from '@fastify/cors'
import prismaPlugin from '@/plugins/prisma'
import sensiblePlugin from '@/plugins/sensible'

const server = Fastify({
  //   logger: true,
})

async function main() {
  server.register(sensiblePlugin)
  server.register(cors)
  server.register(prismaPlugin)

  server.register(userRoutes, { prefix: '/users' })
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
