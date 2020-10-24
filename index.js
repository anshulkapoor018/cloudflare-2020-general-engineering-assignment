const Router = require('./router')
const staticHTMLEndpoint = "https://static-links-page.signalnerve.workers.dev"
const type = "application/json;charset=UTF-8"
const linkArray = [{"name": "Google", "url": "https://www.google.com"},{"name": "Facebook", "url": "https://www.fb.com"},{"name": "Cloudflare", "url": "https://www.cloudflare.com"}]
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

class removeDisplayNone {
  constructor(attributeName) {
    this.attributeName = attributeName
  }
  element(element) {
    const attribute = element.getAttribute("style")
    if (attribute) {
      element.removeAttribute("style")
    }
  }
}

class LinkTransformer {
  constructor(attributeName) {
    this.attributeName = attributeName
  }
  element(element) {
    const linkArrayTags = []
    for (var x = 0; x < linkArray.length; x++) {
      let content = "<a href=" + linkArray[x]["url"] + ">" + linkArray[x]["name"] + "</a>"
      linkArrayTags.push(content)
    }
    element.setInnerContent(linkArrayTags.join('\n'), { html: true })
  }
}

class ImageTransformer {
  constructor(attributeName) {
    this.attributeName = attributeName
  }
  element(element) {
    console.log(element.tagName)
    element.setAttribute("src", "https://simpleicons.org/icons/gravatar.svg")
  }
}

class HeadingTransformer {
  constructor(attributeName) {
    this.attributeName = attributeName
  }
  element(element) {
    console.log(element.tagName)
    element.setInnerContent("Anshul Kapoor", { html: false })
  }
}


const rewriter = new HTMLRewriter()
  .on("div#profile", new removeDisplayNone())
  .on("div#links", new LinkTransformer())
  .on("img#avatar", new ImageTransformer())
  .on("h1#name", new HeadingTransformer())
  

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