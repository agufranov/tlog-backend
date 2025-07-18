import Fastify from 'fastify'
import { roundRoutes } from '@/routes/rounds'

const server = Fastify({
  logger: true,
})

async function main() {
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
