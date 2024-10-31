import React, { useEffect, useState } from 'react';
import styles from '../Styles/Followers.module.css';
import Navbar from '../Component/Navbar';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { checkFollowingStatus, followUnfollowDecider } from '../Helpers/Functions';

const Followers = () => {

    const nav = useNavigate()
    const [Followers, setFollowers] = useState([])
    const [fstatus, setFstatus] = useState(false)
    const [userName, setUserName] = useState("")
    const { userid } = useParams()


    axios.defaults.withCredentials = true
    const tokenChecker = async () => {
        const cookies = new Cookies();
        if (!cookies.get('token')) {
            localStorage.clear()
            cookies.remove('token')
            nav('/')
        }
        else {

            try {
                const res = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/getfollowers/${userid}`)

                // if (!res?.data?.Token) {
                //     localStorage.clear()
                //     nav('/')
                // }
                setFollowers(res?.data?.Followwers)

            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        tokenChecker()
    }, [fstatus])

    // const checkFollowingStatus = (usrid) => {

    //     axios.get(`http://localhost:7500/checkfollowingstatus/${usrid}`)
    //         .then((res) => setIsFollowing(res?.data?.isFollowing))
    //         .catch(er => console.log(er))

    //     return IsFollowing
    // }

    // const checkFollowingStatus = (values) => values.includes(JSON.parse(localStorage.getItem('LoggedInUser'))?._id)

    const FollowUnfollow = async (usrid) => {

        try {
            await axios.put(`https://blogging-app-backend-dpk0.onrender.com/followunfollow/${usrid}/${JSON.parse(localStorage.getItem('LoggedInUser'))._id}`)
            setFstatus(!fstatus)

        } catch (error) {
            console.log(error);
        }

    }

    const getUserName = (ownerid) => {

        axios.get(`https://blogging-app-backend-dpk0.onrender.com/getusername/${ownerid}`)
            .then(res => setUserName(res.data))
            .catch(er => console.log(er))
        return userName

    }

    const isLoggedUser = (usrid) => JSON.parse(localStorage.getItem('LoggedInUser'))?._id == usrid

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                {Followers?.length === 0 ?
                    <h2>No Followers yet</h2>
                    :
                    <h2>Followers of {getUserName(userid)}</h2>
                }

                <div className={styles.list}>

                    {Followers?.map((follower) => (
                        <div key={follower?._id} className={styles.follower}>
                            <div onClick={() => nav(`/profile/${follower?._id}`)} className="imgAndName" style={{ display: "flex", alignItems: "center", marginRight: "10px", cursor: "pointer" }}>
                                {follower.DP ?
                                    <img src={follower?.DP} alt={follower.Name} className={styles.avatar} />
                                    :
                                    <img src='https://preview.redd.it/simba-what-do-you-think-about-this-character-v0-7ffmfdfy56pb1.jpg?width=640&crop=smart&auto=webp&s=8ef7bacd9c3aaa19bc5192bf7ad89dcdcd1069b3' alt='' className={styles.avatar} />
                                }
                                {/* https://t4.ftcdn.net/jpg/01/16/61/93/360_F_116619399_YA611bKNOW35ffK0OiyuaOcjAgXgKBui.jpg */}
                                <div>{follower?.Name}</div>
                            </div>
                            {
                                isLoggedUser(follower?._id) ?
                                    <></>
                                    :
                                    <button onClick={() => FollowUnfollow(follower?._id)} className={!checkFollowingStatus(follower?.Followers) ? styles.button : styles.unfollowbutton}>{followUnfollowDecider(follower.Followers, follower.isPrivateAccount, follower.FollowRequests)}</button>
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
