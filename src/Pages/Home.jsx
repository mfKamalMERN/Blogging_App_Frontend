import React, { useEffect, useState } from 'react';
import styles from '../Styles/Home.module.css';
import Navbar from '../Component/Navbar';
import BlogCard from '../Component/BlogCard';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { HomeBackNavigations } from '../Component/HomeBackNavigations';
import { toast } from 'react-toastify';

const Home = () => {
    const nav = useNavigate()
    const [blogs, setBlogs] = useState([])
    const { userid } = useParams()
    const [au, setAu] = useState([])
    const [name, setName] = useState('')

    axios.defaults.withCredentials = true

    const tokenChecker = async () => {
        const cookies = new Cookies()

        try {
            if (userid) {
                if (!cookies.get('token') || !localStorage.getItem('token')) {
                    localStorage.clear()
                    cookies.remove('token')
                    toast(`Kindly login/Sign up`)
                    nav('/')
                }
                
                else {
                    const res = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/getuserblogs/${userid}/${JSON.parse(localStorage.getItem('LoggedInUser'))?._id}`)
                    // if (!blogs.length)
                    setBlogs(res?.data?.UserBlogs)
                    setName(res?.data?.Name)
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
                    toast(`Kindly login/Sign up`)
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
                {!name ?
                    <h1 style={{ color: "wheat" }}>IonVibe 💡⚛️🚥</h1>
                    :
                    <>
                        <HomeBackNavigations styles={styles} />
                        <h2 style={{ color: "wheat", marginBottom: "40px" }}>Vibes of {name} 💡⚛️</h2>
                    </>}

                {/* <p>Share your thoughts and read amazing content from others.</p> */}

                {!name && <p>using "ion" to convey energy and vibes in science.</p>}

                {!name && <div className={styles.Button} style={{ marginBottom: "50px" }}>
                    <button onClick={() => nav('/newblog')} style={{ backgroundColor: "black", color: "wheat", width: "auto", fontSize: "large", borderRadius: "20px", padding: "10px", border: "1px solid wheat" }} ><h2>➕ Thoughts 💡🚵‍♀️⚽</h2></button>
                </div>}

                {!blogs.length ?
                    <h1 style={{ color: "wheat" }}>No Blogs yet...</h1>
                    :
                    <div className={styles.blogs}>
                        {blogs.length && blogs?.map((blog) => {
                            if (blog) return <BlogCard key={blog._id} blog={blog} allUsers={au} tokenChecker={tokenChecker} />
                        })}

                    </div>
                }
            </div>
        </div>
    );
};

export default Home;