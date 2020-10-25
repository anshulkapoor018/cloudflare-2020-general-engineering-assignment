const Router = require('./router')
const staticHTMLEndpoint = "https://static-links-page.signalnerve.workers.dev"
const type = "application/json;charset=UTF-8"
const linkArray = [{"name": "Google", "url": "https://www.google.com"},{"name": "Facebook", "url": "https://www.fb.com"},{"name": "Cloudflare", "url": "https://www.cloudflare.com"}]
const socialLinksArray = ["<a href=\"https://www.linkedin.com/in/anshulkapoor018\"><svg role=\"img\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><title>LinkedIn icon</title><path d=\"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z\"/></svg></a>"]
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
    element.setAttribute("src", "https://simpleicons.org/icons/gravatar.svg")
  }
}

class HeadingTransformer {
  constructor(attributeName) {
    this.attributeName = attributeName
  }
  element(element) {
    element.setInnerContent("Anshul Kapoor", { html: false })
  }
}

class SocialDivTransformer {
  constructor(attributeName) {
    this.attributeName = attributeName
  }
  element(element) {
    element.setInnerContent(socialLinksArray[0], { html: true })
  }
}

class TitleTransformer {
  constructor(attributeName) {
    this.attributeName = attributeName
  }
  element(element) {
    element.setInnerContent("Anshul Kapoor", { html: false })
  }
}

class BodyTransformer {
  constructor(attributeName) {
    this.attributeName = attributeName
  }
  element(element) {
    const attribute = element.getAttribute("class")
    element.setAttribute("class","bg-purple-800")
  }
}


const rewriter = new HTMLRewriter()
  .on("div#profile", new removeDisplayNone())
  .on("div#social", new removeDisplayNone())
  .on("div#links", new LinkTransformer())
  .on("img#avatar", new ImageTransformer())
  .on("h1#name", new HeadingTransformer())
  .on("div#social", new SocialDivTransformer())
  .on("title", new TitleTransformer())
  .on("body", new BodyTransformer())

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