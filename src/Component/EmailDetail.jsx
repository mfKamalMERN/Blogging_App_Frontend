import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../Styles/EmailDetail.css'; // Import the CSS file for styling
import Cookies from 'universal-cookie';
import Navbar from './Navbar';
import { HomeBackNavigations } from './HomeBackNavigations';

const EmailDetail = () => {
    const { emailId } = useParams();
    const [emailDetails, setEmailDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const nav = useNavigate();
    const cookies = new Cookies();
    const token = cookies.get('token');

    useEffect(() => {
        const fetchEmailDetails = async () => {
            if (!token) {
                setError(true);
                localStorage.clear();
                cookies.remove('token');
                nav('/')
                return;
            }
            try {
                // const response = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/email/${emailId}`);
                setEmailDetails({ sentTo: "John", sentBy: "Rahul", Subject: "Imp", EmailBody: "sadkjfjfbwejf wqeiufhwqeifhwe weouifhweofhweof", Attachments: [] });
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchEmailDetails();
    }, [emailId]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Something went wrong while fetching the email details.</div>;
    }

    return (
        <>
            <Navbar />
            <br />
            <br />

            <HomeBackNavigations styles={styles} ED={true} />
            <div className="card" style={{ display: "flex", justifyContent: "center" }}>
                <div className="email-detail-container">
                    <h1>Subject: {emailDetails.Subject}</h1>
                    <div className="email-detail">
                        <div className="detail-item">
                            <strong>Sent To:</strong> {emailDetails.sentTo}
                        </div>
                        <div className="detail-item">
                            <strong>Sent By:</strong> {emailDetails.sentBy}
                        </div>
                        {/* <div className="detail-item">
                            <strong>Subject:</strong> {emailDetails.Subject}
                        </div> */}
                        <div className="detail-item">
                            <strong>CC:</strong> {(emailDetails.CC && emailDetails.CC.length > 0) ? emailDetails.CC.map((cc) => <p>{cc}</p>) : 'N/A'}
                        </div>
                        {emailDetails.Attachments.length > 0 && <div className="detail-item">
                            <strong>Attachments:</strong> {emailDetails.Attachments.map((filePath) => (
                                <button><a href={filePath} download={filePath.split('/').pop()}>download {filePath.split('/').pop()}</a></button>))}
                        </div>}
                        <div className="detail-item">
                            {/* <strong>Email Body:</strong> */}
                            <div className="email-body">{emailDetails.EmailBody}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EmailDetail;