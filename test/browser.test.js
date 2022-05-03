import chai from 'chai'
const assert = chai.assert

describe('nftstorage-sw', () => {
  it('fetches from nftstorage.link', async () => {
    const res = await fetch('/ipfs/bafkreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy')
    assert.isOk(res.ok, 'response is ok')
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
})
