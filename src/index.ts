import Fastify from 'fastify'
import sensiblePlugin from '@/plugins/sensible'
import prismaPlugin from '@/plugins/prisma'
import corsPlugin from '@/plugins/cors'
import cookiePlugin from '@/plugins/cookie'
import authPlugin from '@/plugins/auth'
import authRoutes from '@/routes/auth'
import userRoutes from '@/routes/users'
import roundRoutes from '@/routes/rounds'

const server = Fastify({})

async function main() {
  server.register(sensiblePlugin)
  server.register(prismaPlugin)
  server.register(corsPlugin)
  server.register(cookiePlugin)
  server.register(authPlugin)

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
