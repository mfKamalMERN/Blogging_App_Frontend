import React from 'react';
import styles from '../Styles/Home.module.css';
import Navbar from '../Component/Navbar';
import BlogCard from '../Component/BlogCard';

const Home = () => {
  const user = { name: 'Current User', avatar: 'https://via.placeholder.com/50' }; // Replace with actual user data
  const blogs = [
    {
      id: 1,
      title: 'First Blog',
      content: 'This is the content of the first blog.',
      user: 'John Doe',
      ownerAvatar: 'https://via.placeholder.com/50', // Replace with actual avatar URL
      likes: 5,
      comments: [
        { id: 1, user: 'Jane Doe', content: 'Great post!', editable: false },
        { id: 2, user: 'Current User', content: 'Nice article.', editable: true },
      ],
    },
    // Add more blog objects as needed
  ];

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h1>Welcome to BlogApp!</h1>
        <p>Share your thoughts and read amazing content from others.</p>
        <div className={styles.blogs}>
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};
  
  export default Home;