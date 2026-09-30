export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/generate' && request.method === 'POST') {
      try {
        const body = await request.json();
        const prompt = buildPrompt(body);

        const result = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
          prompt,
          num_steps: 4,
          guidance: 3.0,
          width: 1024,
          height: 1024
        });

        const imageBytes = normalizeImage(result);
        return new Response(imageBytes, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'no-store'
          }
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ error: 'Generation failed', details: error.message }),
          { status: 500, headers: { 'content-type': 'application/json' } }
        );
      }
    }

    return new Response('Not found', { status: 404 });
  }
};

function buildPrompt(payload = {}) {
  let prompt = payload.prompt || 'surreal portrait';
  if (payload.useReference && payload.referenceImage) {
    prompt += ', inspired by reference image composition and style';
  }
  prompt += ', professional quality, cinematic lighting, ultra detailed, 4k';
  return prompt.replace(/\s+/g, ' ').trim();
}

function normalizeImage(result) {
  if (result instanceof ArrayBuffer) return result;
  if (typeof result === 'string') {
    const binary = atob(result);
    return new Uint8Array(binary.length).map((_, i) => binary.charCodeAt(i)).buffer;
  }
  if (result?.image instanceof ArrayBuffer) return result.image;
  if (result?.data) return new Uint8Array(result.data).buffer;
  throw new Error('Unexpected output format');
}