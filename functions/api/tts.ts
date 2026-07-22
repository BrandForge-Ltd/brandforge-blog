export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const text = body.text;
    const voice = body.voice || 'asteria';
    
    // Map the selected voice to the correct Cloudflare AI model
    const validVoices = ['asteria', 'luna', 'orion', 'zeus'];
    const selectedVoice = validVoices.includes(voice.toLowerCase()) ? voice.toLowerCase() : 'asteria';
    const model = `@cf/deepgram/aura-${selectedVoice}-en`;

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!env.AI) {
      return new Response(JSON.stringify({ error: 'AI binding not found. Please bind the AI service in your Cloudflare Pages settings.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Call Cloudflare Workers AI with Deepgram Aura
    const responseBytes = await env.AI.run(model, { 
      text: text
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
