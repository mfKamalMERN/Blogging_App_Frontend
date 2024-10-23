import React, { useEffect, useState } from 'react';
import Navbar from '../Component/Navbar';
import styles from '../Styles/NewFriendsPage.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const NewFriendsPage = () => {
    const [friends, setFriends] = useState([]);
    const [fstatus, setFstatus] = useState(false)

    const nav = useNavigate()

    axios.defaults.withCredentials = true

    const tokenChecker = async () => {
        const cookies = new Cookies();
        try {
            const res = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/findnewpeople`)

            if (!cookies.get('token')) {
                localStorage.clear()
                cookies.remove('token')
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
            await axios.put(`https://blogging-app-backend-dpk0.onrender.com/followunfollow/${usrid}/${JSON.parse(localStorage.getItem('LoggedInUser'))._id}`)
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

                    <h2 style={{ color: "wheat", marginTop: "20%" }}>Find New Friends</h2>

                    <div className={styles.friendsContainer}>
                        {friends.map((friend) => (
                            <div key={friend?._id} className={styles.friendCard}>

                                {friend.DP ?
                                    <img src={friend?.DP} alt="" className={styles.avatar} onClick={() => nav(`/profile/${friend?._id}`)} />
                                    :
                                    <img src="https://t4.ftcdn.net/jpg/01/16/61/93/360_F_116619399_YA611bKNOW35ffK0OiyuaOcjAgXgKBui.jpg" alt="" className={styles.avatar} onClick={() => nav(`/profile/${friend?._id}`)} />}
                                {/* https://via.placeholder.com/100 */}
                                <div className={styles.name} onClick={() => nav(`/profile/${friend._id}`)}>{friend?.Name}</div>

                                <button
                                    onClick={() => FollowUnfollow(friend?._id)}
                                    className={checkFollowingStatus(friend.Followers) ? styles.unfollowButton : styles.followButton}
                                >
                                    {checkFollowingStatus(friend.Followers) ? 'Unfollow' : 'Follow'}
                                </button>

                            </div>))}
                    </div>
                    <button onClick={() => nav('/home')} className={styles.followButton} style={{ marginTop: "25px", backgroundColor: "black" }}><h1>🏠</h1></button>
                </div>
            }

        </div>
    );
};

export default NewFriendsPage;
