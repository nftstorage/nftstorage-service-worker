const GATEWAY_URL = 'https://nftstorage.link'
const FALLBACK_URL = 'https://dweb.link'
const OK_ERROR_STATUS = [
  400,
  404,
  409
]

async function getIpfs(ipfsPath) {
  try {
    const response = await fetch(`${GATEWAY_URL}${ipfsPath}`)
    if (response.ok || OK_ERROR_STATUS.includes(response.status)) {
      return response
    }  
  } catch (_) { }
  
  return await fetch(`${FALLBACK_URL}${ipfsPath}`)
}

/*
* An event handler called whenever a fetch event occurs
* "Alternatively, simply don't call event.respondWith, which will result in default browser behaviour."
* @param {Fetch} event 
*/
const onfetch = async (event) => {
  const url = new URL(event.request.url)
  const isIpfsRequest = url.pathname.startsWith('/ipfs')

  // Not intercepting path
  if (!isIpfsRequest) {
    return
  }

  return event.respondWith(getIpfs(url.pathname))
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
