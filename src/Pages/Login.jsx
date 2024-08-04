import React, { useEffect, useState } from 'react';
import styles from '../Styles/Login.module.css';
import Navbar from '../Component/Navbar';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

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
    // const [confirmPassword, setConfirmPassword] = useState('');

    axios.defaults.withCredentials = true
    const tokenChecker = async () => {

        try {
            const res = await axios.get(`http://localhost:7500/getallblogs`)

            if (!res.data.Token) {
                nav('/')
                localStorage.clear()
            }
            else {

                nav('/home')
            }

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
            // Handle signup logic here

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
            // Handle login logic here
            axios.post(`http://localhost:7500/login`, formdata)
                .then((res) => {
                    if (res.data.ValidationError) res.data.map((ve) => alert(ve.msg))

                    else if (res.data.LoggedIn) {
                        alert(res.data.Msg)
                        localStorage.setItem('LoggedInUser', JSON.stringify(res.data.LoggedUser))
                        nav('/home')
                    }

                    else alert(res.data.Msg)

                })
                .catch(err => console.log(err))

        }
    };

    const toggleForm = () => {
        setIsSignup(!isSignup);
    };

    const handleChange = (e) => {
        setFormdata({ ...formdata, [e.target.name]: e.target.value })

    }

    return (
        <div>
            <Navbar isSignup={isSignup} toggleForm={toggleForm} isLogin={true} />

            <div className={styles.formContainer}>

                <h2>{isSignup ? 'Signup' : 'Login'}</h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Email:</label>
                        <input
                            type="email"
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
                        {isSignup ? 'Signup' : 'Login'}
                    </button>
                </form>
                <button onClick={toggleForm} className={styles.toggleButton}>
                    {isSignup ? 'Already have an account? Login' : 'New user? Signup'}
                </button>
            </div>
        </div>
    );
};

export { Login };
