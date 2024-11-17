import { useEffect, useState } from "react";
import Navbar from "../Component/Navbar";
import Cookies from "universal-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from '../Styles/WriteMail.module.css';
import { Suggestions } from "../Component/Suggestions";
import { HomeBackNavigations } from "../Component/HomeBackNavigations";

const WriteMail = () => {
    const [userNames, setUserNames] = useState([]);
    const [inputValue, setInputValue] = useState({ To: '', CC: '', Subject: '', Body: '' });
    const [isCC, setIsCC] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const nav = useNavigate();
    const cookies = new Cookies();
    const loggeduserid = JSON.parse(localStorage.getItem('LoggedInUser '))?._id;

    axios.defaults.withCredentials = true;

    const tokenChecker = async () => {
        if (!cookies.get('token') || !localStorage.getItem('token')) {
            localStorage.clear();
            cookies.remove('token');
            nav('/');
            return;
        }

        try {
            // const { data } = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/allusernames/${loggeduserid}`);
            setUserNames(["Faisal", "Rahul Kumar", "Ankit Kumar"]);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        tokenChecker();
    }, []);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(prev => ({ ...prev, [event.target.name]: value }));
        if (event.target.name === 'To') setIsCC(false)

        if (event.target.name === "CC") setIsCC(true)

        // Filter suggestions based on the input value
        if (value && (event.target.name === 'To' || event.target.name === "CC")) {
            const filteredSuggestions = userNames.filter(username => username.toLowerCase().includes(value.toLowerCase()));
            setSuggestions(filteredSuggestions);
        } else setSuggestions([]);
    };

    const handleSuggestionClick = (suggestion) => {
        if (isCC) {
            setInputValue(prev => ({ ...prev, CC: suggestion }));
            setSuggestions([]); // Clear suggestions after selection
            setIsCC(false)
            return;
        }
        setInputValue(prev => ({ ...prev, To: suggestion }));
        setSuggestions([]); // Clear suggestions after selection
    };

    const SendMail = (e) => {
        e.preventDefault();

        if (!Object.values(inputValue)[0]) {
            alert("Please enter a valid username");
            return;
        }

        axios.post(`https://blogging-app-backend-dpk0.onrender.com/newmail/${loggeduserid}`, inputValue)
            .then(res => {
                alert(res.data.message)
                nav(`/emails/${loggeduserid}`)
            })
            .catch(error => console.error(error))
    }

    return (
        <>
            <Navbar />
            <br />
            <HomeBackNavigations styles={styles} WM={true} />
            <form onSubmit={SendMail} className="container" style={{ color: "wheat", marginTop: "30px", width: "50%", marginLeft: "25%" }}>
                <label htmlFor="to">To:</label>
                <input
                    type="text"
                    id="to"
                    value={inputValue.To}
                    onChange={handleInputChange}
                    name="To"
                />
                {suggestions.length > 0 && !isCC &&  suggestions.map((sugg, idx)=>(
                    <Suggestions key={idx} suggestion={sugg} handleSuggestionClick={handleSuggestionClick} />
                ))}
                <br />
                <label htmlFor="cc">CC:</label>
                <input
                    type="text"
                    id="cc"
                    value={inputValue.CC}
                    onChange={handleInputChange}
                    name="CC"
                />
                {suggestions.length > 0 && isCC &&  suggestions.map((sugg, idx)=>(
                    <Suggestions key={idx} suggestion={sugg} handleSuggestionClick={handleSuggestionClick} />
                ))}
                <br />

                <label htmlFor="subject">Subject:</label>
                <input
                    type="text"
                    id="subject"
                    value={inputValue.Subject}
                    onChange={handleInputChange}
                    name="Subject"
                />
                <br />
                <label htmlFor="mailbody">Mail:</label>
                <textarea id="mailbody" value={inputValue.Body} onChange={handleInputChange} name="Body" />
                <br />
                <button type="submit">Send</button>
            </form>
        </>
    );
}

export { WriteMail };