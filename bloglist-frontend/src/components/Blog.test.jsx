import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

const blog = {
  author: "Assem Ahmed",
  title: "Testing title and author",
  url: "http://localhost.com",
  likes: 7,
  id: "48239u392824",
};

test("renders content", async () => {
  render(<Blog blog={blog} />);

  const element = await screen.findByText(blog.title + " " + blog.author);
  const like = screen.queryByText(blog.likes);
  const url = screen.queryByText(blog.url);
  expect(like).toBeNull();
  expect(url).toBeNull();
});

test("clicking the button", async () => {
  render(<Blog blog={blog} />);

  const user = userEvent.setup();
  const button = screen.getByText("show");
  await user.click(button);

  const like = screen.queryByText(blog.likes);
  const url = screen.queryByText(blog.url);
  expect(like).toBeDefined();
  expect(url).toBeDefined();
});

test("liking blog twice", async () => {
  const mockHandler = vi.fn();
  render(<Blog blogs={[blog]} blog={blog} setBlogs={mockHandler} />);
  const user = userEvent.setup();
  const button = screen.getByText("show");
  await user.click(button);
  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);
  expect(mockHandler.mock.calls).toHaveLength(2);
});

test("create new blog", async () => {
  render();
});
