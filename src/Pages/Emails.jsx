import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import Navbar from "../Component/Navbar";
import styles from '../Styles/Emails.module.css'; // Import the CSS file for styling
import { useEmailClk } from "../Helpers/Functions";
import { toast } from "react-toastify";

export const Emails = () => {
    const [emails, setEmails] = useState([]);
    const [axiosError, setAxioserror] = useState(false);
    const nav = useNavigate();
    const { loggeduserid, sentmails } = useParams();
    const cookies = new Cookies();
    const EmailClick = useEmailClk();


    axios.defaults.withCredentials = true;

    const tokenChecker = async () => {
        if (!cookies.get('token') || !localStorage.getItem('token')) {
            localStorage.clear();
            cookies.remove('token');
            nav('/');
            return;
        }

        try {
            if (!sentmails) {
                const { data } = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/emailsreceived/${loggeduserid}`);
                setEmails(data);
                return;
            }

            const { data } = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/emailssent/${loggeduserid}`);
            setEmails(data);
            return;

        } catch (error) {
            console.error(error);
            setAxioserror(true);
        }
    };

    useEffect(() => {
        tokenChecker();
    }, [sentmails]);


    const handleInboxSentToggele = () => {
        if (!sentmails) {
            nav(`/emails/${loggeduserid}/${true}`)
            return
        }
        nav(`/emails/${loggeduserid}`)
    }

    const UnsendMail = (emailId) => {

        if (window.confirm(`Unsending mail..`)) {
            axios.delete(`https://blogging-app-backend-dpk0.onrender.com/unsendemail/${emailId}/${loggeduserid}`)
                .then(async (response) => {
                    if (response.status === 200) {
                        try {
                            // const { data } = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/emailssent/${loggeduserid}`);
                            toast('Email Unsent Successfully')
                            // setEmails(data);
                            nav(-1)
                            return;
                        } catch (error) {
                            console.error(error);
                        }
                        // window.location.reload()
                        // nav(-1)
                    }
                    alert('Error Occurred')

                })
                .catch((error) => console.error(error))
        }
    }


    return (
        axiosError ? <div style={{ color: "wheat" }}>Something went wrong</div> :
            <>
                <Navbar />

                <div className={styles.mailbuttons}>
                    <button className={styles.button} onClick={() => nav(`/newmail`)}>Compose ✏️</button>
                    <button className={styles.button} onClick={handleInboxSentToggele}>{sentmails ? "View Inbox" : "Sent Mails"}</button>
                </div>


                {!emails.length ? <h1 className={styles.noEmails}>No Emails for now...</h1> : emails?.map((email) => (
                    <div className={styles.emailbar} key={email._id} onClick={() => EmailClick(email._id)}>
                        <h4>{!sentmails ? (`From: ${email?.SentBy}`) : (`To: ${email?.SentTo}`)}</h4>
                        {email.Subject && <h5>Subject: {email?.Subject}</h5>}
                        {sentmails && <button onClick={() => UnsendMail(email._id)}>Unsend</button>}
                    </div>
                ))}
            </>
    );
};