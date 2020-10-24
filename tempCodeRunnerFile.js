const responses = await Promise.all([fetch(staticHTMLEndpoint, init)])
    const results = await Promise.all([
      gatherResponse(responses[0])
    ])