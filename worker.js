export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/generate' && request.method === 'POST') {
      try {
        const body = await request.json();
        const prompt = buildOptimizedPrompt(body);

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
            'Cache-Control': 'no-store',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ 
            error: 'Generation failed', 
            details: error instanceof Error ? error.message : String(error) 
          }),
          { 
            status: 500, 
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            } 
          }
        );
      }
    }

    return new Response('Not Found', { status: 404 });
  }
};

function buildOptimizedPrompt(payload = {}) {
  let prompt = payload.prompt || 'a beautiful portrait';
  
  if (payload.useReference && payload.referenceImage) {
    prompt += ', inspired by the reference image, same composition and style';
  }
  
  if (!prompt.includes('quality') && !prompt.includes('professional') && !prompt.includes('detailed')) {
    prompt += ', professional quality, ultra detailed, high resolution';
  }
  
  prompt += ', masterpiece, best quality';
  
  return prompt.replace(/\s+/g, ' ').slice(0, 500).trim();
}

function normalizeImage(result) {
  if (result instanceof ArrayBuffer) return result;
  
  if (typeof result === 'string') {
    const binary = atob(result);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
  
  if (result?.image instanceof ArrayBuffer) return result.image;
  if (result?.data) return new Uint8Array(result.data).buffer;
  
  throw new Error('Unexpected AI output format');
}