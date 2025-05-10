import { test, expect } from '@playwright/test';

test('e2e test', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByAltText('Album cover')).toBeVisible();
  await expect(page.getByTitle('Record Title')).toBeVisible();
  await expect(page.getByTitle('Record Artist')).toBeVisible();
  await expect(page.getByTitle('Record Year')).toBeVisible();
});