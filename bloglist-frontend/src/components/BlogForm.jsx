import { useState } from "react";
const BlogForm = ({ handleAddBlogs }) => {
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogAuthor, setNewBlogAuthor] = useState("");
  const [newBlogURL, setNewBlogURL] = useState("");
  return (
    <>
      <h2>Create new blog </h2>
      <form onSubmit={handleAddBlogs(newBlogTitle, newBlogAuthor, newBlogURL)}>
        <div>
          title
          <input
            type="text"
            name="title"
            placeholder="blog's title"
            value={newBlogTitle}
            onChange={({ target }) => setNewBlogTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            type="text"
            name="author"
            placeholder="author's name"
            value={newBlogAuthor}
            onChange={({ target }) => setNewBlogAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            type="text"
            name="url"
            placeholder="blog's url"
            value={newBlogURL}
            onChange={({ target }) => setNewBlogURL(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default BlogForm;
