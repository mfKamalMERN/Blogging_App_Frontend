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
    const { blogid } = useParams()
    const [blog, setBlog] = useState(null)
    const [IsFollowing, setIsFollowing] = useState(false)

    axios.defaults.withCredentials = true
    const tokenChecker = async () => {

        try {
            const res = await axios.get(`http://localhost:7500/likesusers/${blogid}`)

            if (!res.data.Token) {
                localStorage.clear()
                nav('/')
            }
            else {
                setLikesUsers(res.data.LikedUsers)
                const response = await axios.get(`http://localhost:7500/getblog/${blogid}`)
                setBlog(response.data)
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        tokenChecker()
    }, [likesusers, blog])

    const handleBackClick = () => {
        nav('/home')
    };

    const checkFollowingStatus = (usrid) => {

        axios.get(`http://localhost:7500/checkfollowingstatus/${usrid}`)
            .then((res) => setIsFollowing(res?.data?.isFollowing))
            .catch(er => console.log(er))

        return IsFollowing
    }

    const FollowUnfollow = async (usrid) => {

        try {
            await axios.put(`http://localhost:7500/followunfollow/${usrid}`)
            checkFollowingStatus(usrid)

        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div>
            <Navbar />
            <div className="all" style={{ display: "flex", justifyContent: "space-between", marginTop: "220px" }}>


                {blog &&
                    <div style={{ marginLeft: "20%", height: "90px" }}>
                        <BlogCard key={blogid} blog={blog} />
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
                                    <img src={likeuser.DP} alt={likeuser.Name} className={styles.avatar} onClick={() => nav(`/profile/${likeuser._id}`)} />
                                    <div className={styles.name} onClick={() => nav(`/profile/${likeuser._id}`)}>{likeuser.Name}</div>
                                    {
                                        JSON.parse(localStorage.getItem('LoggedInUser'))._id == likeuser._id ?
                                            <></>
                                            :
                                            checkFollowingStatus(likeuser._id) ?
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
