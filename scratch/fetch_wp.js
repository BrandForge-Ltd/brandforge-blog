async function run() {
  const res = await fetch('https://brandforge.ng/wp-json/wp/v2/posts?per_page=100');
  const posts = await res.json();
  console.log("Total posts in WP:", posts.length);
  console.log(posts.map(p => p.slug).join(", "));
}
run();
