import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Styles/NewBlog.module.css';
import Navbar from '../Component/Navbar';
import axios from 'axios';

const NewBlog = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const nav = useNavigate();

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleContentChange = (e) => setContent(e.target.value);


    axios.defaults.withCredentials = true

    const handleSubmit = (e) => {
        e.preventDefault();

        const blogstring = content

        axios.post(`http://localhost:7500/createblog`, { blogstring, title })
            .then((res) => {
                if (res.data.ValidationError) res.data.ActError.map((er) => alert(er.msg))

                else {
                    alert(res.data)
                    nav('/home');
                }

            })
            .catch(er => console.log(er))

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
