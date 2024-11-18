const Suggestions = (props) => {
    const { handleSuggestionClick, suggestion } = props;
    return (
        <>
            <ul className="suggestions" style={{ listStyleType: 'none', padding: 0, width: "53%" }}>
                {/* {suggestions.map((suggestion, index) => ( */}
                    <>
                        <li
                            className="suggestion"
                            // key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            style={{ cursor: 'pointer', backgroundColor: 'darkslategrey', margin: '0px 0' }}
                        >
                            {suggestion}
                        </li>
                        <hr />
                    </>
                {/* ))} */}
            </ul>
        </>
    )
}

export { Suggestions };