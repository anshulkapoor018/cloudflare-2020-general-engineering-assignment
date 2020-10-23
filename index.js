const Router = require('./router')

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

// function handler(request) {
//     const init = {
//         headers: { 'content-type': 'application/json' },
//     }
//     const body = JSON.stringify({ some: 'json' })
//     return new Response(body, init)
// }

async function handleRequest(request) {
    const r = new Router()
    // Replace with the appropriate paths and handlers
    let linkArray = [{"name": "link1", "url": "https://google.com"},{"name": "link2", "url": "https://google.com"},{"name": "link3", "url": "https://google.com"}]
    const json = JSON.stringify(linkArray, null, 2)
    r.get('/links', () => new Response(json, {
      headers: {
        "content-type": "application/json;charset=UTF-8"
      }
    }))

    r.get('/', () => new Response('Hello worker!')) // return a default message for the root route

    const resp = await r.route(request)
    return resp
}
