const Router = require('./router')
const staticHTMLEndpoint = "https://static-links-page.signalnerve.workers.dev"
const type = "application/json;charset=UTF-8"
const linkArray = [{"name": "link1", "url": "https://www.google.com"},{"name": "link2", "url": "https://www.google.com"},{"name": "link3", "url": "https://www.google.com"}]
async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json())
  }
  else if (contentType.includes("application/text")) {
    return await response.text()
  }
  else if (contentType.includes("text/html")) {
    return await response.text()
  }
  else {
    return await response.text()
  }
}

const rewriter = new HTMLRewriter()

class LinksTransformer {
  constructor(links) {
    this.links = links
  }
  
  async element(element) {
    const link = element.getAttribute("div#links")
    if(link){
      // e.addAttribute("src", snapshot.archived_snapshots.closest.url)
    }
  }
}

async function handleRequest(request) {
    const r = new Router()
    const init = {
      headers: {
        "content-type": type,
      },
    }
    // Replace with the appropriate paths and handlers
    const json = JSON.stringify(linkArray, null, 2)
    r.get('/links', () => new Response(json, {
      headers: {
        "content-type": type
      }
    }))
    const res = await fetch(staticHTMLEndpoint, init)
    
    r.get('/', () => rewriter.transform(res)) // return a HTMLRewriter Page

    const resp = await r.route(request)
    return resp
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})