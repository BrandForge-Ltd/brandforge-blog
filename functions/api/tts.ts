export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const text = body.text;
    const voice = body.voice || 'asteria';

    const model = '@cf/deepgram/aura-2-en';

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!env.AI) {
      return new Response(JSON.stringify({ error: 'AI binding not found' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Call Cloudflare Workers AI with Deepgram Aura using the specific speaker
    const responseBytes = await env.AI.run(model, { 
      text: text,
      speaker: voice
    });

    return new Response(responseBytes, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
