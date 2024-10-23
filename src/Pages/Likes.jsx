import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Component/Navbar';
import styles from '../Styles/LikesPage.module.css';
import axios from 'axios';
import BlogCard from '../Component/BlogCard';
import Cookies from 'universal-cookie';

const LikesPage = () => {
    const nav = useNavigate()
    const [likesusers, setLikesUsers] = useState([])
    // const [au, setAu] = useState([])
    const { blogid } = useParams()
    const [blog, setBlog] = useState(null)
    const [fstatus, setFstatus] = useState(false)

    axios.defaults.withCredentials = true

    const tokenChecker = async () => {
        const cookies = new Cookies()
        if (!cookies.get('token')) {
            localStorage.clear()
            cookies.remove('token')
            nav('/')

        }
        else {

            axios.get(`https://blogging-app-backend-dpk0.onrender.com/likesusers/${blogid}`)
                .then((res) => {
                    // if (!res.data.Token) {
                    //     localStorage.clear()
                    //     nav('/')
                    // }
                    // else {
                    setLikesUsers(res.data.LikedUsers)

                    axios.get(`https://blogging-app-backend-dpk0.onrender.com/getblog/${blogid}`)
                        .then(response => {
                            setBlog(response?.data)

                            // axios.get(`https://blogging-app-backend-dpk0.onrender.com/getallusers`)
                            //     .then(res2 => setAu(res2.data))
                            //     .catch(er => console.log(er))
                        })
                        .catch(er => console.log(er))



                    // }
                })
                .catch((er) => console.log(er))
        }
    }

    useEffect(() => {
        tokenChecker()
    }, [fstatus])

    const handleBackClick = () => {
        nav('/home')
    };

    const checkFollowingStatus = (values) => values.includes(JSON.parse(localStorage.getItem('LoggedInUser'))?._id)

    const FollowUnfollow = async (usrid) => {

        try {
            await axios.put(`https://blogging-app-backend-dpk0.onrender.com/followunfollow/${usrid}/${JSON.parse(localStorage.getItem('LoggedInUser'))._id}`)

            setFstatus(!fstatus)

        } catch (error) {
            console.log(error);
        }

    }

    const isLoggedUser = (userid) => JSON.parse(localStorage.getItem('LoggedInUser'))?._id == userid

    return (
        <div>
            <Navbar />
            <div className={styles.all}>

                {blog && <div className={styles.blogcard}>
                    <BlogCard key={blogid} blog={blog} isLikes={true} />
                </div>}

                <div className={styles.container}>
                    <h2>Blog Likes</h2>
                    <div className={styles.likesContainer}>
                        {likesusers.length === 0 ? (
                            <p>No likes yet.</p>
                        ) : (
                            likesusers.map((likeuser) => (
                                <div key={likeuser._id} className={styles.likeCard}>
                                    {likeuser.DP ?
                                        <img src={likeuser.DP} alt="" className={styles.avatar} onClick={() => nav(`/profile/${likeuser._id}`)} />
                                        :
                                        <img src="https://t4.ftcdn.net/jpg/01/16/61/93/360_F_116619399_YA611bKNOW35ffK0OiyuaOcjAgXgKBui.jpg" alt="" className={styles.avatar} onClick={() => nav(`/profile/${likeuser._id}`)} />}

                                    <div className={styles.name} onClick={() => nav(`/profile/${likeuser._id}`)}>{likeuser.Name}</div>

                                    {isLoggedUser(likeuser?._id) ?
                                        <></>
                                        :
                                        checkFollowingStatus(likeuser?.Followers) ?
                                            <button onClick={() => FollowUnfollow(likeuser._id)} className={styles.unfollowbutton}>Unfollow</button>
                                            :
                                            <button onClick={() => FollowUnfollow(likeuser._id)} className={styles.button}>Follow</button>}
                                </div>
                            ))
                        )}
                    </div>
                    <button onClick={handleBackClick} className={styles.backButton}>
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LikesPage;
