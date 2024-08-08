import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Component/Navbar';
import styles from '../Styles/LikesPage.module.css';
import axios from 'axios';

const LikesPage = () => {
    const nav = useNavigate()
    const [likesusers, setLikesUsers] = useState([])
    const { blogid } = useParams()

    axios.defaults.withCredentials = true
    const tokenChecker = async () => {

        try {
            const res = await axios.get(`http://localhost:7500/likesusers/${blogid}`)

            if (!res.data.Token) {
                localStorage.clear()
                nav('/')
            }
            else setLikesUsers(res.data.LikedUsers)

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        tokenChecker()
    }, [likesusers])

    const handleBackClick = () => {
        nav('/home')
    };

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <h2>Blog Likes</h2>
                <div className={styles.likesContainer}>
                    {likesusers.length === 0 ? (
                        <p>No likes yet.</p>
                    ) : (
                        likesusers.map((likeuser) => (
                            <div key={likeuser._id} className={styles.likeCard}>
                                <img src={likeuser.DP} alt={likeuser.Name} className={styles.avatar} />
                                <div className={styles.name}>{likeuser.Name}</div>
                            </div>
                        ))
                    )}
                </div>
                <button onClick={handleBackClick} className={styles.backButton}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default LikesPage;
