export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const text = body.text;
    const voice = body.voice || 'asteria';

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!env.AI) {
      return new Response(JSON.stringify({ error: 'AI binding not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Map voice name to Cloudflare Aura 2 voice ID
    // Full list: https://developers.cloudflare.com/workers-ai/models/aura-2-en/
    const voiceMap: Record<string, string> = {
      asteria: 'aura-2-asteria-en',
      luna:    'aura-2-luna-en',
      orion:   'aura-2-orion-en',
      zeus:    'aura-2-zeus-en',
    };
    const voiceId = voiceMap[voice.toLowerCase()] ?? 'aura-2-asteria-en';

    const responseBytes = await env.AI.run('@cf/deepgram/aura-2-en', {
      text,
      voice: voiceId,
    });

    return new Response(responseBytes, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('[TTS] Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
