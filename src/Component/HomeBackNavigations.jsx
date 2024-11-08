import { useNavigate } from "react-router-dom";

export const HomeBackNavigations = (props) => {
    const { styles, F, NF } = props;
    const nav = useNavigate();

    return (
        <div style={{ display: "flex", justifyContent: "space-evenly", width: "100%", marginTop: `${(!F && !NF) ? '0px' : '80px'}` }}>

            <button onClick={() => nav(-1)} className={styles.button} style={{ backgroundColor: "black", }}><h1>🔙</h1></button>

            <button onClick={() => nav('/')} className={styles.button} style={{ backgroundColor: "black", }}><h1>🏠</h1></button>

        </div >
    )
}