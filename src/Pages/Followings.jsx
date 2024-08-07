import React, { useEffect, useState } from 'react';
import styles from '../Styles/Followings.module.css';
import Navbar from '../Component/Navbar';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Followings = () => {
    const nav = useNavigate()
    const [Followings, setFollowings] = useState([])
    const [IsFollowing, setIsFollowing] = useState(false)
    const [userName, setUserName] = useState("")

    const { userid } = useParams()


    axios.defaults.withCredentials = true
    const tokenChecker = async () => {
        try {
            const res = await axios.get(`http://localhost:7500/getfollowings/${userid}`)

            if (!res?.data?.Token) {
                localStorage.clear()
                nav('/')
            }

            else setFollowings(res?.data?.Followings)

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        tokenChecker()
    }, [Followings, IsFollowing])


    const checkFollowingStatus = (usrid) => {

        axios.get(`http://localhost:7500/checkfollowingstatus/${usrid}`)
            .then((res) => setIsFollowing(res.data.isFollowing))
            .catch(er => console.log(er))

        return IsFollowing
    }

    const getUserName = (usrid) => {

        axios.get(`http://localhost:7500/getusername/${usrid}`)
            .then(res => setUserName(res?.data))
            .catch(er => console.log(er))
        return userName

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
            <div className={styles.container}>
                <h2>Followings by {getUserName(userid)}</h2>
                <div className={styles.list}>
                    {Followings.map((following) => (
                        <div key={following._id} className={styles.following}>
                            <img src={following.DP} alt={following.Name} className={styles.avatar} />
                            <div>{following.Name}</div>

                            {checkFollowingStatus(following._id) ?
                                <button onClick={() => FollowUnfollow(following._id)} className={styles.button}>Unfollow</button>
                                :
                                <button onClick={() => FollowUnfollow(following._id)} className={styles.button}>Follow</button>

                            }
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Followings;
