import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const Notification = ({ message }) => {
  if (!message) return <div></div>;
  return (
    <div>
      <h2>{message}</h2>
    </div>
  );
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const asyncgetAll = async () => {
      const blogs = await blogService.getAll();
      setBlogs(blogs.sort((a, b) => b.likes - a.likes));
    };
    asyncgetAll();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      setUsername(window.localStorage.getItem("loggedBlogAppUsername"));
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      blogService.setToken(user.token);
      setUser(user);
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      window.localStorage.setItem("loggedBlogAppUsername", username);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 500);
    }
  };

  const handleAddBlogs = (newBlogTitle, newBlogAuthor, newBlogURL) => {
    const addBlog = async (event) => {
      event.preventDefault();
      try {
        const newBlog = {
          title: newBlogTitle,
          author: newBlogAuthor,
          url: newBlogURL,
        };
        const savedBlog = await blogService.create(newBlog);
        console.log(savedBlog);
        setBlogs(blogs.concat(savedBlog));
        setErrorMessage("new blog added successfully");
        setTimeout(() => {
          setErrorMessage(null);
        }, 500);
      } catch (exception) {
        console.log(exception);
      }
    };
    return addBlog;
  };

  const loginForm = () => {
    return (
      <>
        <h2>login to the application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="username"
              data-testid="username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="password"
              data-testid="password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </>
    );
  };

  const blogShow = () => {
    return (
      <>
        <h2>blogs</h2>
        <h3>{username} logged in </h3>
        <form onSubmit={() => window.localStorage.clear()}>
          <button type="submit">logout</button>
        </form>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} blogs={blogs} setBlogs={setBlogs} />
        ))}
      </>
    );
  };

  return (
    <div>
      <Notification message={errorMessage} />
      {user === null && loginForm()}
      {user !== null && blogShow()}
      <Togglable buttonLabel="new blog">
        <BlogForm handleAddBlogs={handleAddBlogs} />
      </Togglable>
    </div>
  );
};

export default App;
