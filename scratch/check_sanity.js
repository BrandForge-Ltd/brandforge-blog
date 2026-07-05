import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'aejxymic',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
})

async function run() {
  const posts = await client.fetch(`*[_type == "post"]{ _id, title, "slug": slug.current }`)
  console.log("Total posts in Sanity:", posts.length)
  console.log(posts.map(p => p.slug).join(", "))
}
run()
