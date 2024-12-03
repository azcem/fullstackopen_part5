const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");
const { console } = require("inspector");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        Name: "Assem Ahmed",
        username: "root",
        password: "root",
      },
    });
    await page.goto("/");
  });

  test("login form is shown", async ({ page }) => {
    await expect(page.getByText("login to the application")).toBeVisible();
    await expect(page.getByTestId("username")).toBeVisible();
    await expect(page.getByTestId("password")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "root", "root");
      await expect(page.getByText("logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "root", "wrong");
      await expect(page.getByText("Wrong credentials")).toBeVisible();
    });
  });

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "root", "root");
      //create blog
      await createBlog(page, {
        title: "testing new function",
        author: "assem",
        url: "http://localhost.com",
      });
    });

    test("a new blog can be created", async ({ page }) => {
      await expect(page.getByText("testing new function")).toBeVisible();
    });

    test("check likes", async ({ page }) => {
      await page.getByRole("button", { name: "show" }).first().click();
      await page.getByRole("button", { name: "like" }).click();
      await page.getByText("likes 1").waitFor();
    });

    test("check delete blog", async ({ page }) => {
      await page.getByRole("button", { name: "show" }).click();
      page.on("dialog", (dialog) => dialog.accept());
      await page.getByRole("button", { name: "remove" }).click();
      await expect(page.getByText("testing new function")).not.toBeVisible();
    });

    test("only blog user can delete it", async ({ page, request }) => {
      //add other user
      await request.post("/api/users", {
        data: {
          Name: "Assem Ahmed",
          username: "otheruser",
          password: "otheruser",
        },
      });

      //logout
      await page.getByRole("button", { name: "logout" }).click();
      //login with other user
      await loginWith(page, "otheruser", "otheruser");
      //check remove button doesn't exist
      await expect(
        page.getByRole("button", { name: "remove" }),
      ).not.toBeVisible();
    });

    test("check sorted likes", async ({ page }) => {
      //create another blog
      await createBlog(
        page,
        {
          title: "testing sorted likes",
          author: "assem",
          url: "http://localhost.com",
        },
        false,
      );
      await page.waitForTimeout(10000);
      //like the other blog
      const locator = page.getByRole("button", { name: "show" }).nth(1);

      await locator.click();
      await page.getByRole("button", { name: "like" }).click();
      //check if it goes above the first one
      await page.getByRole("button", { name: "hide" }).waitFor();

      await page.waitForTimeout(1000);
      const leastLikedBox = await page
        .getByRole("button", { name: "show" })
        .boundingBox();
      const mostLikedBox = await page
        .getByRole("button", { name: "hide" })
        .boundingBox();
      console.log(mostLikedBox, leastLikedBox);
      expect(mostLikedBox.y < leastLikedBox.y).toBeTruthy();
    });
  });
});
