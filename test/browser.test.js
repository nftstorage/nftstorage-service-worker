import chai from 'chai'
import { worker } from './mocks/browser.js'

const assert = chai.assert

// msw must register first or else it doesn't seem to get to mock things.
worker.start()

describe('nftstorage-sw', () => {
  before(async () => {
    // wait for nftstorage-sw to be ready.
    // await navigator.serviceWorker.ready
    
    // set up mock nftstorage-link
    // how to wait for nftstorage-sw to be ready? the `serviceWorker.ready` just tells us there is "a" service worker ready.
    await delay(1000)
  })
  it('fetches from nftstorage.link', async () => {
    const res = await fetch('/ipfs/bafkreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy')
    assert.isOk(res.ok, 'response is ok')
  })
  it('fallsback to dweb.link if nftstorage.link fails', async () => {
    const res = await fetch('/ipfs/bafybeidluj5ub7okodgg5v6l4x3nytpivvcouuxgzuioa6vodg3xt2uqle/olizilla.png')
    assert.isOk(res.ok, 'response is ok')
  })
  // it('doesn\'t fallsback to dweb.link if nftstorage.link fails with unrecoverable error', () => {
  //   assert.fail()
  // })
})

function delay(duration) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), duration)
  })
}