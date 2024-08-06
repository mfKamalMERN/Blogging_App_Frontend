import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../Styles/Profile.module.css';
import Navbar from '../Component/Navbar';
import axios from 'axios';

const Profile = () => {
    const [name, setName] = useState(''); // Replace with actual user data
    const [password, setPassword] = useState('');
    const [File, setFile] = useState(null);
    const [au, setAu] = useState([]);
    const [profilePic, setProfilePic] = useState('https://via.placeholder.com/100'); // Replace with actual user data
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
                    .then(res => setAu(res.data))
                    .catch(er => console.log(er))
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        tokenChecker()
    }, [File])

    const handleNameChange = (e) => setName(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file)
            console.log(File);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNameUpdate = (e) => {
        e.preventDefault();
        // Handle name update logic here
        alert('Name updated successfully');
    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        // Handle password update logic here
        alert('Password updated successfully');
    };

    const handleProfilePicUpdate = async (e) => {
        e.preventDefault();
        // Handle profile pic update logic here
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

            // alert('Profile picture updated successfully');
        }
    };

    const getOwnerName = (uid) => {

        axios.get(`http://localhost:7500/getusername/${uid}`)
            .then(res => setName(res?.data))
            .catch(er => console.log(er))
        return name

    }

    const getOwnerAvatar = (uid) => {
        axios.get(`http://localhost:7500/getuserdp/${uid}`)
            .then(res => {
                if (res.data) setProfilePic(res.data)
            })
            .catch(er => console.log(er))
        return profilePic
    }

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <h2>{getOwnerName(userid)}</h2>
                <form className={styles.form}>
                    <div className={styles.profilePicContainer}>
                        {!File ?
                            <img src={getOwnerAvatar(userid)} alt="Profile" className={styles.profilePic} />
                            :
                            <img src={profilePic} alt="Profile" className={styles.profilePic} />

                        }
                        <input type="file" onChange={handleProfilePicChange} className={styles.fileInput} />
                        <button onClick={handleProfilePicUpdate} className={styles.button}>Update Profile Pic</button>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Name</label>
                        <input type="text" value={name} onChange={handleNameChange} className={styles.input} />
                        <button onClick={handleNameUpdate} className={styles.button}>Update Name</button>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Password</label>
                        <input type="password" value={password} onChange={handlePasswordChange} className={styles.input} />
                        <button onClick={handlePasswordUpdate} className={styles.button}>Update Password</button>
                    </div>
                </form>
                <div className={styles.followButtons}>
                    <button onClick={() => nav('/followers')} className={styles.button}>Followers</button>
                    <button onClick={() => nav('/followings')} className={styles.button}>Followings</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
