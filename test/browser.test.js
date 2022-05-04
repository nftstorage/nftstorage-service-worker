import chai from 'chai'
const assert = chai.assert

describe('nftstorage-sw', () => {
  it.only('fetches car from dweb.link', async () => {
    const res = await fetch('/ipfs/bafkreidyeivj7adnnac6ljvzj2e3rd5xdw3revw4da7mx2ckrstapoupoq?format=car')
    assert.isOk(res.ok, 'response is ok')

    const text = await res.text()
    assert.strictEqual(text, 'Hello nft.storage! 😎')
  })
  it('fetches from nftstorage.link', async () => {
    const res = await fetch('/ipfs/bafkreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy')
    assert.isOk(res.ok, 'response is ok')
  })
  it('caches responses', async () => {
    const path = '/ipfs/bafkreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy'
    const res = await fetch(path)
    assert.isOk(res.ok, 'response is ok')

    const cache = await caches.open('nftstorage-sw')
    const keys = await cache.keys()
    assert.strictEqual(keys.length, 1)

    const reqUrl = keys[0].url
    assert.isOk(reqUrl.includes(path))
  })
  it('fallsback to dweb.link if nftstorage.link fails', async () => {
    const path = '/ipfs/bafybeidluj5ub7okodgg5v6l4x3nytpivvcouuxgzuioa6vodg3xt2uqle/olizilla.png'
    const res = await fetch(path)
    assert.isOk(res.ok, 'response is ok')
    assert.strictEqual(new URL(res.url).port, '9092')
  })
  it('doesn\'t fallsback to dweb.link if nftstorage.link fails with unrecoverable error', async () => {
    const res = await fetch('/ipfs/nope.png')
    assert.isNotOk(res.ok, 'response is not ok')
    assert.strictEqual(new URL(res.url).port, '9091')
  })
  it('fetches from nftstorage.link using subdomain', async () => {
    const res = await fetch('https://bafybeidluj5ub7okodgg5v6l4x3nytpivvcouuxgzuioa6vodg3xt2uqle.ipfs.nftstorage.link/olizilla.png')
    assert.isOk(res.ok, 'response is ok')
    assert.strictEqual(new URL(res.url).port, '9092')
  })
})
