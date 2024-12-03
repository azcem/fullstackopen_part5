import { useState } from "react";
import blogService from "../services/blogs";
import PropTypes from "prop-types";

const Blog = ({ blog, blogs, setBlogs }) => {
  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    blogs: PropTypes.array.isRequired,
    setBlogs: PropTypes.func.isRequired,
  };
  const [showDetails, setShowDetails] = useState(false);

  const likeBlog = async () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    const savedBlog = await blogService.update(updatedBlog);
    setBlogs(
      blogs
        .map((blog) => (blog.id === savedBlog.id ? savedBlog : blog))
        .sort((a, b) => b.likes - a.likes),
    );
    console.log(blogs);
  };

  const deleteBlog = async () => {
    if (!window.confirm(`delete ${blog.title}?`)) return;

    const response = await blogService.remove(blog);
    if (response.status !== 204) return;

    setBlogs(blogs.filter((b) => b.id !== blog.id));
  };

  const isUserAllowedToDelete =
    "user" in blog
      ? window.localStorage.getItem("loggedBlogAppUsername") ===
        blog.user.username
      : false;

  const blogDetails = () => {
    return (
      <div>
        {blog.url}
        <br />
        likes {blog.likes} <button onClick={likeBlog}>like</button>
        <br />
        {isUserAllowedToDelete && <button onClick={deleteBlog}>remove</button>}
      </div>
    );
  };
  return (
    <div>
      {blog.title} {blog.author}
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? "hide" : "show"}
      </button>
      {showDetails && blogDetails()}
    </div>
  );
};

export default Blog;
