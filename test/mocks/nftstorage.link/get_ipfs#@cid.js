/**
 * https://github.com/sinedied/smoke#javascript-mocks
 */
module.exports = ({ params }) => {
  if (params.cid === 'nope.png') {
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'text/plain'
      },
      body: `Not found`
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' }
  }
}
