const { unpack } = require('ipfs-car/unpack')
const { CarReader } = require('@ipld/car')

const GATEWAY_URL = 'https://nftstorage.link'
const FALLBACK_URL = 'https://dweb.link'
const OK_ERROR_STATUS = [
  400,
  404,
  409
]

/**
 * @param {URL} url
 */
function getIPFSPath (url) {
  // Path
  if (url.pathname.startsWith('/ipfs')) {
    return url.pathname
  }
  
  // Subdomain
  if (url.hostname.includes('.ipfs.')) {
    const cid = url.hostname.split('.ipfs.')[0]
    return `/ipfs/${cid}${url.pathname}`
  }
}

async function getCar(ipfsPath) {
  const cid = ipfsPath.substr('/ipfs/'.length)
  const res = await fetch(`${FALLBACK_URL}/api/v0/dag/export?arg=${cid}`, {
    method: 'POST'
  })

  const arrayBuffer = await res.arrayBuffer()
  const carReader = await CarReader.fromBytes(new Uint8Array(arrayBuffer))

  const files = []
  for await (const file of unpack(carReader)) {
    // Iterate over files
    files.push(file)
  }

  if (files.length > 0) {
    return new Response('More than one file is not currently supported', {
      status: 501,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  const blobParts = []
  for await (const part of files[0].content()) {
    blobParts.push(part)
  }

  return new Response(new Blob(blobParts))
}

/**
 * @param {URL} url
 */
async function getFromIpfs(url) {
  const ipfsPath = getIPFSPath(url)
  // Get car
  if (url.searchParams.get('format') === 'car') {
    return getCar(ipfsPath)
  }

  try {
    const response = await fetch(`${GATEWAY_URL}${ipfsPath}`)
    if (response.ok || OK_ERROR_STATUS.includes(response.status)) {
      return response
    }  
  } catch (_) { }
  
  return await fetch(`${FALLBACK_URL}${ipfsPath}`)
}

/**
 * @param {Request} request
 */
async function cacheFirst(request) {
  const responseFromCache = await caches.match(request)
  if (responseFromCache) {
    return responseFromCache
  }

  const url = new URL(request.url)
  try {
    // Get from IPFS Gateways
    const responseFromNetwork = await getFromIpfs(url)
    // Add to cache
    putInCache(request, responseFromNetwork.clone())
    return responseFromNetwork
  } catch (err) {
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}

async function putInCache(request, response) {
  const cache = await caches.open('nftstorage-sw')
  await cache.put(request, response)
}

/*
* An event handler called whenever a fetch event occurs
* "Alternatively, simply don't call event.respondWith, which will result in default browser behaviour."
* @param {Fetch} event 
*/
const onfetch = async (event) => {
  const url = new URL(event.request.url)

  const isIpfsRequest = url.pathname.startsWith('/ipfs')
  const isIpfsSubdomainRequest = url.hostname.includes('.ipfs.')

  // Not intercepting path
  if (!isIpfsRequest && !isIpfsSubdomainRequest) {
    return
  }

  return event.respondWith(cacheFirst(event.request))
}

/*
 * The install event is your chance to cache everything you need before being able to control clients. 
 * The promise you pass to event.waitUntil() lets the browser know when your install completes, and if it was successful.
 * https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
 * 
 * This function must be sync, any async work needs to be done in the function passed to event.waitUntil
 *
 * @param {LifecycleEvent} event 
 */
const oninstall = async (event) => {
  event.waitUntil(event.target.skipWaiting())
}

/*
 * Once your service worker is ready to control clients and handle functional events like push and sync, 
 * you'll get an activate event. But that doesn't mean the page that called .register() will be controlled.
 * @param {LifecycleEvent} event 
 */
const onactivate = async (event) => {
  console.log('🤖 onactivate', event)
  // We want to start handling requests right away, so that requests from the
  // very first page will be handled by service worker. Which is why we claim
  // clients.
  event.waitUntil(event.target.clients.claim())
}

/**
 * Sets up service worker event handlers.
 * @param {any} self 
 */
const setup = (self) => {
  self.oninstall = oninstall
  self.onactivate = onactivate
  self.onfetch = onfetch
}

setup(self)
