import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {db} from './../firebase'
import {collection, addDoc} from 'firebase/firestore'


const CreateAccountPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    // const [users, setUsers] = useState([]);

    const navigate = useNavigate();

    const handleSubmit = async () => {
        // e.preventDefault()
        try {
          await addDoc(collection(db, 'users'), {
            username: username,
            email: email,
            uid: getAuth().currentUser.uid,
            messages: [],
          })
        } catch (err) {
          alert(err)
        }
      }

    const createAccount = async () => {
        try {
            // Stops user if password doesn't match confirm password
            if (password !== confirmPassword ) {
                setError('Password and confirm password do not match');
                return;
            }
            if (!username) {
                setError('Must have actual username');
                return;
            }

            // const q = query(collection(db, 'users'));
            // onSnapshot(q, (querySnapshot) => {
            // setUsers(querySnapshot.docs.map(doc => ({
            //     id: doc.id,
            //     data: doc.data()
            // })))
            // })

            // for (var i in users) {
            //     if (username.toLowerCase() === String(users[i].data.username.toLowerCase())) {
            //         setError(`Username ${users[i].data.username} has already been taken!`);
            //         return;
            //     }
            // }

            // await createUserWithEmailAndPassword(getAuth(), email, password);
            await createUserWithEmailAndPassword(getAuth(), email, password).then(() => {
                handleSubmit();
            }).catch(function(error) {
                console.log(error.message)
            });
            
            await updateProfile(getAuth().currentUser, {
                displayName: username
            })
            navigate('/');

        }
        catch (e) {
            setError(e.message);
        }
    }

    return (
        <>
            <h1>Create Account</h1>
            {/* Displays an error only if there is an error */}
            {error && <p className="error">{error}</p>}
            {error && <br />}
            <input 
                placeholder="Your username"
                value={username}
                onChange={e => setUsername(e.target.value)} 
            />
            <br />
            <input 
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <br />
            <input type="password" 
            placeholder = "Your password"
            value = {password}
            onChange = {e => setPassword(e.target.value)} 
            />
            <br />
            <input type="password" 
            placeholder = "Confirm password"
            value = {confirmPassword}
            onChange = {e => setConfirmPassword(e.target.value)} 
            />
            <br />
            <button onClick={createAccount}>Create Account</button>
            <br />
            <Link to="/login"> Already have an account? Log in here</Link>
        </>
        
    );
}

export default CreateAccountPage;