import React, { useEffect, useState } from 'react';
import styles from '../Styles/Followers.module.css';
import Navbar from '../Component/Navbar';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Followers = () => {

    const [Followers, setFollowers] = useState([])
    const [IsFollowing, setIsFollowing] = useState(false)
    const nav = useNavigate()
    const { userid } = useParams()


    axios.defaults.withCredentials = true
    const tokenChecker = async () => {

        try {
            const res = await axios.get(`http://localhost:7500/getfollowers/${userid}`)

            if (!res?.data?.Token) {
                nav('/')
                localStorage.clear()
            }
            else setFollowers(res.data.Followers)

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        tokenChecker()
    }, [Followers, IsFollowing])

    const checkFollowingStatus = (usrid) => {

        axios.get(`http://localhost:7500/checkfollowingstatus/${usrid}`)
            .then((res) => setIsFollowing(res.data.isFollowing))
            .catch(er => console.log(er))

        return IsFollowing
    }

    const FollowUnfollow = async (usrid) => {

        try {
            const res = await axios.put(`http://localhost:7500/followunfollow/${usrid}`)
            alert(res.data)

        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div>
            <Navbar isLogin={false} />

            <div className={styles.container}>

                <h2>Followers</h2>

                <div className={styles.list}>

                    {Followers.map((follower) => (
                        <div key={follower._id} className={styles.follower}>
                            <img src={follower.DP} alt={follower.Name} className={styles.avatar} />
                            <div>{follower.Name}</div>
                            {checkFollowingStatus(follower._id) ?
                                <button onClick={() => FollowUnfollow(follower._id)} className={styles.button}>Unfollow</button>
                                :
                                <button onClick={() => FollowUnfollow(follower._id)} className={styles.button}>Follow</button>

                            }
                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
};

export default Followers;
