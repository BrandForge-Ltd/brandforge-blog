import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'aejxymic',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function test() {
  const query = `*[_type == "post"][0...1] {
    title,
    "readingTime": round(length(pt::text(body)) / 5 / 180)
  }`;
  
  const result = await client.fetch(query);
  console.log(result);
}

test();
