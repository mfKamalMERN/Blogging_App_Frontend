import React, { useEffect, useState } from 'react';
import styles from '../Styles/Login.module.css';
import Navbar from '../Component/Navbar';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Localization from '../Resources/Localization.json'
import Cookies from 'universal-cookie';

const Login = () => {
    axios.defaults.withCredentials = true;
    const nav = useNavigate()

    const [formdata, setFormdata] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        contact: "",

    })

    const [isSignup, setIsSignup] = useState(false);
    const [showPwd, setShowPwd] = useState(false);

    const tokenChecker = async () => {

        try {
            // const res = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/getallblogs/${JSON.parse(localStorage.getItem('LoggedInUser'))._id}`)
            const cookies = new Cookies()
            if (!cookies.get('token') || !localStorage.getItem('token')) {
                localStorage.clear()
                cookies.remove('token')
                nav('/')
            }

            else nav('/home')
            // nav(`/profile/${JSON.parse(localStorage.getItem('LoggedInUser'))._id}`)

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        tokenChecker()
    }, [])


    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignup) {

            if (formdata.password !== formdata.confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            axios.post(`https://blogging-app-backend-dpk0.onrender.com/signup`, formdata)
                .then(res => {
                    if (res.data.ValidationError) res.data.actError.map((er) => alert(er.msg))

                    else if (res.data.AlreadyRegistered) {
                        alert(res.data.Msg)
                        setIsSignup(false)
                    }

                    else {
                        alert(res.data)
                        setIsSignup(false)
                    }

                })
                .catch(er => console.log(er))

        } else {

            axios.post(`https://blogging-app-backend-dpk0.onrender.com/login`, formdata)
                .then((res) => {
                    if (res.data.ValidationError) res.data.actError.map((ve) => alert(ve.msg))

                    else if (res.data.Token) {
                        console.log(res.data.Token);
                        var cookies = new Cookies()
                        cookies.set('token', res.data.Token);
                        localStorage.setItem('LoggedInUser', JSON.stringify(res.data.LoggedUser))
                        localStorage.setItem('token', res.data.Token);
                        nav(`/home`)
                    }

                    else alert(res.data)

                })
                .catch(err => console.log(err))
        }
    };

    const toggleForm = (val) => {
        setIsSignup(val);
    };

    const handleChange = (e) => setFormdata({ ...formdata, [e.target.name]: e.target.value })


    return (
        <div>
            <Navbar isSignup={isSignup} toggleForm={toggleForm} isLogin={true} />

            <div className={styles.all}>

                {/* <img src="https://img.freepik.com/free-photo/technology-communication-icons-symbols-concept_53876-120314.jpg?t=st=1723934612~exp=1723935212~hmac=5b45024586ce72292a91456f468b35831ee471309183fea3e97598e664954ab4" alt="" width={850} /> */}

                <img src="https://blogging-app-frontend-seven.vercel.app/IonVibe_web_blogging_interface.JPEG" alt="" width={850} />

                <div className="contents" style={{ color: "darkslategrey", marginTop: "100px", display: "flex", flexDirection: "column", alignItems: 'center', }} >

                    <h1>{Localization.navbar.brand}</h1>

                    <div className={styles.formContainer}>

                        <h2>{isSignup ? Localization.navbar.signup : Localization.navbar.login}</h2>

                        <form onSubmit={handleSubmit} className={styles.form}>

                            <div className={styles.formGroup}>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    placeholder='Email...'
                                    value={formdata.email}
                                    onChange={handleChange}
                                    required
                                    className={styles.input}
                                    name='email'
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Password:</label>
                                {!showPwd ?
                                    <>
                                        <input
                                            type="password"
                                            placeholder='Password...'
                                            value={formdata.password}
                                            onChange={handleChange}
                                            required
                                            className={styles.input}
                                            name='password'
                                        />
                                        {formdata.password &&
                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                setShowPwd(!showPwd)
                                            }} className={styles.button}>🔐</button>
                                        }
                                    </>
                                    :
                                    <>
                                        <input
                                            type="text"
                                            placeholder='Password...'
                                            value={formdata.password}
                                            onChange={handleChange}
                                            required
                                            className={styles.input}
                                            name='password'
                                        />
                                        {formdata.password &&
                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                setShowPwd(!showPwd)
                                            }} className={styles.button}>🔓</button>
                                        }
                                    </>

                                }
                            </div>

                            {isSignup && (
                                <>
                                    <div className={styles.formGroup}>
                                        <label>Confirm Password:</label>
                                        <input
                                            type="password"
                                            placeholder='Retype Password...'
                                            value={formdata.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            className={styles.input}
                                            name='confirmPassword'
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Name:</label>
                                        <input
                                            type="text"
                                            placeholder='Name...'
                                            value={formdata.name}
                                            onChange={handleChange}
                                            required
                                            className={styles.input}
                                            name='name'
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Contact:</label>
                                        <input
                                            type="text"
                                            placeholder='Contact...'
                                            value={formdata.contact}
                                            onChange={handleChange}
                                            required
                                            className={styles.input}
                                            name='contact'
                                        />
                                    </div>
                                </>
                            )}

                            <button type="submit" className={styles.button}>
                                {isSignup ? Localization.navbar.signup : Localization.navbar.login}
                            </button>

                        </form>

                        <button onClick={isSignup ? () => toggleForm(false) : () => toggleForm(true)} className={styles.toggleButton}>
                            {isSignup ? Localization.signupPage.loginPrompt : Localization.loginPage.signupPrompt}
                        </button>

                    </div>
                </div>
        //     </div>
        // </div>
    );
};

export { Login };
