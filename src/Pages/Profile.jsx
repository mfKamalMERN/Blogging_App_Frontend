import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../Styles/Profile.module.css';
import Navbar from '../Component/Navbar';
import axios from 'axios';
import Cookies from 'universal-cookie';

const Profile = () => {
    const [name, setName] = useState('');
    // const [profileName, setProfileName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [File, setFile] = useState(null);
    const [profilePic, setProfilePic] = useState('https://t4.ftcdn.net/jpg/01/16/61/93/360_F_116619399_YA611bKNOW35ffK0OiyuaOcjAgXgKBui.jpg');
    const [followingsCount, setFollowingsCount] = useState(0)
    const [followersCount, setFollowersCount] = useState(0)
    const [pwdsetter, setPwdSetter] = useState(false)
    const [privateAccount, setPrivateAccount] = useState(false)
    const [privateText, setPrivateText] = useState('')
    const [followers, setFollowers] = useState([])
    const [blogscount, setBlogscount] = useState(0)
    const [edp, setEdp] = useState(false)
    const { userid } = useParams()
    const [fstatus, setFstatus] = useState(false)
    const [token, setToken] = useState("")
    const nav = useNavigate();

    axios.defaults.withCredentials = true
    const tokenChecker = async () => {

        axios.get(`https://blogging-app-backend-dpk0.onrender.com/getuser/${userid}`)
            .then(res => {
                const cookies = new Cookies()
                if (!cookies.get('token')) {
                    setToken("")
                    localStorage.clear()
                    cookies.remove('token')
                    nav('/')
                }
                else {
                    setToken(cookies.get('token'))
                    const profileUser = res?.data?.User
                    setName(res.data.User.Name)
                    setFollowingsCount(profileUser?.Followings?.length)
                    setFollowersCount(profileUser?.Followers?.length)
                    setFollowers(profileUser?.Followers)
                    setBlogscount(profileUser?.Blogs?.length)
                    setPrivateAccount(profileUser?.isPrivateAccount)
                    if (privateAccount) setPrivateText(`Private Account`)
                    else setPrivateText(`Public Account`)
                }
            })
            .catch(er => console.log(er))
    }

    useEffect(() => {
        tokenChecker();
    }, [File, followingsCount, followersCount, edp, blogscount, profilePic, privateAccount, fstatus, token])

    // [File, followingsCount, followersCount, edp, blogscount, profilePic, privateAccount, fstatus]
    // [File, followingsCount, followersCount, profilePic, edp, followers, blogscount]

    const handleNameChange = (e) => {
        setName(e.target.value);
        // setProfileName(e.target.value)
    }

    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file)

            const reader = new FileReader();

            reader.onloadend = () => setProfilePic(reader.result);

            reader.readAsDataURL(file);
        }
    };

    const handleNameUpdate = async (e) => {
        e.preventDefault();

        const newName = name

        try {
            const res = await axios.patch(`https://blogging-app-backend-dpk0.onrender.com/updatename/${JSON.parse(localStorage.getItem('LoggedInUser'))._id}`, { newName })

            if (res.data.ValidationError) {
                res.data.ActError.map((er) => alert(er.msg))
                tokenChecker()
            }

            else {
                // setProfileName(newName)
                localStorage.setItem('LoggedInUser', JSON.stringify(res?.data?.UpdatedUser))
                alert(res.data.Msg)
                tokenChecker()
            }

        } catch (error) {
            console.log(error);
        }

    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();

        if (password.trim() === "" || confirmpassword.trim() === "") alert(`Please type your new password`)

        else if (password !== confirmpassword) alert(`Passwords didn't match`)

        else {
            const newpassword = password
            axios.patch(`https://blogging-app-backend-dpk0.onrender.com/updatepassword/${JSON.parse(localStorage.getItem('LoggedInUser'))._id}`, { newpassword })
                .then(res => {
                    if (res.data.ValidationError) res.data.ActError.map((err) => alert(err.msg))

                    else alert(res?.data)
                })
                .catch(er => console.log(er))
        }
    };

    const handleProfilePicUpdate = async (e) => {
        e.preventDefault();

        if (!File) alert(`No Pic selected`)

        else {
            const formdata = new FormData()

            formdata.append('file', File)

            try {
                await axios.put(`https://blogging-app-backend-dpk0.onrender.com/uploadprofilepic/${JSON.parse(localStorage.getItem('LoggedInUser'))._id}`, formdata)
                localStorage.setItem('edp', JSON.stringify(false))
                setEdp(!edp)
                // alert(res.data)
            } catch (error) {
                console.log(error);
            }
        }
    };


    const getOwnerAvatar = (uid) => {
        axios.get(`https://blogging-app-backend-dpk0.onrender.com/getuserdp/${uid}`)
            .then(res => {
                if (res?.data) setProfilePic(res.data)
            })
            .catch(er => console.log(er))
        return profilePic
    }

    const isLoggedUser = () => JSON.parse(localStorage.getItem('LoggedInUser'))?._id == userid

    const DeleteAccount = async () => {
        if (window.confirm(`Deleting your Account`)) {

            try {
                const res = await axios.delete(`https://blogging-app-backend-dpk0.onrender.com/deleteaccount/${JSON.parse(localStorage.getItem('LoggedInUser'))._id}`)
                alert(res?.data)
                nav('/')
            } catch (error) {
                console.log(error);

            }
        }
    }

    const checkFollowingStatus = () => followers.includes(JSON.parse(localStorage.getItem('LoggedInUser'))?._id)

    const changeAccountPrivacy = () => {
        const isPrivate = !privateAccount
        axios.patch(`https://blogging-app-backend-dpk0.onrender.com/privatepublic/${JSON.parse(localStorage.getItem('LoggedInUser'))._id}`, { isPrivate })
            .then(res => {
                setPrivateAccount(!privateAccount)
                alert(res.data)
            })
            .catch(er => console.log(er))
    }

    const FollowUnfollow = async (usrid) => {

        try {
            await axios.put(`https://blogging-app-backend-dpk0.onrender.com/followunfollow/${usrid}/${JSON.parse(localStorage.getItem('LoggedInUser'))._id}`)
            setFstatus(!fstatus)

        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <h2>{name} ({privateText})</h2>
                <form className={styles.form}>
                    <div className={styles.profilePicContainer}>
                        {!File ?
                            <img src={getOwnerAvatar(userid)} alt="" className={styles.profilePic} />
                            :
                            <img src={profilePic} alt="" className={styles.profilePic} />

                        }
                        {
                            isLoggedUser() &&
                            <>
                                {!JSON.parse(localStorage.getItem('edp')) && <button onClick={() => localStorage.setItem('edp', JSON.stringify(true))} className={styles.button}>✏️ Profile Pic</button>}

                                {JSON.parse(localStorage.getItem('edp')) &&
                                    <>
                                        <label htmlFor=""></label>
                                        <input type="file" onChange={handleProfilePicChange} className={styles.fileInput} />
                                        <br />
                                        <br />

                                        <button onClick={handleProfilePicUpdate} className={styles.button}>Update</button>

                                        <button onClick={() => localStorage.setItem('edp', JSON.stringify(false))} className={styles.button}>Cancel</button>
                                    </>
                                }
                            </>
                        }
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Name</label>
                        {isLoggedUser() ?
                            <>
                                <input type="text" value={name} onChange={handleNameChange} className={styles.input} />
                                <button onClick={handleNameUpdate} className={styles.button}>Set Name</button>
                            </>
                            :
                            <input disabled={true} type="text" value={name} className={styles.input} />}
                    </div>

                    <div className={styles.inputGroup}>
                        {isLoggedUser() && pwdsetter ?
                            <>
                                <label>New Password</label>
                                <input type="password" value={password} onChange={handlePasswordChange} className={styles.input} />

                                <label>Confirm Password</label>
                                <input type="password" value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)} className={styles.input} />

                                <button onClick={handlePasswordUpdate} className={styles.button}>Update</button>

                                <button onClick={() => setPwdSetter(false)} className={styles.button}>Cancel</button>
                            </>
                            :
                            isLoggedUser() &&
                            <button onClick={() => setPwdSetter(!pwdsetter)} className={styles.button}>✏️ Password</button>}
                    </div>

                </form>

                <div className={styles.followButtons}>
                    {isLoggedUser() || checkFollowingStatus(userid) || !privateAccount ?
                        <>
                            <button onClick={() => nav(`/followers/${userid}`)} className={styles.button}>Followers {followersCount}</button>
                            <button onClick={() => nav(`/followings/${userid}`)} className={styles.button}>Followings {followingsCount}</button>
                            {blogscount > 0 ?
                                <button onClick={() => nav(`/home/${userid}`)} className={styles.button}>Blogs {blogscount}</button>
                                :
                                <button disabled={true} onClick={() => nav(`/home/${userid}`)}>Blogs {blogscount}</button>
                            }
                        </>
                        :
                        <>
                            <h2>You're not following {name}</h2>
                            <button disabled={true} onClick={() => nav(`/followers/${userid}`)}>Followers {followersCount}</button>
                            <button disabled={true} onClick={() => nav(`/followings/${userid}`)}>Followings {followingsCount}</button>
                            <button disabled={true} onClick={() => nav(`/home/${userid}`)}>Blogs {blogscount}</button>
                        </>}
                </div>

                {isLoggedUser() && <button onClick={DeleteAccount} className={styles.deleteaccount}>Delete My Account</button>}

                {!isLoggedUser() &&
                    (checkFollowingStatus() ?
                        <button onClick={() => FollowUnfollow(userid)} className={styles.deleteaccount}>Unfollow</button>
                        :
                        <button onClick={() => FollowUnfollow(userid)} className={styles.button}>Follow</button>)}

                {isLoggedUser() ?
                    privateAccount ?
                        <button onClick={changeAccountPrivacy} className={styles.button}>Change Account to Public</button>
                        :
                        <button onClick={changeAccountPrivacy} className={styles.button}>Change Account to Private</button>
                    :
                    privateAccount ?
                        <p style={{ color: "wheat" }}>This account is private</p>
                        :
                        <></>}

            </div >
            <button onClick={() => nav(-1)} className={styles.button}>Back</button>
        </div >
    );
};

export default Profile;
