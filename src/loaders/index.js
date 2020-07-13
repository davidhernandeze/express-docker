import expressLoader from './express'
import logger from 'pino'
// import './events'

export default async ({ app }) => {
  await expressLoader({ app })
  logger().info('Express loaded')
}
