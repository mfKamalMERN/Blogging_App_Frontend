import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Styles/NewBlog.module.css';
import Navbar from '../Component/Navbar';

const NewBlog = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    // const [image, setImage] = useState(null);
    const nav = useNavigate();

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleContentChange = (e) => setContent(e.target.value);

    // const handleImageChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setImage(reader.result);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle blog creation logic here
        alert('Blog created successfully');
        nav('/home');
    };

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <h2>Create New Blog</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={handleTitleChange}
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="content">Content</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={handleContentChange}
                            className={styles.textarea}
                            required
                        />
                    </div>
                    
                    
                    <button type="submit" className={styles.button}>Create Blog</button>
                </form>
            </div>
        </div>
    );
};

export default NewBlog;
