const { replace } = require('esbuild-plugin-replace')

/** @type {import('playwright-test').RunnerOptions} */
module.exports = {
  buildSWConfig: {
    plugins: [
      replace({
        'https://nftstorage.link': 'http://127.0.0.1:9091',
        'https://dweb.link': 'http://127.0.0.1:9092',
      })
    ]
  },
  beforeTests: async () => {
    console.log('starting')
  },
  afterTests: async (
    ctx,
    /** @type {{  mock: ProcessObject }} */ beforeTests
  ) => {
    console.log('⚡️ Shutting down mock servers.')
  }
}
