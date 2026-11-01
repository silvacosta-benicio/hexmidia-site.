const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    headless: true,
    args: ["--no-sandbox"],
  });
  const context = await browser.newContext({
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();
  const errors = [],
    failed = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto(process.env.BASE_URL || "http://127.0.0.1:8000/");
    await page.evaluate(() => document.fonts.ready);
    assert(await page.locator("h1").isVisible());
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow ${width}`,
    );
    assert(
      await page
        .locator(".hero-scene img")
        .evaluate((i) => i.complete && i.naturalWidth > 0),
    );
    for (const a of await page.locator('a[href^="#"]').all()) {
      const id = await a.getAttribute("href");
      assert(await page.locator(id).count(), `missing anchor ${id}`);
    }
    if (width < 961) {
      await page.getByRole("button", { name: "Abrir menu" }).click();
      assert(await page.locator("#navigation").isVisible());
      await page.keyboard.press("Escape");
      assert.equal(
        await page.locator(".menu-toggle").getAttribute("aria-expanded"),
        "false",
      );
      await page.locator(".menu-toggle").click();
      await page.locator('#navigation a[href="#solucoes"]').click();
      assert.equal(
        await page.locator(".menu-toggle").getAttribute("aria-expanded"),
        "false",
      );
    }
    await page.locator("details").first().locator("summary").click();
    assert(
      await page
        .locator("details")
        .first()
        .evaluate((d) => d.open),
    );
    await page.locator("#name").fill("Ana Silva");
    await page.locator("#company").fill("Empresa de teste");
    await page
      .locator("#interest")
      .selectOption({ label: "Anunciar na rede Hexmídia" });
    await page.locator("#message").fill("Quero conhecer as possibilidades.");
    await page.locator('button[type="submit"]').click();
    assert(
      (await page.locator("#message-preview").inputValue()).includes(
        "Ana Silva",
      ),
    );
    await page.locator("#copy-message").click();
    await page.waitForFunction(
      () =>
        document.querySelector("#copy-status").textContent ===
        "Mensagem copiada!",
    );
    assert(
      (await page.evaluate(() => navigator.clipboard.readText())).includes(
        "Empresa de teste",
      ),
    );
    console.log(
      `PASS ${width}px: layout, assets, navigation, FAQ, form, clipboard`,
    );
  }
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto(process.env.BASE_URL || "http://127.0.0.1:8000/");
  await page.screenshot({ path: "/tmp/hexmidia-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "/tmp/hexmidia-mobile.png" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page
      .locator(".hero-asterisk")
      .evaluate((e) => getComputedStyle(e).animationName),
    "none",
  );
  assert.deepEqual(errors, []);
  assert.deepEqual(failed, []);
  console.log(
    "PASS reduced motion; no browser exceptions or failed asset responses",
  );
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto(process.env.BASE_URL || "http://127.0.0.1:8000/");
    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
    const audit = await page.evaluate(() =>
      axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
      }),
    );
    assert.deepEqual(
      audit.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      [],
    );
    console.log(`PASS ${width}px: axe WCAG A/AA audit`);
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
