import {
  test,
  expect,
} from "@playwright/test";

test.describe("KiwiKids local acceptance", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => {
      localStorage.clear();
    });

    await page.reload();
  });

  test("homepage navigation works", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        level: 1,
      }),
    ).toBeVisible();

    const browseLink = page.locator(
      'a[href="/ece"]',
    ).filter({
      hasText: "Browse all childcare",
    });

    await expect(browseLink).toBeVisible();

    await browseLink.click();

    await page.waitForURL(
      "**/ece",
      { timeout: 20_000 },
    );

    await expect(page).toHaveURL(/\/ece$/);
  });

  test("homepage search reaches filtered ECE listing", async ({
    page,
  }) => {
    await page
      .getByLabel("Location")
      .fill("Onehunga");

    await page
      .getByLabel("Child's age")
      .selectOption("36");

    await page
      .getByRole("button", {
        name: "Find childcare",
      })
      .click();

    await expect(page).toHaveURL(
      /\/ece\?.*search=Onehunga/,
    );

    await expect(page).toHaveURL(
      /age_months=36/,
    );

    await expect(
      page.getByText(/Onehunga/i).first(),
    ).toBeVisible();
  });

  test("listing save persists into Saved page", async ({
    page,
  }) => {
    await page.goto("/ece?search=Onehunga");

    const saveButton = page
      .getByRole("button", {
        name: /^Save$/,
      })
      .first();

    await expect(saveButton).toBeVisible();

    await saveButton.click();

    await expect(
      page
        .getByRole("button", {
          name: /^Saved$/,
        })
        .first(),
    ).toBeVisible();

    await page
      .getByRole("link", {
        name: "Saved",
      })
      .click();

    await expect(page).toHaveURL(/\/ece\/saved/);

    await expect(
      page.getByRole("heading", {
        name: /Saved ECE services/i,
      }),
    ).toBeVisible();
  });

  test("listing compare persists and opens compare page", async ({
    page,
  }) => {
    await page.goto("/ece");

    const addToCompare = page
      .getByRole("button", {
        name: /Add to compare/i,
      })
      .first();

    await expect(addToCompare).toBeVisible();

    await addToCompare.click();

    await expect(
      page.getByText(/selected/i).first(),
    ).toBeVisible();

    const compareSelected =
      page.getByRole("link", {
        name: /Compare selected/i,
      });

    await expect(compareSelected).toBeVisible();

    await compareSelected.click();

    await expect(page).toHaveURL(
      /\/ece\/compare\?services=/,
    );

    await expect(
      page.getByRole("heading", {
        name: /Compare early learning services/i,
      }),
    ).toBeVisible();
  });

  test("detail shortlist and compare actions work", async ({
    page,
  }) => {
    await page.goto("/ece");

    const detailsLink = page
      .locator('a[href^="/ece/"]')
      .filter({
        hasText: "View details",
      })
      .first();

    await expect(detailsLink).toBeVisible();

    const href =
      await detailsLink.getAttribute("href");

    expect(href).toBeTruthy();

    await detailsLink.click();

    await page.waitForURL(
      "**/ece/**",
      { timeout: 20_000 },
    );

    await expect(page).toHaveURL(
      /\/ece\/[^?]+$/,
    );

    const shortlistButton =
      page.getByRole("button", {
        name: /Add to shortlist/i,
      });

    await expect(shortlistButton).toBeVisible();

    await shortlistButton.click();

    await expect(
      page.getByRole("button", {
        name: /Remove from shortlist/i,
      }),
    ).toBeVisible();

    const compareButton =
      page.getByRole("button", {
        name: /Add to compare/i,
      });

    await compareButton.click();

    await expect(
      page.getByRole("button", {
        name: /Remove from compare/i,
      }),
    ).toBeVisible();
  });

  test("recommendation form returns results", async ({
    page,
  }) => {
    await page.goto("/ece/recommendations");

    await page
      .getByLabel("Area / Town")
      .selectOption("Auckland");

    await page
      .getByLabel("Suburb")
      .selectOption("Onehunga");

    await page
      .getByLabel("20 Hours ECE")
      .selectOption("true");

    await page
      .getByRole("button", {
        name: "Find my matches",
      })
      .click();

    await expect(page).toHaveURL(
      /\/ece\/recommendations$/,
    );

    await expect(
      page.getByText(/Best matches/i),
    ).toBeVisible();

    await expect(
      page.getByText(/Match/i).first(),
    ).toBeVisible();

    const currentUrl = page.url();

    expect(currentUrl).not.toContain(
      "latitude=",
    );

    expect(currentUrl).not.toContain(
      "longitude=",
    );

    expect(currentUrl).not.toContain(
      "suburb=",
    );
  });

  test("recommendation result opens service detail", async ({
    page,
  }) => {
    await page.goto("/ece/recommendations");

    await page
      .getByLabel("Area / Town")
      .selectOption("Auckland");

    await page
      .getByLabel("Suburb")
      .selectOption("Onehunga");

    await page
      .getByRole("button", {
        name: "Find my matches",
      })
      .click();

    await expect(
      page.getByText(/Best matches/i),
    ).toBeVisible();

    const detailLink =
      page.getByRole("link", {
        name: /View service details/i,
      })
      .first();

    await expect(detailLink).toBeVisible();

    await detailLink.click();

    await expect(page).toHaveURL(
      /\/ece\/[^?]+$/,
    );
  });
});
