import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import useUser from './hooks/useUser';

const NavBar = () => {
    const {user} = useUser();
    const navigate = useNavigate();
    return (
        <nav>
            <ul>
                <li>
                    <p> 
                        <span style={{color: "red"}}><strong>Pomo</strong></span>
                        <span style={{color: "green"}}><strong>Duel</strong></span>
                    </p>
                    
                </li>

                &nbsp;
                &nbsp;
                &nbsp;

                <li>
                    <Link to="/about">About</Link>
                </li>
                
                <li>
                    <Link to="/">Pomodoros</Link>
                </li>

                {user
                ? (
                <li>
                    <Link to="/trees">Trees</Link>
                </li>
                )
                : null}

                {user
                ? (
                <li>
                    <Link to="/challenge">Challenge</Link>
                </li>
                )
                : null}

                {user
                ? (
                    <li>
                        <Link to="/arena">Arena</Link>
                    </li>
                    )
                    : null}

                {user
                ? (
                <li>
                    <Link to="/profile">{getAuth().currentUser.displayName}</Link>
                </li>
                )
                : null}
                
                &nbsp;

                <li>
                    <div className="nav-right">{user 
                    ? <button onClick={() => {
                        navigate('/about');
                        signOut(getAuth());
                    }}>Log Out</button>
                    : <button onClick={() => {
                        navigate('/login');
                    }}>Log In</button>}
                    </div>
                </li>
                
            </ul>
            
        </nav>
    )
}

export default NavBar;