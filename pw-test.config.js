/** @type {import('playwright-test').RunnerOptions} */
module.exports = {
  buildSWConfig: {
    define: {
      GATEWAY_URL_GLOBAL: JSON.stringify('http://127.0.0.1:9091'),
      FALLBACK_URL_GLOBAL: JSON.stringify('http://127.0.0.1:9092'),
    },
  },
  beforeTests: async () => {
    console.log('starting')
  },
  afterTests: async (
    ctx,
    /** @type {{  mock: ProcessObject }} */ beforeTests
  ) => {
    console.log('⚡️ Shutting down mock servers.')
  },
}
