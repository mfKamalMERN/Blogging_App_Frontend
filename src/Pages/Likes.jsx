import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Component/Navbar';
import styles from '../Styles/LikesPage.module.css';
// import stylesb from '../Styles/BlogCard.module.css';
import axios from 'axios';
import BlogCard from '../Component/BlogCard';

const LikesPage = () => {
    const nav = useNavigate()
    const [likesusers, setLikesUsers] = useState([])
    const [au, setAu] = useState([])
    const { blogid } = useParams()
    const [blog, setBlog] = useState(null)
    // const [IsFollowing, setIsFollowing] = useState(false)
    const [fstatus, setFstatus] = useState(false)

    axios.defaults.withCredentials = true
    const tokenChecker = async () => {

        try {
            const res = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/likesusers/${blogid}`)

            if (!res.data.Token) {
                localStorage.clear()
                nav('/')
            }
            else {
                setLikesUsers(res.data.LikedUsers)
                const response = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/getblog/${blogid}`)
                setBlog(response.data)

                const res2 = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/getallusers`)
                setAu(res2.data)
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        tokenChecker()
    }, [likesusers, blog, fstatus])

    const handleBackClick = () => {
        nav('/home')
    };

    // const checkFollowingStatus = (usrid) => {

    //     axios.get(`http://localhost:7500/checkfollowingstatus/${usrid}`)
    //         .then((res) => setIsFollowing(res?.data?.isFollowing))
    //         .catch(er => console.log(er))

    //     return IsFollowing
    // }

    const checkFollowingStatus = (values) => values.includes(JSON.parse(localStorage.getItem('LoggedInUser'))?._id)


    const FollowUnfollow = async (usrid) => {

        try {
            await axios.put(`https://blogging-app-backend-dpk0.onrender.com/followunfollow/${usrid}`)
            // checkFollowingStatus(usrid)
            setFstatus(!fstatus)

        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div>
            <Navbar />
            <div className={styles.all}>

                {blog &&
                    <div className={styles.blogcard}>
                        <BlogCard key={blogid} blog={blog} allUsers={au} isLikes={true} />
                    </div>
                }

                <div className={styles.container}>
                    <h2>Blog Likes</h2>
                    <div className={styles.likesContainer}>
                        {likesusers.length === 0 ? (
                            <p>No likes yet.</p>
                        ) : (
                            likesusers.map((likeuser) => (
                                <div key={likeuser._id} className={styles.likeCard}>
                                    <img src={likeuser.DP} alt="" className={styles.avatar} onClick={() => nav(`/profile/${likeuser._id}`)} />
                                    <div className={styles.name} onClick={() => nav(`/profile/${likeuser._id}`)}>{likeuser.Name}</div>
                                    {
                                        JSON.parse(localStorage.getItem('LoggedInUser'))?._id == likeuser._id ?
                                            <></>
                                            :
                                            checkFollowingStatus(likeuser?.Followers) ?
                                                <button onClick={() => FollowUnfollow(likeuser._id)} className={styles.button}>Unfollow</button>
                                                :
                                                <button onClick={() => FollowUnfollow(likeuser._id)} className={styles.button}>Follow</button>

                                    }
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
