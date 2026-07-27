import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 400, height: 800 });
  await page.goto('http://localhost:4321', { waitUntil: 'networkidle0' });
  
  // Wait for audio player
  await page.waitForSelector('.audio-player-wrapper', { timeout: 5000 }).catch(() => {});
  
  const element = await page.$('.audio-player-wrapper');
  if (element) {
    await element.screenshot({ path: 'scratch/player_screenshot.png' });
    console.log('Screenshot saved to scratch/player_screenshot.png');
  } else {
    console.log('Audio player not found, taking full page screenshot');
    await page.screenshot({ path: 'scratch/player_screenshot.png' });
  }
  
  await browser.close();
})();
