import { test, expect } from '@playwright/test';

test('e2e test', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByAltText('Album cover')).toBeDefined();
  await expect(page.getByTitle('Record Title')).toBeDefined();
  await expect(page.getByTitle('Record Artist')).toBeDefined();
  await expect(page.getByTitle('Record Year')).toBeDefined();
});