import { createClient } from '@sanity/client'
const client = createClient({
  projectId: 'aejxymic',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
})
async function run() {
  const cats = await client.fetch(`*[_type == "category"]{ _id, "slug": slug.current }`)
  console.log(cats)
}
run()
