import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../Styles/Profile.module.css';
import Navbar from '../Component/Navbar';
import axios from 'axios';

const Profile = () => {
    const [name, setName] = useState('');
    const [profileName, setProfileName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [File, setFile] = useState(null);
    const [profilePic, setProfilePic] = useState('https://via.placeholder.com/100');
    const [followingsCount, setFollowingsCount] = useState(0)
    const [followersCount, setFollowersCount] = useState(0)
    const [pwdsetter, setPwdSetter] = useState(false)
    const { userid } = useParams()
    const nav = useNavigate();

    axios.defaults.withCredentials = true
    const tokenChecker = async () => {

        try {
            const res = await axios.get(`http://localhost:7500/getallblogs`)

            if (!res?.data?.Token) {
                nav('/')
                localStorage.clear()
            }
            else {

                axios.get(`http://localhost:7500/getallusers`)
                    .then(res => {
                        const profileUser = res.data.find((user) => user?._id == userid)
                        setName(profileUser.Name)
                        setFollowingsCount(profileUser?.Followings?.length)
                        setFollowersCount(profileUser?.Followers?.length)
                    })
                    .catch(er => console.log(er))
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        tokenChecker()
    }, [File, followingsCount, followersCount, profilePic])


    const handleNameChange = (e) => {
        setName(e.target.value);
        setProfileName(e.target.value)
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
            const res = await axios.patch(`http://localhost:7500/updatename`, { newName })

            if (res.data.ValidationError) {
                res.data.ActError.map((er) => alert(er.msg))
                tokenChecker()
            }

            else {
                setProfileName(newName)
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
            axios.patch(`http://localhost:7500/updatepassword`, { newpassword })
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
                const res = await axios.put(`http://localhost:7500/uploadprofilepic`, formdata)

                alert(res.data)

            } catch (error) {
                console.log(error);
            }
        }
    };


    const getOwnerAvatar = (uid) => {
        axios.get(`http://localhost:7500/getuserdp/${uid}`)
            .then(res => {
                if (res?.data) setProfilePic(res.data)
            })
            .catch(er => console.log(er))
        return profilePic
    }

    const isLoggedUser = () => {

        if (JSON.parse(localStorage.getItem('LoggedInUser'))?._id === userid) {
            return true
        }
        else {

            return false
        }
    }

    const DeleteAccount = async () => {
        if (window.confirm(`Deleting your Account`)) {

            try {
                const res = await axios.delete(`http://localhost:7500/deleteaccount`)
                alert(res?.data)
                nav('/')
            } catch (error) {
                console.log(error);

            }
        }
    }

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <h2>{name}</h2>
                <form className={styles.form}>
                    <div className={styles.profilePicContainer}>
                        {!File ?
                            <img src={getOwnerAvatar(userid)} alt={name} className={styles.profilePic} />
                            :
                            <img src={profilePic} alt="" className={styles.profilePic} />

                        }
                        {
                            isLoggedUser() &&
                            <>
                                <input type="file" onChange={handleProfilePicChange} className={styles.fileInput} />✏️
                                <br />
                                <br />
                                <button onClick={handleProfilePicUpdate} className={styles.button}>Update</button>
                            </>
                        }
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Name</label>

                        {isLoggedUser() ?
                            <>
                                <input type="text" value={name} onChange={handleNameChange} className={styles.input} />
                                <button onClick={handleNameUpdate} className={styles.button}>✏️</button>
                            </>
                            :
                            <input disabled={true} type="text" value={name} className={styles.input} />
                        }

                    </div>
                    <div className={styles.inputGroup}>

                        {isLoggedUser() && pwdsetter ?
                            <>
                                <label>New Password</label>
                                <input type="password" value={password} onChange={handlePasswordChange} className={styles.input} />

                                <label>Confirm Password</label>
                                <input type="password" value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)} className={styles.input} />
                                <button onClick={handlePasswordUpdate} className={styles.button}>✏️</button>
                                <button onClick={() => setPwdSetter(false)} className={styles.button}>Cancel</button>
                            </>
                            :
                            <button onClick={() => setPwdSetter(!pwdsetter)} className={styles.button}>✏️Pwd</button>

                        }

                    </div>
                </form>

                <div className={styles.followButtons}>
                    {followersCount != 0 &&
                        <button onClick={() => nav(`/followers/${userid}`)} className={styles.button}>Followers {followersCount}</button>
                    }

                    {followingsCount != 0 &&
                        <button onClick={() => nav(`/followings/${userid}`)} className={styles.button}>Followings {followingsCount}</button>}
                </div>

                {isLoggedUser() && <button onClick={DeleteAccount} className={styles.button}>Delete My Account</button>}

            </div >
            <button onClick={() => nav(-1)} className={styles.button}>Back</button>
        </div >
    );
};

export default Profile;
