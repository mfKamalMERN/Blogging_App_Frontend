import React, { useEffect, useState } from 'react';
import styles from '../Styles/Home.module.css';
import Navbar from '../Component/Navbar';
import BlogCard from '../Component/BlogCard';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';

const Home = () => {
    const nav = useNavigate()
    const [blogs, setBlogs] = useState([])
    const { userid } = useParams()
    const [au, setAu] = useState([])

    axios.defaults.withCredentials = true

    const tokenChecker = async () => {
        const cookies = new Cookies()

        try {
            if (userid) {
                if (!cookies.get('token') || !localStorage.getItem('token')) {
                    localStorage.clear()
                    cookies.remove('token')
                    nav('/')
                }

                else {
                    const res = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/getuserblogs/${userid}/${JSON.parse(localStorage.getItem('LoggedInUser'))?._id}`)
                    // if (!blogs.length)
                    setBlogs(res?.data?.UserBlogs)
                    // console.log(res.data.Token);

                    axios.get(`https://blogging-app-backend-dpk0.onrender.com/getallusers`)
                        .then(resp => setAu(resp?.data))
                        .catch(er => console.log(er))
                }
            }

            else {
                if (!cookies.get('token') || !localStorage.getItem('token')) {
                    localStorage.clear()
                    cookies.remove('token')
                    nav('/')
                }
                else {
                    const res = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/getallblogs/${JSON.parse(localStorage.getItem('LoggedInUser'))._id}`)
                    console.log(cookies.get('token'));
                    // if (!blogs.length) 
                    setBlogs(res?.data?.AllBlogs)
                    // setBlogs(res?.data?.AllBlogs)

                    axios.get(`https://blogging-app-backend-dpk0.onrender.com/getallusers`)
                        .then(resp => setAu(resp.data))
                        .catch(er => console.log(er))
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        tokenChecker()
    }, [])

    // [blogs]

    return (
        <div>
            <Navbar isLogin={false} fromHome={true} userid={userid} />

            <div className={styles.container}>
                <h1 style={{ color: "wheat" }}>Welcome to MUFAISA 🦁🦁!</h1>
                <p>Share your thoughts and read amazing content from others.</p>

                <div className={styles.Button} style={{ marginBottom: "50px" }}>
                    <button onClick={() => nav('/newblog')} style={{ backgroundColor: "black", color: "wheat", width: "auto", fontSize: "large", borderRadius: "20px", padding: "10px" }} ><h2>💭💭➕</h2></button>
                </div>

                <div className={styles.blogs}>
                    {blogs.length && blogs?.map((blog) => {
                        if (blog) return <BlogCard key={blog._id} blog={blog} allUsers={au} tokenChecker={tokenChecker} />
                    })}

                </div>
            </div>
        </div>
    );
};

export default Home;