import { rest } from 'msw'

export const handlers = [
  rest.get('https://nftstorage.link/ipfs/bafybeidluj5ub7okodgg5v6l4x3nytpivvcouuxgzuioa6vodg3xt2uqle/olizilla.png', (req, res, ctx) => {
    return res(
      // bad one
      ctx.status(500),
    )
  })
]
