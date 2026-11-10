exports.handler = async function (event) {
  const targetUrl = event.queryStringParameters && event.queryStringParameters.url;
  if (
    !targetUrl ||
    (!targetUrl.startsWith('https://api-v2.soundcloud.com/') &&
      !targetUrl.startsWith('https://soundcloud.com') &&
      !targetUrl.startsWith('https://a-v2.sndcdn.com/'))
  ) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Invalid target URL' })
    };
  }

  try {
    const resp = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
        Accept: '*/*'
      }
    });
    const text = await resp.text();
    return {
      statusCode: resp.status,
      headers: {
        'Content-Type': resp.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: text
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: String(err) })
    };
  }
};
