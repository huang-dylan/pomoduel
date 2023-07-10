import React, { useState, useEffect } from "react";
import useUser from '../hooks/useUser';
import { getAuth } from "firebase/auth";
import {collection, doc, deleteDoc, query, onSnapshot, } from "firebase/firestore"
import {db} from './../firebase'
import PomodoroList from "./PomodoroList";

async function deleteChallenge (challengeId) {
    await deleteDoc(doc(db, 'challenges', challengeId));
}

function calculateTreeScore(pomodoros, uid) {
    let sumTreeScore = 0;
    const ratingsToScores = {0: -1, 1: -5, 2: -3, 3: 1, 4: 3, 5: 5};
    for (let pomo in pomodoros) {
        if (pomodoros[pomo].data.uid === uid) {
          sumTreeScore += Number(ratingsToScores[pomodoros[pomo].data.rating]);
        }        
    }
    return sumTreeScore;
}

const Accordion = ({challenges}) => {
    const [accordionIsActive, setAccordionIsActive] = useState(false);
    const { user } = useUser();

    return (
        <>
        {accordionIsActive
            ? <button onClick={() => setAccordionIsActive(false)}>Hide challenges</button>
            : <button onClick={() => setAccordionIsActive(true)}>Show challenges</button>}
        <div>
                <ul>
                    {accordionIsActive
                        ? (user && challenges.filter(challenge => (challenge.data.touid === getAuth().currentUser.uid)).length > 0
                            ? (
                            <>
                                {challenges.filter(challenge => challenge.data.touid === getAuth().currentUser.uid).map(challenge => (
                                    <p>You have a challenge at {challenge.data.timePlanned.toDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})} with {challenge.data.fromusername}!</p>
                                ))}
                            </>
                            )
                            : <p>No challenges</p>
                        )
                        : null}
                </ul>
        </div>
        </>

    )
}

const ChallengeList = ({challenges, arena}) => {
    const { user } = useUser();
    const [pomodoros, setPomodoros] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect( () => {
        const clock = setInterval(() => {
          setCurrentTime(new Date());
        }, 60000);
        return () => {
          clearInterval(clock); // Return a function to clear the clock so that it will stop being called on unmount
        }
      }, [])

    useEffect(() => {
    if (user) {
        const q = query(collection(db, 'pomodoros'));
        onSnapshot(q, (querySnapshot) => {
        setPomodoros(querySnapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
        })))
        })
    }
    }, [user])

    return (
        <> 
            {!arena
            ? <Accordion challenges={challenges} />
            : null}

            {arena
            ? (
                <> 
                    {challenges.filter(challenge => (challenge.data.touid === getAuth().currentUser.uid) && (challenge.data.timePlanned.toDate() <= currentTime)).map(challenge => (
                        <div className="arena-challenge-list">
                            <div className="individual-arena-trees">
                                <h2>Challenge at {challenge.data.timePlanned.toDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</h2>
                                {calculateTreeScore(pomodoros, String(challenge.data.touid)) > calculateTreeScore(pomodoros, String(challenge.data.fromuid))
                                ? <h3>YOU WIN!</h3>
                                : calculateTreeScore(pomodoros, String(challenge.data.touid)) == calculateTreeScore(pomodoros, String(challenge.data.fromuid))
                                    ? <h3>You tied!</h3>
                                    : <h3>You lose...</h3>}
                                <p>You ({String(challenge.data.tousername)})</p>
                                <br />
                                <p>Your score: {calculateTreeScore(pomodoros, String(challenge.data.touid))}</p>
                                <PomodoroList pomodoros={pomodoros} uid={String(challenge.data.touid)}/>
                                <br />
                                <p>Them ({String(challenge.data.fromusername)})</p>
                                <br />
                                <p>Their score: {calculateTreeScore(pomodoros, String(challenge.data.fromuid))}</p>
                                <PomodoroList pomodoros={pomodoros} uid={String(challenge.data.fromuid)}/>
                                <br />
                                <button onClick={() => deleteChallenge(String(challenge.id))}>Dismiss</button>
                            </div>
                        </div>
                    ))
                    }
                </>
            )
            : null}

            {/* {arena
            ? (challenges.filter(challenge => (challenge.data.touid === getAuth().currentUser.uid) && (challenge.data.timePlanned.toDate() <= currentTime)).length <= 0
                ? (<p>You have no challenges right now! Wait for your challenges to reach their planned times to see them here.</p>)
                : null)
            : null} */}
        </>
    )
}

export default ChallengeList;