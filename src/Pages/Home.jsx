import React, { useEffect, useState } from 'react';
import styles from '../Styles/Home.module.css';
import Navbar from '../Component/Navbar';
import BlogCard from '../Component/BlogCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const nav = useNavigate()
    const [blogs, setBlogs] = useState([])
    const [au, setAu] = useState([])

    axios.defaults.withCredentials = true
    const tokenChecker = async () => {

        try {
            const res = await axios.get(`http://localhost:7500/getallblogs`)

            if (!res?.data?.Token) {
                nav('/')
                localStorage.clear()
            }
            else {
                setBlogs(res?.data?.AllBlogs)
                axios.get(`http://localhost:7500/getallusers`)
                    .then(res => setAu(res.data))
                    .catch(er => console.log(er))
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        tokenChecker()
    }, [blogs])

    return (
        <div>
            <Navbar isLogin={false} />


            <div className={styles.container}>
                <h1 style={{ color: "wheat" }}>Welcome to Expresso!</h1>
                <p>Share your thoughts and read amazing content from others.</p>

                <div className={styles.Button} style={{ marginBottom: "50px" }}>
                    <button onClick={() => nav('/newblog')} style={{ backgroundColor: "darkgreen", color: "wheat", width: "auto", fontSize: "large", borderRadius: "20px", padding: "3px" }} >➕Blog</button>
                </div>

                <div className={styles.blogs}>
                    {blogs?.map((blog) => (
                        <BlogCard key={blog._id} blog={blog} allUsers={au} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;