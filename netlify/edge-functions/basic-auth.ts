const realm = 'DSA Scheduling MVP1';

export default async function basicAuth(request: Request, context: any) {
  const expectedUser = context.env.get('BASIC_AUTH_USER');
  const expectedPassword = context.env.get('BASIC_AUTH_PASSWORD');

  if (!expectedUser || !expectedPassword) {
    return new Response('Authentication is not configured.', {
      status: 500,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }

  const authorization = request.headers.get('authorization');
  const credentials = parseBasicAuthorization(authorization);

  if (!credentials || !safeEqual(credentials.username, expectedUser) || !safeEqual(credentials.password, expectedPassword)) {
    return unauthorized();
  }

  return context.next();
}

function unauthorized() {
  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${realm}", charset="UTF-8"`,
      'Cache-Control': 'no-store'
    }
  });
}

function parseBasicAuthorization(authorization: string | null) {
  if (!authorization?.startsWith('Basic ')) return null;

  try {
    const decoded = atob(authorization.slice('Basic '.length).trim());
    const separatorIndex = decoded.indexOf(':');
    if (separatorIndex < 0) return null;

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1)
    };
  } catch {
    return null;
  }
}

function safeEqual(actual: string, expected: string) {
  const actualBytes = new TextEncoder().encode(actual);
  const expectedBytes = new TextEncoder().encode(expected);
  const maxLength = Math.max(actualBytes.length, expectedBytes.length);
  let diff = actualBytes.length ^ expectedBytes.length;

  for (let index = 0; index < maxLength; index += 1) {
    diff |= (actualBytes[index] ?? 0) ^ (expectedBytes[index] ?? 0);
  }

  return diff === 0;
}
