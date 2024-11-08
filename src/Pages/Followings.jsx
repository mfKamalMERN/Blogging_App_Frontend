import React, { useEffect, useState } from 'react';
import styles from '../Styles/Followings.module.css';
import Navbar from '../Component/Navbar';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { HomeBackNavigations } from '../Component/HomeBackNavigations';

const Followings = () => {
    const nav = useNavigate()
    const [Followings, setFollowings] = useState([])
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
                const res = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/getfollowings/${userid}`)

                // if (!res?.data?.Token) {
                //     localStorage.clear()
                //     nav('/')
                // }

                setFollowings(res?.data?.Followings)

            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        tokenChecker()
    }, [fstatus])


    const checkFollowingStatus = (values) => values.includes(JSON.parse(localStorage.getItem('LoggedInUser'))?._id)

    const getUserName = (usrid) => {

        axios.get(`https://blogging-app-backend-dpk0.onrender.com/getusername/${usrid}`)
            .then(res => setUserName(res?.data))
            .catch(er => console.log(er))
        return userName

    }

    const FollowUnfollow = async (usrid) => {

        try {
            await axios.put(`https://blogging-app-backend-dpk0.onrender.com/followunfollow/${usrid}/${JSON.parse(localStorage.getItem('LoggedInUser'))?._id}`)
            setFstatus(!fstatus)

        } catch (error) {
            console.log(error);
        }

    }

    const isLoggedUser = (usrid) => {
        if (JSON.parse(localStorage.getItem('LoggedInUser'))?._id == usrid) return true

        else return false

    }

    return (
        <div>
            <Navbar />

            <HomeBackNavigations styles={styles} F={true} />

            <div className={styles.container}>
                {Followings?.length === 0 ?
                    <h1>{getUserName(userid)} doesn't follow anyone yet</h1>
                    :

                    <h2>Followings by {getUserName(userid)}</h2>
                }
                <div className={styles.list}>
                    {
                        Followings.map((following) => (

                            <div key={following._id} className={styles.following}>

                                <div onClick={() => nav(`/profile/${following._id}`)} className="imgAndName" style={{ display: "flex", alignItems: "center", marginRight: "10px", cursor: "pointer" }}>
                                    {following.DP ?
                                        <img src={following.DP} alt='' className={styles.avatar} />
                                        :
                                        <img src='https://preview.redd.it/simba-what-do-you-think-about-this-character-v0-7ffmfdfy56pb1.jpg?width=640&crop=smart&auto=webp&s=8ef7bacd9c3aaa19bc5192bf7ad89dcdcd1069b3' alt='' className={styles.avatar} />
                                    }
                                    <div>{following.Name}</div>
                                </div>
                                {
                                    isLoggedUser(following?._id) ?
                                        <></>
                                        :
                                        <button onClick={() => FollowUnfollow(following?._id)} className={!checkFollowingStatus(following?.Followers) ? styles.button : styles.unfollowbutton}>{checkFollowingStatus(following?.Followers) ? 'Unfollow' : 'Follow'}</button>
                                }
                            </div>
                        ))}
                </div>
            </div>
            {/* <button onClick={() => nav(-1)} className={styles.button}>Back</button> */}

        </div>
    );
};

export default Followings;
