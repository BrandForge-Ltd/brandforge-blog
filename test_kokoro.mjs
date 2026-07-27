import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));

  await page.goto('http://127.0.0.1:4321/blog/the-most-profitable-lie-in-pricing', { waitUntil: 'domcontentloaded' });
  
  console.log('Page loaded, clicking play...');
  await page.click('#playBtn');
  
  console.log('Waiting 10 seconds...');
  await new Promise(r => setTimeout(r, 10000));
  
  await browser.close();
})();
