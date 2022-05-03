import { rest } from 'msw'

export const handlers = [
  rest.get('https://nftstorage.link/ipfs/bafkreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy', (req, res, ctx) => {
    return res(
      // good one
      ctx.status(200),
    )
  }),
  rest.get('https://nftstorage.link/ipfs/bafybeidluj5ub7okodgg5v6l4x3nytpivvcouuxgzuioa6vodg3xt2uqle/olizilla.png', (req, res, ctx) => {
    return res(
      // bad one
      ctx.status(500),
    )
  }),
  rest.get('https://nftstorage.link/ipfs/nope.png', (req, res, ctx) => {
    return res(
      // really bad one
      ctx.status(404),
    )
  })
]
