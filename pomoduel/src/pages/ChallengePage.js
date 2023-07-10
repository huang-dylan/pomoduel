import { useEffect, useState } from "react";
import useUser from '../hooks/useUser';

import {collection, query, addDoc, onSnapshot} from "firebase/firestore"
import {db} from '../firebase'

import { getAuth } from "firebase/auth";

import DateTimePicker from 'react-datetime-picker'
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

// Accordion for every user that exists
const Accordion = ({otherUser}) => {
    const [accordionIsActive, setAccordionIsActive] = useState(false);
    const [timePlanned, setTimePlanned] = useState(new Date());

    return (
        <>
        {accordionIsActive
            ? <button onClick={() => setAccordionIsActive(false)}>-</button>
            : <button onClick={() => setAccordionIsActive(true)}>+</button>}
            <div>
                <ul>
                    {accordionIsActive
                    ? (
                        <fieldset>
                            {/* Date and time picker that chooses what date and time for the challenge is to be planned. */}
                            <div>
                                <DateTimePicker value={timePlanned} onChange={setTimePlanned} onInvalidChange={() => alert(`Please set a proper date and time.`)}/>
                            </div>
                            <button onClick={async () => {
                                if (window.confirm(`Are you sure you want to challenge ${otherUser.data.username} at ${timePlanned.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}?`)) {
                                    try {
                                        if (!timePlanned) {
                                            alert(`Please set a proper date and time.`);
                                            return;
                                        }

                                        if (timePlanned <= new Date()) {
                                            alert(`Please set a date and time later than the current date and time.`);
                                            return;
                                        }

                                        await addDoc(collection(db, 'messages'), {
                                            type: "challenge",
                                            timeSent: new Date(),
                                            timePlanned: timePlanned,
                                            fromuid: String(getAuth().currentUser.uid),
                                            fromusername: String(getAuth().currentUser.displayName),
                                            touid: String(otherUser.data.uid),
                                            tousername: String(otherUser.data.username),
                                        })
                                        alert(`Challenge sent.`);
                                    }
                                    catch (err) {
                                        alert(err);
                                    }}
                                else {
                                    void(0);
                                }}
                                }
                                >
                                Challenge
                            </button>
                        </fieldset>
                    )
                    : null
                    }
                </ul>
            </div>
        </>
    )
}

const ChallengePage = () => {
    const [search, setSearch] = useState();
    const [userResults, setUserResults] = useState([]);

    const { user } = useUser();

    useEffect(() => {
          const q = query(collection(db, 'users'));
          onSnapshot(q, (querySnapshot) => {
            setUserResults(querySnapshot.docs.map(doc => ({
              id: doc.id,
              data: doc.data()
            })))
          })
        }, [user])

    return (
        <>
            <br />
            <br />
            {user
            ? (
                <form>
                    <fieldset>
                        <p>Search for a username here.</p>
                        <input value={search} onChange={e => setSearch(e.target.value)} />
                    </fieldset>
                    <br />
                </form>
            )
            : null}
            
            {user
            ? null
            : (
            <div>
                <p>You are not logged in! Only logged in users can search for other users and challenge them.</p>
            </div>)}
            
{/* (userResults.filter(otherUser => (otherUser.data.uid !== getAuth().currentUser.uid) && (otherUser.data.username.includes(search.toLowerCase()))).map(otherUser => ( */}

            {user && userResults.length > 0 && search
                ? (userResults.filter(otherUser => (otherUser.data.uid !== getAuth().currentUser.uid) && (otherUser.data.username.includes(search.toLowerCase()))).map(otherUser => (
                    <>
                        <fieldset>
                            <p>Username: {otherUser.data.username}</p>
                            <br />
                            <Accordion otherUser={otherUser}/>
                        </fieldset>
                        <br />
                    </>
                )))
            : null}
            
        </>
    )
}

export default ChallengePage;