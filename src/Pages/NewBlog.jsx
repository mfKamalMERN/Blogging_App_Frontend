import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Styles/NewBlog.module.css';
import Navbar from '../Component/Navbar';
import axios from 'axios';
import Localization from '../Resources/Localization.json'
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';

const NewBlog = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null)
    const nav = useNavigate();

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleContentChange = (e) => setContent(e.target.value);


    axios.defaults.withCredentials = true

    const tokenChecker = async () => {
        const cookies = new Cookies();
        try {

            // const res = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/getallblogs`)

            if (!cookies.get('token')) {
                localStorage.clear()
                cookies.remove('token')
                nav('/')
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        tokenChecker()
    })

    const handleSubmit = (e) => {
        e.preventDefault();

        // const blogstring = content
        const formdata = new FormData()
        formdata.append('file', file)
        formdata.append('blogstring', content)
        formdata.append('title', title)

        axios.put(`https://blogging-app-backend-dpk0.onrender.com/createblog/${JSON.parse(localStorage.getItem('LoggedInUser'))._id}`, formdata)
            .then((res) => {
                if (res.data.ValidationError) res.data.ActError.map((er) => toast(er.msg))

                else {
                    toast(res.data)
                    nav('/home');
                }

            })
            .catch(er => console.log(er))

    };

    return (
        <div>
            <Navbar />

            <button onClick={() => nav(-1)} className={styles.button} style={{ marginTop: "100px", backgroundColor:"black", }}><h1>🔙</h1></button>

            <div className={styles.container}>
                <h2>{Localization.home.createNewBlog}</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="title">{Localization.home.form.titleLabel}*</label>
                        <input
                            type="text"
                            id="title"
                            placeholder='Title...'
                            value={title}
                            onChange={handleTitleChange}
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="content">{Localization.home.form.contentLabel}*</label>
                        <textarea
                            id="content"
                            placeholder='Content...'
                            value={content}
                            onChange={handleContentChange}
                            className={styles.textarea}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="image">Image (Optional)</label>
                        <input
                            type='file'
                            id="image"
                            placeholder='Image...'
                            onChange={(e) => setFile(e.target.files[0])}
                            className={styles.fileInput}
                        />
                    </div>

                    <button type="submit" className={styles.button}>➕ Blog</button>
                </form>
            </div>
        </div>
    );
};

export default NewBlog;
