const { Base64 } = require('js-base64');
const { Octokit } = require("@octokit/rest");

exports.handler = async (event) => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_PERSONAL_TOKEN,
    userAgent: 'ThatsAt Serverless',
  })

  const redirsResp = await octokit.repos.getContent({ owner: 'jon-sully', repo: 'thats-at', path: 'public/_redirects' })
  const redirs = Base64.decode(redirsResp.data.content)

  const line = redirs.split('\n').find(s => s.includes(event.path))
  const target = line && line.split(' ')[1]

  if (target) {
    console.log(`Found, redirecting`)
    return {
      statusCode: 302,
      headers: {
        Location: target
      },
      body: JSON.stringify({
        status: 'Clear'
      })
    }
  }
  else {
    console.log(`Not found`)
    return {
      statusCode: 302,
      headers: {
        Location: '/not-found/'
      },
      body: JSON.stringify({
        status: 'Not Found'
      })
    }
  }
}
