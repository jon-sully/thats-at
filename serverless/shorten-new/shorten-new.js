var qs = require('querystring')
const { Base64 } = require('js-base64');
const shortid = require('shortid');
const { Octokit } = require("@octokit/rest");


exports.handler = async (event) => {
  const { url } = qs.parse(event.body)
  if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g.test(url) || /thats\.at/g.test(url)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        status: 'Invalid URL'
      })
    }
  }

  const shorty = shortid()

  const octokit = new Octokit({
    auth: process.env.GITHUB_PERSONAL_TOKEN,
    userAgent: 'ThatsAt Serverless',
  })

  const redirsResp = await octokit.repos.getContent({ owner: 'jon-sully', repo: 'thats-at', path: 'public/_redirects' })
  const redirs = Base64.decode(redirsResp.data.content)

  const newRedirs = `/${shorty} ${url}\n`.concat(redirs)

  const commitResp = await octokit.repos.createOrUpdateFileContents({
    content: Base64.encode(newRedirs),
    message: `Added ${shorty}=>${url}`,
    owner: 'jon-sully',
    repo: 'thats-at',
    path: 'public/_redirects',
    sha: redirsResp.data.sha
  })

  if (commitResp.status === 200) {
    return {
      statusCode: 302,
      headers: {
        Location: `/short/?id=${shorty}`
      },
      body: JSON.stringify({
        status: 'Redirecting...'
      })
    }
  }
  else {
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 'Server(less) error!'
      })
    }
  }


}
