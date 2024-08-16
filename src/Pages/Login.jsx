import React, { useEffect, useState } from 'react';
import styles from '../Styles/Login.module.css';
import Navbar from '../Component/Navbar';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Localization from '../Resources/Localization.json'

const Login = () => {
    const nav = useNavigate()

    const [formdata, setFormdata] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        contact: "",

    })

    const [isSignup, setIsSignup] = useState(false);

    axios.defaults.withCredentials = true
    const tokenChecker = async () => {

        try {
            const res = await axios.get(`http://localhost:7500/getallblogs`)

            if (!res.data.Token) {
                nav('/')
                localStorage.clear()
            }

            else nav(`/profile/${JSON.parse(localStorage.getItem('LoggedInUser'))._id}`)

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

            axios.post(`http://localhost:7500/signup`, formdata)
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

            axios.post(`http://localhost:7500/login`, formdata)
                .then((res) => {
                    if (res.data.ValidationError) res.data.map((ve) => alert(ve.msg))

                    else if (res.data.LoggedIn) {
                        localStorage.setItem('LoggedInUser', JSON.stringify(res.data.LoggedUser))
                        nav(`/profile/${res.data.LoggedUser._id}`)
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
            <div className="all" style={{ display: 'flex', justifyContent: "space-evenly" }}>


                <img src="https://files.oaiusercontent.com/file-Bb3xl4V6hgMwPwSX0B4ZFmj9?se=2024-08-16T18%3A28%3A43Z&sp=r&sv=2023-11-03&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3De39b3d1a-008d-4482-a205-586712ac1746.webp&sig=eIR5QwRRIvYg182GoFlj6rq31dmqxK%2BFHxnC8%2Bu8BtY%3D" alt="" />

                <div className="contents">

                    <h1 style={{ color: "wheat", marginTop: "120px" }}>{Localization.navbar.brand}</h1>

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
                                <input
                                    type="password"
                                    placeholder='Password...'
                                    value={formdata.password}
                                    onChange={handleChange}
                                    required
                                    className={styles.input}
                                    name='password'
                                />
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
            </div>
        </div>
    );
};

export { Login };
