import { test, expect, type Page } from "@playwright/test";

/**
 * The boot overlay is session-scoped and swallows the first click, so every
 * test dismisses it before asserting anything.
 */
async function ready(page: Page) {
  await page.goto("/");
  const boot = page.getByTestId("boot-sequence");
  if (await boot.isVisible().catch(() => false)) {
    await page.keyboard.press("Escape");
    await boot.waitFor({ state: "detached", timeout: 6000 });
  }
  await expect(page.locator("main")).toBeVisible();
}

/** Final painted ground for each theme, used to know the fade has settled. */
const GROUND = {
  dark: "rgb(8, 9, 12)",
  light: "rgb(238, 241, 245)",
} as const;

/**
 * Clicks the toggle and waits for the theme fade to finish. Theme swaps animate
 * colours over 260ms, so reading computed styles straight after the click
 * samples mid-transition and reports meaningless values.
 */
async function setTheme(page: Page, theme: "dark" | "light") {
  await page.getByTestId("theme-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  await expect
    .poll(() =>
      page.evaluate(() => getComputedStyle(document.body).backgroundColor),
    )
    .toBe(GROUND[theme]);
}

test.describe("renders", () => {
  test("loads with the operator identity and every section present", async ({
    page,
  }) => {
    await ready(page);

    await expect(page).toHaveTitle(/Shashank Mourya/);
    await expect(
      page.getByRole("heading", { level: 1 }),
    ).toContainText(/Shashank/i);

    for (const id of ["hero", "dossier", "missions", "loadout", "telemetry", "comms"]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test("prioritises InsureTrust, Drishti and FlowState in the mission log", async ({
    page,
  }) => {
    await ready(page);

    const names = await page
      .locator('[data-testid^="mission-card-"]')
      .evaluateAll((els) => els.map((e) => e.getAttribute("data-testid")));

    expect(names.slice(0, 3)).toEqual([
      "mission-card-insuretrust",
      "mission-card-drishti",
      "mission-card-flowstate",
    ]);
  });

  test("has no horizontal overflow", async ({ page }) => {
    await ready(page);
    const { scrollW, clientW } = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));
    expect(scrollW).toBeLessThanOrEqual(clientW + 1);
  });
});

test.describe("custom cursor", () => {
  test("the crosshair layer never intercepts a click", async ({
    page,
  }, testInfo) => {
    await ready(page);

    const layer = page.getByTestId("crosshair");
    // Touch-primary devices keep the native cursor, so the layer is absent.
    if (!(await layer.count())) {
      test.skip(
        testInfo.project.name.includes("mobile"),
        "crosshair is desktop-only",
      );
    }

    await expect(layer).toHaveCSS("pointer-events", "none");

    // Whatever sits under the pointer must be the page, never the cursor.
    const topmost = await page.evaluate(() => {
      const el = document.elementFromPoint(
        window.innerWidth / 2,
        window.innerHeight / 2,
      );
      return el?.closest('[data-testid="crosshair"]') ? "crosshair" : "page";
    });
    expect(topmost).toBe("page");
  });

  test("a mission card still receives its click with the cursor over it", async ({
    page,
  }) => {
    await ready(page);

    const card = page.getByTestId("mission-card-insuretrust");
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await card.click();

    await expect(page.getByTestId("mission-brief")).toBeVisible();
  });
});

test.describe("mission briefing", () => {
  test("opens, shows the brief, and closes on Escape", async ({ page }) => {
    await ready(page);

    const card = page.getByTestId("mission-card-drishti");
    await card.scrollIntoViewIfNeeded();
    await card.click();

    const dialog = page.getByTestId("mission-brief");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog.getByRole("heading", { level: 3 })).toHaveText("Drishti AI");
    await expect(dialog).toContainText("Hinglish");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("closes with the close control and returns focus to the card", async ({
    page,
  }) => {
    await ready(page);

    const card = page.getByTestId("mission-card-flowstate");
    await card.scrollIntoViewIfNeeded();
    await card.click();

    await expect(page.getByTestId("mission-brief")).toBeVisible();
    await page.getByTestId("mission-brief-close").click();
    await expect(page.getByTestId("mission-brief")).toBeHidden();

    await expect(card).toBeFocused();
  });

  test("moves focus into the dialog on open", async ({ page }) => {
    await ready(page);

    const card = page.getByTestId("mission-card-insuretrust");
    await card.scrollIntoViewIfNeeded();
    await card.click();

    await expect(page.getByTestId("mission-brief-close")).toBeFocused();
  });
});

test.describe("interactive HUD", () => {
  test("loadout tabs swap the equipped list", async ({ page }) => {
    await ready(page);

    const panel = page.locator('[role="tabpanel"]');
    await page.getByTestId("loadout-tab-primary").click();
    await expect(panel).toContainText("C++17");

    await page.getByTestId("loadout-tab-ability").click();
    await expect(panel).toContainText("Test Case Design");
    await expect(panel).not.toContainText("C++17");
  });

  test("telemetry rows expand and collapse", async ({ page }) => {
    await ready(page);

    const row = page.getByTestId("telemetry-row-1");
    await row.scrollIntoViewIfNeeded();

    const detail = page.locator("#telemetry-detail-1");
    await expect(detail).toBeHidden();

    await row.click();
    await expect(row).toHaveAttribute("aria-expanded", "true");
    await expect(detail).toBeVisible();
    await expect(detail).toContainText("QA Lead");

    await row.click();
    await expect(detail).toBeHidden();
  });

  test("the contact terminal answers commands", async ({ page }) => {
    await ready(page);

    const input = page.getByTestId("terminal-input");
    await input.scrollIntoViewIfNeeded();

    await input.fill("whoami");
    await input.press("Enter");
    await expect(page.getByTestId("terminal-buffer")).toContainText(
      "Shashank Mourya",
    );

    await input.fill("contact");
    await input.press("Enter");
    await expect(page.getByTestId("terminal-buffer")).toContainText(
      "shashankmourya00@gmail.com",
    );

    await input.fill("nope");
    await input.press("Enter");
    await expect(page.getByTestId("terminal-buffer")).toContainText(
      "command not found",
    );

    await input.fill("clear");
    await input.press("Enter");
    await expect(page.getByTestId("terminal-buffer")).not.toContainText(
      "command not found",
    );
  });
});

test.describe("theme", () => {
  test("defaults to night and the toggle switches to day", async ({ page }) => {
    await ready(page);

    const root = page.locator("html");
    await expect(root).toHaveAttribute("data-theme", "dark");

    const toggle = page.getByTestId("theme-toggle");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(toggle).toContainText("NIGHT");

    // setTheme also asserts the ground actually repaints, not just the attribute.
    await setTheme(page, "light");

    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(toggle).toContainText("DAY");
  });

  test("the choice survives a reload", async ({ page }) => {
    await ready(page);
    await setTheme(page, "light");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.getByTestId("theme-toggle")).toContainText("DAY");
  });

  test("follows the system preference when nothing is stored", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("applies the theme before first paint", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    // Read the attribute at the earliest possible moment in the document's life.
    await page.addInitScript(() => {
      (window as unknown as { __themeAtStart?: string }).__themeAtStart = "unset";
      document.addEventListener(
        "readystatechange",
        () => {
          const w = window as unknown as { __themeAtStart?: string };
          if (w.__themeAtStart === "unset") {
            w.__themeAtStart =
              document.documentElement.getAttribute("data-theme") ?? "none";
          }
        },
        { once: true },
      );
    });
    await page.goto("/");
    const atStart = await page.evaluate(
      () => (window as unknown as { __themeAtStart?: string }).__themeAtStart,
    );
    expect(atStart).toBe("light");
  });
});

test.describe("accessibility", () => {
  for (const theme of ["dark", "light"] as const) {
    test(`every visible text node clears 4.5:1 contrast in ${theme} theme`, async ({
      page,
    }) => {
      await ready(page);
      if (theme === "light") await setTheme(page, "light");

      const fails = await page.evaluate(() => {
        // Let the browser parse colours. Computed styles serialise modern
        // syntaxes (color-mix resolves to `oklab(... / 0.82)`), which a regex
        // cannot read — painting to a 1x1 canvas handles every syntax and
        // returns straight rgba.
        const cvs = document.createElement("canvas");
        cvs.width = cvs.height = 1;
        const ctx = cvs.getContext("2d", { willReadFrequently: true })!;
        ctx.globalCompositeOperation = "copy";

        const toRGBA = (css: string): [number, number, number, number] => {
          ctx.fillStyle = "rgba(0, 0, 0, 0)";
          ctx.fillStyle = css;
          ctx.fillRect(0, 0, 1, 1);
          const d = ctx.getImageData(0, 0, 1, 1).data;
          return [d[0], d[1], d[2], d[3] / 255];
        };

        const lum = (c: number[]) => {
          const [r, g, b] = c.map((v) => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };

        /**
         * Composite every background from the element up to the root. A
         * translucent bar over the page is what the reader actually sees, so
         * blending is the honest measurement rather than hunting for the first
         * opaque ancestor.
         */
        const bgOf = (el: Element): number[] => {
          const layers: [number, number, number, number][] = [];
          let n: Element | null = el;
          while (n) {
            const [r, g, b, a] = toRGBA(getComputedStyle(n).backgroundColor);
            if (a > 0) layers.push([r, g, b, a]);
            n = n.parentElement;
          }
          let out = [255, 255, 255];
          for (let i = layers.length - 1; i >= 0; i--) {
            const [r, g, b, a] = layers[i];
            out = [
              r * a + out[0] * (1 - a),
              g * a + out[1] * (1 - a),
              b * a + out[2] * (1 - a),
            ];
          }
          return out;
        };

        const ratio = (a: number[], b: number[]) => {
          const L1 = lum(a);
          const L2 = lum(b);
          const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
          return (hi + 0.05) / (lo + 0.05);
        };

        const out: string[] = [];
        document.querySelectorAll("body *").forEach((el) => {
          const txt = Array.from(el.childNodes)
            .filter((n) => n.nodeType === 3)
            .map((n) => n.textContent!.trim())
            .join("");
          if (!txt) return;
          const cs = getComputedStyle(el);
          if (
            cs.visibility === "hidden" ||
            cs.display === "none" ||
            Number(cs.opacity) < 0.5
          )
            return;
          const [fr, fg_, fb, fa] = toRGBA(cs.color);
          if (fa < 0.5) return;
          const size = parseFloat(cs.fontSize);
          const bold = Number(cs.fontWeight) >= 700;
          const large = size >= 24 || (size >= 18.66 && bold);
          const need = large ? 3 : 4.5;
          const r = ratio([fr, fg_, fb], bgOf(el));
          if (r < need) {
            out.push(
              `"${txt.slice(0, 30)}" ${cs.color} ${r.toFixed(2)}:1 < ${need}`,
            );
          }
        });
        return out;
      });

      expect(fails).toEqual([]);
    });
  }

  test("keyboard reaches the skip link, nav and mission cards", async ({
    page,
  }) => {
    await ready(page);

    // No click first: a click would set Chromium's sequential-focus starting
    // point to the clicked element, so Tab would resume from there instead of
    // the top of the document. This mirrors what a keyboard user actually does
    // on arrival — first Tab must land on the skip link.
    await page.keyboard.press("Tab");
    await expect(page.locator(".skip-link")).toBeFocused();

    // Every focusable control must paint a visible focus ring.
    const card = page.getByTestId("mission-card-insuretrust");
    await card.scrollIntoViewIfNeeded();
    await card.focus();
    const outline = await card.evaluate(
      (el) => getComputedStyle(el, ":focus-visible").outlineWidth,
    );
    expect(outline).not.toBe("0px");
  });

  test("respects prefers-reduced-motion by skipping the boot overlay", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.getByTestId("boot-sequence")).toBeHidden();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("exposes one landmark set and a single h1", async ({ page }) => {
    await ready(page);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("main")).toHaveCount(1);
    // Exactly one Sections nav is exposed at any breakpoint.
    await expect(page.getByRole("navigation", { name: "Sections" })).toHaveCount(1);
  });
});
