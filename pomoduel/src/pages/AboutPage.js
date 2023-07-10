import { Link } from "react-router-dom";

const AboutPage = () => {
    return (
        <>
            <br />
            <br />
            <h3>What is PomoDuel?</h3>
            <p>PomoDuel is a productivity app based on logging and duelling pomodoros.</p>
            <h3>What's a pomodoro?</h3>
            <p>Pomodoros are units of time designed for people to work (usually 25 minutes) and take breaks in between (usually 5-10 minutes).</p>
            <h3>Pomodoros / Trees</h3>
            <p>Make your pomodoros here and log them. Collectively, all your pomodoros will add up to a score. Submit that score by logging the whole set of pomodoros as a tree.</p>
            <h3>Challenge / Arena</h3>
            <p>Challenge your friends to a scheduled duel competing each of your trees. Whoever does the best work wins!</p>
            <br />
            <h3>Credits</h3>
            <p>Created by Dylan Huang in React.js with JavaScript, HTML, and CSS. See my <Link to="https://github.com/huang-dylan">GitHub</Link> and <Link to="https://www.linkedin.com/in/huang-dylan/">LinkedIn!</Link></p>
        </>
    );
}

export default AboutPage;