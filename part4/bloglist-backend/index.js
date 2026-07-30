const dns = require('dns')
dns.setServers(['8.8.8.8', '8.8.4.4'])

const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})