import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  // Extract Cloudflare bindings
  const env = (locals as any).runtime?.env;

  if (!env || !env.AI) {
    console.error("AI binding missing. Ensure you are running with Wrangler or deployed to Cloudflare with the AI binding configured.");
    return new Response(JSON.stringify({ error: 'AI binding not configured' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const { text, voice } = body;

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Default to Deepgram Aura Asteria (English Female)
    const model = voice || '@cf/deepgram/aura-asteria-en';

    // Call Cloudflare Workers AI
    const response = await env.AI.run(model, {
      text: text
    });

    return new Response(response, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000'
      }
    });
  } catch (err: any) {
    console.error('TTS Error:', err);
    return new Response(JSON.stringify({ error: 'Failed to generate audio: ' + err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
