/**
 * https://github.com/sinedied/smoke#javascript-mocks
 */
module.exports = () => {
  return {
    statusCode: 500,
    headers: {
      'Content-Type': 'text/plain'
    },
    body: `Failed`
  }
}
