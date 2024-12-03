import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";
import { expect } from "vitest";

const blog = {
  author: "Assem Ahmed",
  title: "Testing title and author",
  url: "http://localhost.com",
  likes: 7,
  id: "48239u392824",
};

test("create new blog", async () => {
  const mockHandler = vi.fn();
  render(<BlogForm handleAddBlogs={mockHandler} />);

  const user = userEvent.setup();

  const titleInput = screen.getByPlaceholderText("blog's title");
  await user.type(titleInput, blog.title);
  const authorInput = screen.getByPlaceholderText("author's name");
  await user.type(authorInput, blog.author);
  const urlInput = screen.getByPlaceholderText("blog's url");
  await user.type(urlInput, blog.url);

  const button = screen.getByText("create");
  await user.click(button);
  const args = mockHandler.mock.calls.pop();
  expect(args[0]).toBe(blog.title);
  expect(args[1]).toBe(blog.author);
  expect(args[2]).toBe(blog.url);
});
