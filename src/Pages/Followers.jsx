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
    const [userName, setUserName] = useState("")


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

    const getUserName = (ownerid) => {

        axios.get(`http://localhost:7500/getusername/${ownerid}`)
            .then(res => setUserName(res.data))
            .catch(er => console.log(er))
        return userName

    }

    return (
        <div>
            <Navbar isLogin={false} />

            <div className={styles.container}>
                {!Followers.length ?
                    <h2>No Followers yet</h2>
                    :

                    <h2>Followers of {getUserName(userid)}</h2>
                }

                <div className={styles.list}>

                    {Followers.length !== 0 && Followers.map((follower) => (
                        <div key={follower._id} className={styles.follower}>
                            <div onClick={() => nav(`/profile/${follower._id}`)} className="imgAndName" style={{ display: "flex", alignItems: "center", marginRight: "10px" }}>
                                <img src={follower?.DP} alt={follower.Name} className={styles.avatar} />
                                <div>{follower.Name}</div>
                            </div>
                            {
                                JSON.parse(localStorage.getItem('LoggedInUser'))._id == follower._id ?
                                    <></>
                                    :
                                    checkFollowingStatus(follower._id) ?
                                        <button onClick={() => FollowUnfollow(follower._id)} className={styles.button}>Unfollow</button>
                                        :
                                        <button onClick={() => FollowUnfollow(follower._id)} className={styles.button}>Follow</button>

                            }
                        </div>
                    ))}

                </div>

            </div>

            <button onClick={() => nav(-1)} className={styles.button}>Back</button>

        </div>
    );
};

export default Followers;
