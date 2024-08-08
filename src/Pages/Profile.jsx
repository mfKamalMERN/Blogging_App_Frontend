import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../Styles/Profile.module.css';
import Navbar from '../Component/Navbar';
import axios from 'axios';

const Profile = () => {
    const [name, setName] = useState('');
    const [profileName, setProfileName] = useState('');
    const [password, setPassword] = useState('');
    const [File, setFile] = useState(null);
    const [au, setAu] = useState([]);
    const [profilePic, setProfilePic] = useState('https://via.placeholder.com/100');
    // const [dp, setDp] = useState('');
    const [followingsCount, setFollowingsCount] = useState(0)
    const [followersCount, setFollowersCount] = useState(0)
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
                        setAu(res.data)
                        const profileUser = res.data.find((user) => user?._id == userid)
                        setName(profileUser.Name)
                        setFollowingsCount(profileUser.Followings.length)
                        setFollowersCount(profileUser.Followers.length)
                        // setDp(profileUser?.DP)
                    })
                    .catch(er => console.log(er))
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        tokenChecker()
    }, [File, followingsCount, followersCount])


    const handleNameChange = (e) => {
        setName(e.target.value);
        setProfileName(e.target.value)
    }

    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file)
            console.log(File);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
                // setDp(reader.result);
            };
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

        const newpassword = password
        axios.patch(`http://localhost:7500/updatepassword`, { newpassword })
            .then(res => {
                if (res.data.ValidationError) res.data.ActError.map((err) => alert(err.msg))

                else alert(res.data)
            })
            .catch(er => console.log(er))

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
                if (res.data) setProfilePic(res.data)
            })
            .catch(er => console.log(er))
        return profilePic
    }

    const isLoggedUser = () => {

        if (JSON.parse(localStorage.getItem('LoggedInUser'))._id == userid) {
            return true
        }
        else {

            return false
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
                            <img src={getOwnerAvatar(userid)} alt="Profile" className={styles.profilePic} />
                            :
                            <img src={profilePic} alt="Profile" className={styles.profilePic} />

                        }
                        {
                            isLoggedUser() &&
                            <>
                                <input type="file" onChange={handleProfilePicChange} className={styles.fileInput} />
                                <button onClick={handleProfilePicUpdate} className={styles.button}>Update Profile Pic</button>

                            </>

                        }
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Name</label>

                        {isLoggedUser() ?
                            <>
                                <input type="text" value={name} onChange={handleNameChange} className={styles.input} />
                                <button onClick={handleNameUpdate} className={styles.button}>Update Name</button>
                            </>
                            :
                            <input disabled={true} type="text" value={name} className={styles.input} />
                        }

                    </div>
                    <div className={styles.inputGroup}>

                        {isLoggedUser() &&
                            <>
                                <label>Password</label>
                                <input type="password" value={password} onChange={handlePasswordChange} className={styles.input} />
                                <button onClick={handlePasswordUpdate} className={styles.button}>Update Password</button>
                            </>
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

            </div>
        </div>
    );
};

export default Profile;
