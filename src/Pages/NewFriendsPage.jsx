import React, { useEffect, useState } from 'react';
import Navbar from '../Component/Navbar';
import styles from '../Styles/NewFriendsPage.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewFriendsPage = () => {
    const [friends, setFriends] = useState([]);
    const [fstatus, setFstatus] = useState(false)

    const nav = useNavigate()

    axios.defaults.withCredentials = true

    const tokenChecker = async () => {
        try {
            const res = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/findnewpeople`)

            if (!res?.data?.Token) {
                localStorage.clear()
                nav('/')
            }
            else {
                const allUsers = res?.data?.OtherUsers
                const otherusers = allUsers?.filter((user) => user?._id !== JSON.parse(localStorage.getItem('LoggedInUser'))?._id)
                setFriends(otherusers)
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        tokenChecker()
    }, [fstatus])

    const FollowUnfollow = async (usrid) => {

        try {
            await axios.put(`https://blogging-app-backend-dpk0.onrender.com/followunfollow/${usrid}`)
            setFstatus(!fstatus)

        } catch (error) {
            console.log(error);
        }

    }

    const checkFollowingStatus = (values) => values.includes(JSON.parse(localStorage.getItem('LoggedInUser'))?._id)


    return (
        <div>
            <Navbar />
            {

                <div className={styles.container}>
                    <h2>Find New Friends</h2>

                    <div className={styles.friendsContainer}>
                        {friends.map((friend) => (
                            <div key={friend?._id} className={styles.friendCard}>

                                <img src={friend?.DP} alt={friend?.Name} className={styles.avatar} onClick={() => nav(`/profile/${friend?._id}`)} />
                                <div className={styles.name} onClick={() => nav(`/profile/${friend._id}`)}>{friend?.Name}</div>

                                <button
                                    onClick={() => FollowUnfollow(friend?._id)}
                                    className={checkFollowingStatus(friend.Followers) ? styles.unfollowButton : styles.followButton}
                                >
                                    {checkFollowingStatus(friend.Followers) ? 'Unfollow' : 'Follow'}
                                </button>

                            </div>))}
                    </div>
                </div>
            }

        </div>
    );
};

export default NewFriendsPage;
