import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../Styles/Profile.module.css';
import Navbar from '../Component/Navbar';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { changeAccountPrivacy, checkFollowingStatus, checkFollowRequest, enableContactView } from '../Helpers/Functions';
import { HomeBackNavigations } from '../Component/HomeBackNavigations';
import { toast } from 'react-toastify';

const Profile = () => {
    const [name, setName] = useState('');
    // const [profileName, setProfileName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [File, setFile] = useState(null);
    const [profilePic, setProfilePic] = useState('https://preview.redd.it/simba-what-do-you-think-about-this-character-v0-7ffmfdfy56pb1.jpg?width=640&crop=smart&auto=webp&s=8ef7bacd9c3aaa19bc5192bf7ad89dcdcd1069b3');
    const [followingsCount, setFollowingsCount] = useState(0)
    const [followersCount, setFollowersCount] = useState(0)
    const [pwdsetter, setPwdSetter] = useState(false)
    const [privateAccount, setPrivateAccount] = useState(false)
    const [privateText, setPrivateText] = useState('')
    const [followers, setFollowers] = useState([])
    const [followRequests, setFollowRequests] = useState([])
    const [blogscount, setBlogscount] = useState(0)
    const [edp, setEdp] = useState(false)
    const { userid } = useParams()
    const [fstatus, setFstatus] = useState(false)
    const [token, setToken] = useState("")
    const [showContact, setShowcontact] = useState(false)
    const [showContactDetails, setShowContactDetails] = useState(false);
    const [contact, setContact] = useState('')
    const [email, setEmail] = useState('')
    const [contactvalue, setContactValue] = useState('')
    const [addContactEnabled, setAddContactEnabled] = useState(false)
    const [editContact, setEditContact] = useState(false)
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
                    if (!profileUser) {
                        console.log(`User not found`);
                        return;
                    }

                    setName(profileUser?.Name)
                    setFollowingsCount(profileUser?.Followings?.length)
                    setFollowersCount(profileUser?.Followers?.length)
                    setFollowers(profileUser?.Followers)
                    setBlogscount(profileUser?.Blogs?.length)
                    setPrivateAccount(profileUser?.isPrivateAccount)
                    setContact(profileUser?.Contact || '')
                    setEmail(profileUser?.Email || '')
                    setShowcontact(profileUser?.showContact || false)
                    setShowContactDetails(profileUser?.showContactDetails || false)
                    setFollowRequests(profileUser?.FollowRequests || []);
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

    const handleNameChange = (e) => setName(e.target.value);

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
                res.data.ActError.map((er) => toast(er.msg))
                tokenChecker()
            }

            else {
                // setProfileName(newName)
                localStorage.setItem('LoggedInUser', JSON.stringify(res?.data?.UpdatedUser))
                toast(res.data.Msg)
                tokenChecker()
            }

        } catch (error) {
            console.log(error);
        }

    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();

        if (password.trim() === "" || confirmpassword.trim() === "") toast(`Please type your new password`)

        else if (password !== confirmpassword) toast(`Passwords didn't match`)

        else {
            const newpassword = password
            axios.patch(`https://blogging-app-backend-dpk0.onrender.com/updatepassword/${JSON.parse(localStorage.getItem('LoggedInUser'))._id}`, { newpassword })
                .then(res => {
                    if (res.data.ValidationError) res.data.ActError.map((err) => toast(err.msg))

                    else toast(res?.data)
                })
                .catch(er => console.log(er))
        }
    };

    const handleProfilePicUpdate = async (e) => {
        e.preventDefault();

        if (!File) toast(`No Pic selected`)

        else {
            const formdata = new FormData()

            formdata.append('file', File)

            try {
                await axios.put(`https://blogging-app-backend-dpk0.onrender.com/uploadprofilepic/${JSON.parse(localStorage.getItem('LoggedInUser'))._id}`, formdata)
                localStorage.setItem('edp', JSON.stringify(false))
                setEdp(!edp)
                // toast(res.data)
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
                toast(res?.data)
                nav('/')
            } catch (error) {
                console.log(error);

            }
        }
    }

    const FollowUnfollow = async (usrid) => {

        try {
            await axios.put(`https://blogging-app-backend-dpk0.onrender.com/followunfollow/${usrid}/${JSON.parse(localStorage.getItem('LoggedInUser'))._id}`)
            setFstatus(!fstatus)

        } catch (error) {
            console.log(error);
        }

    }

    const removeDP = (loggedUserID) => {
        const imgurl = "https://preview.redd.it/simba-what-do-you-think-about-this-character-v0-7ffmfdfy56pb1.jpg?width=640&crop=smart&auto=webp&s=8ef7bacd9c3aaa19bc5192bf7ad89dcdcd1069b3"

        if (window.confirm(`Removing Profile Picture...`)) {
            axios.patch(`https://blogging-app-backend-dpk0.onrender.com/removedp/${loggedUserID}`, { imgurl })
                .then(setProfilePic(imgurl))
                .catch(er => console.log(er))
        }
    }

    const profilePicChecker = () => {
        const defaultdpurl = 'https://preview.redd.it/simba-what-do-you-think-about-this-character-v0-7ffmfdfy56pb1.jpg?width=640&crop=smart&auto=webp&s=8ef7bacd9c3aaa19bc5192bf7ad89dcdcd1069b3'

        if (profilePic !== defaultdpurl) return true
        else return false
    }


    const addContact = (isDeleteContact) => {
        const loggeduserid = JSON.parse(localStorage.getItem('LoggedInUser'))?._id;
        const NrFormatContactValue = (!isDeleteContact) ? Number(contactvalue) : contact;

        if (!loggeduserid) {
            console.log(`Invalid User id`);
            toast(`Invalid User id`);
            setAddContactEnabled(false);
            setContactValue('');
            return;
        }

        if (isDeleteContact) {
            if (window.confirm(`Deleting contact...`)) {
                axios.patch(`https://blogging-app-backend-dpk0.onrender.com/updatecontact`, { loggeduserid, NrFormatContactValue, isDeleteContact })
                    .then(res => {
                        if (!res.data) {
                            console.log(`Invalid response from server while updating contact`);
                            // setContactValue('');
                            return;
                        }

                        if (res.data.Contact) {
                            setContact(res.data.Contact);
                            toast(res.data.message);
                            return;
                        }

                        if (res.data.ContactDeleted) {
                            setContact('');
                            setContactValue('')
                            toast(res.data.message);
                            setAddContactEnabled(false);
                            return;
                        }

                        setAddContactEnabled(false);
                        setContactValue('');
                        toast(res.data.message);
                    })
                    .catch(er => console.log(`Error updating contact`, er));
            }
            return;
        }

        axios.patch(`https://blogging-app-backend-dpk0.onrender.com/updatecontact`, { loggeduserid, NrFormatContactValue, isDeleteContact })
            .then(res => {
                if (!res.data) {
                    console.log(`Invalid response from server while updating contact`);
                    // setContactValue('');
                    return;
                }

                if (res.data.Contact) {
                    setContact(res.data.Contact);
                    setEditContact(false);
                    toast(res.data.message);
                    return;
                }

                if (res.data.ContactDeleted) {
                    setContact('');
                    toast(res.data.message);
                    return;
                }

                toast(res.data.message);
                setAddContactEnabled(false);
                setContactValue('');
                setEditContact(false);

            })
            .catch(er => console.log(`Error updating contact`, er));
    }


    const showHideContactDetails = (preference) => {
        const loggeduserid = JSON.parse(localStorage.getItem('LoggedInUser'))?._id;

        if (!loggeduserid) {
            console.log(`Invalid user id`);
            return;
        }

        axios.patch(`https://blogging-app-backend-dpk0.onrender.com/showhidecontactdetails`, { loggeduserid, preference })
            .then(res => {
                if (!res.data) {
                    console.log(`Invalid response from server while showing/hiding contact details`);
                    return;
                }

                if (res.data.ContactDetailsShownUpdated) {
                    setShowContactDetails(res.data.Preference);
                    toast(res.data.message);
                    return;
                }
                toast(res.data.message);
            })
            .catch(er => console.log(`Error showing/hiding contact details`, er));
    }


    return (
        <div>
            <Navbar />

            <HomeBackNavigations styles={styles} P={true} />

            <div className={styles.container}>
                <h2>{name} ({privateText})</h2>

                {(showContactDetails && (isLoggedUser() || checkFollowingStatus(followers) || !privateAccount)) &&
                    <>
                        <h3>📧: {email}</h3>
                        {(contact && showContact) && <h3>☎️: {contact}</h3>}
                        {isLoggedUser() &&
                            editContact ?
                            <>
                                <input type="text" value={contactvalue} onChange={(e) => setContactValue(e.target.value)} className={styles.input} placeholder='10 digit contact...' />
                                <button onClick={() => { setEditContact(false); setContactValue(contact) }} className={styles.button} style={{ backgroundColor: 'darkred' }}>X</button>
                                <button onClick={() => addContact(false)} className={styles.button} style={{ backgroundColor: "darkblue" }}>Update ✅</button>
                            </>
                            :
                            (showContact && contact) &&
                            <>
                                <button onClick={() => { setEditContact(true); setContactValue(contact) }} className={styles.button}>✏️</button>
                                <button onClick={() => addContact(true)} className={styles.deleteaccount}>🪣</button>
                            </>}
                    </>
                }

                <form className={styles.form}>
                    <div className={styles.profilePicContainer}>

                        {!File ?
                            <img src={getOwnerAvatar(userid)} alt="" className={styles.profilePic} />
                            :
                            <img src={profilePic} alt="" className={styles.profilePic} />
                        }

                        {isLoggedUser() &&
                            <>
                                {!JSON.parse(localStorage.getItem('edp')) &&
                                    <>
                                        <button onClick={() => localStorage.setItem('edp', JSON.stringify(true))} className={styles.button}>✏️ Profile Pic</button>
                                        {profilePicChecker() && <button onClick={() => removeDP(JSON.parse(localStorage.getItem('LoggedInUser'))?._id)} className={styles.deleteaccount}>Remove Profile Pic</button>}
                                    </>}

                                {JSON.parse(localStorage.getItem('edp')) &&
                                    <>
                                        <label htmlFor=""></label>
                                        <input type="file" onChange={handleProfilePicChange} className={styles.fileInput} />
                                        <br />
                                        <br />

                                        <button onClick={handleProfilePicUpdate} className={styles.button}>Update</button>

                                        <button onClick={() => localStorage.setItem('edp', JSON.stringify(false))} className={styles.button} style={{ backgroundColor: "darkred" }}>X</button>
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

                                <button onClick={() => setPwdSetter(false)} className={styles.deleteaccount}>Cancel</button>
                            </>
                            :
                            isLoggedUser() &&
                            <button onClick={() => setPwdSetter(!pwdsetter)} className={styles.button}>✏️ Password</button>}
                    </div>

                </form>

                <div className={styles.followButtons}>
                    {isLoggedUser() || checkFollowingStatus(followers) || !privateAccount ?
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


                {(isLoggedUser() && showContactDetails) &&
                    (contact ? <button onClick={() => enableContactView(!showContact, setShowcontact)} className={styles.button}>{showContact ? '🔒 ' + 'Contact' : '👁️ ' + 'Contact'}</button>
                        :
                        addContactEnabled ?
                            <>
                                <input required type="text" placeholder='Your 10 digit contact...' value={contactvalue} onChange={(e) => setContactValue(e.target.value)} className={styles.input} />
                                <button className={styles.button} onClick={() => addContact(false)}>➕</button>
                                <button className={styles.deleteaccount} onClick={() => { setAddContactEnabled(false); setContactValue('') }}>Cancel</button>
                            </>
                            :
                            <button onClick={() => setAddContactEnabled(!addContactEnabled)} className={styles.button}>➕ Contact</button>
                    )}

                {isLoggedUser() && <button onClick={() => showHideContactDetails(!showContactDetails)} className={styles.button}>{showContactDetails ? '🔒 ' + 'Contact Details' : '👁️ ' + 'Contact Details'}</button>}

                {!isLoggedUser() &&
                    (checkFollowingStatus(followers) ?
                        <button onClick={() => FollowUnfollow(userid)} className={styles.deleteaccount}>Unfollow</button>
                        :
                        privateAccount ?
                            (checkFollowRequest(followRequests) ? <button onClick={() => FollowUnfollow(userid)} className={styles.button}>Request sent</button> : <button onClick={() => FollowUnfollow(userid)} className={styles.button}>Follow</button>)
                            :
                            <button onClick={() => FollowUnfollow(userid)} className={styles.button}>Follow</button>)}

                {isLoggedUser() ?
                    privateAccount ?
                        <button onClick={() => changeAccountPrivacy(!privateAccount, setPrivateAccount)} className={styles.button}>Change Account to Public</button>
                        :
                        <button onClick={() => changeAccountPrivacy(!privateAccount, setPrivateAccount)} className={styles.button}>Change Account to Private</button>
                    :
                    privateAccount ?
                        <p style={{ color: "wheat" }}>This account is private</p>
                        :
                        <></>}

                {(isLoggedUser() && followRequests.length != 0) && <button onClick={() => nav(`/requests/${JSON.parse(localStorage.getItem('LoggedInUser'))?._id}`)} className={styles.button}>Follow Requests {followRequests.length}</button>}

                {isLoggedUser() && <button onClick={DeleteAccount} className={styles.deleteaccount}>Delete My Account</button>}
                
                {!isLoggedUser() && <button onClick={() => nav(`/newmail/${userid}`)} className={styles.button}>📧</button>}
            </div >
        </div >
    );
};

export default Profile;
