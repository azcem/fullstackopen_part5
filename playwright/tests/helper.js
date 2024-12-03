const loginWith = async (page, username, password) => {
  await page.getByTestId("username").fill(username);
  await page.getByTestId("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, blog, newBlog = true) => {
  if (newBlog) {
    const locator = await page.getByRole("button", { name: "new blog" });
    if (locator.isVisible()) await locator.click();
  }
  await page.getByPlaceholder("blog's title").fill(blog.title);
  await page.getByPlaceholder("author's name").fill(blog.author);
  await page.getByPlaceholder("blog's url").fill(blog.url);
  await page.getByRole("button", { name: "create" }).click();
};

export { loginWith, createBlog };
