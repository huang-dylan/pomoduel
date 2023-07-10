import ChallengeList from "../components/ChallengeList";
import React, { useState, useEffect } from "react";
import useUser from '../hooks/useUser';
import {collection, query, onSnapshot, orderBy} from "firebase/firestore"
import {db} from './../firebase'
import { getAuth } from "firebase/auth";

const ArenaPage = () => {
    const [challenges, setChallenges] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const { user } = useUser();
    
    useEffect(() => {
        const clock = setInterval(() => {
          setCurrentTime(new Date());
        }, 60000);
        return () => {
          clearInterval(clock); // Return a function to clear the clock so that it will stop being called on unmount
        }
      }, [])

    useEffect(() => {
        if (user) {
          const q = query(collection(db, 'challenges'), orderBy('timePlanned'));
          onSnapshot(q, (querySnapshot) => {
            setChallenges(querySnapshot.docs.map(doc => ({
              id: doc.id,
              data: doc.data()
            })))
          })
        }
      }, [user])

    return (
        <>
            <br />
            <br />
            {user
            ? null
            : <p>You are not logged in! Only logged in users can view the arena.</p>}
            
            {user && challenges.filter(challenge => (challenge.data.touid === getAuth().currentUser.uid) && (challenge.data.timePlanned.toDate() <= currentTime)).length <= 0
            ? <p>No challenges that have met their scheduled times right now!</p>
            : <ChallengeList challenges={challenges} arena={true}/>}
        </>
    )
}

export default ArenaPage;