import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://playwright.dev/');
});

test('Realizar una busqueda que no tenga resultados', async ({ page }) => {
  // Click en el botón de búsqueda (lupa)
  await page.locator("#__docusaurus > nav > div.navbar__inner > div.navbar__items.navbar__items--right > div.navbarSearchContainer_Bca1 > button").click();

  // Seleccionamos el input de búsqueda por placeholder
  await page.getByPlaceholder('Search docs').click();
  await page.getByPlaceholder('Search docs').fill('hascontent');

  // Esperamos a que aparezca el mensaje de no resultados
  await expect(page.locator("body > div:nth-child(1) > div > div > div > div > p")).toBeVisible();
  await expect(page.locator("body > div:nth-child(1) > div > div > div > div > p")).toHaveText('No results for "hascontent"');
});

test('Limpiar el input de busqueda', async ({ page }) => {
    // Abrir el cuadro de búsqueda
  await page.locator("#__docusaurus > nav > div.navbar__inner > div.navbar__items.navbar__items--right > div.navbarSearchContainer_Bca1 > button").click();

  // Obtener el input y escribir texto
  const searchBox = page.getByPlaceholder('Search docs');
  await searchBox.fill('somerandomtext');

  // Verificar que el input tenga el texto escrito
  await expect(searchBox).toHaveValue('somerandomtext');

  // Hacer clic en el botón para limpiar el input (botón con aria-label 'Clear query')
  await page.locator("body > div:nth-child(1) > div > div > header > form > button").click();
  await searchBox.click();

  // Verificar que el input esté vacío
  await expect(searchBox).toHaveValue('');
});

test('Realizar una busqueda que genere al menos tenga un resultado', async ({ page }) => {

  // Click en el botón de búsqueda (lupa)
  await page.locator("#__docusaurus > nav > div.navbar__inner > div.navbar__items.navbar__items--right > div.navbarSearchContainer_Bca1 > button").click();

  const searchBox = page.getByPlaceholder('Search docs');

  await searchBox.click();

  await searchBox.fill('havetext');

  // Verificar que el input tenga el texto buscado
  await expect(searchBox).toHaveValue('havetext');

  // Esperar que aparezcan las secciones de resultados
  await page.locator('.DocSearch-Dropdown-Container section').nth(1).waitFor();

  // Contar la cantidad de secciones (resultados)
  const numberOfResults = await page.locator('.DocSearch-Dropdown-Container section').count();

  // Verificar que haya al menos un resultado
  expect(numberOfResults).toBeGreaterThan(0);

});