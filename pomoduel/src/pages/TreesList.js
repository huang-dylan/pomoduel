import React, { useEffect, useState } from "react";
// import useUser from '../hooks/useUser';
import { getAuth } from "firebase/auth";

import {collection, query, onSnapshot, orderBy} from "firebase/firestore"
import {db} from './../firebase'
import useUser from '../hooks/useUser';
import PomodoroList from "../components/PomodoroList";

const Accordion = ({tree}) => {
    const { user } = useUser();
    const [accordionIsActive, setAccordionIsActive] = useState(false);

    return (
        <>
        {accordionIsActive
            ? <button onClick={() => setAccordionIsActive(false)}>Hide Pomodoros</button>
            : <button onClick={() => setAccordionIsActive(true)}>Show Pomodoros</button>}
            <div>
                <ul>
                    {accordionIsActive
                    ? (
                        <PomodoroList pomodoros={tree.data.pomodoros} uid={user ? String(getAuth().currentUser.uid) : null}/>
                    )
                    : null
                    }
                </ul>
            </div>
        </>
    )
}

const TreesList = () => {
    const [trees, setTrees] = useState([]);
    // const [accordionIsActive, setAccordionIsActive] = useState(false);
    const { user } = useUser();
    useEffect(() => {
          const q = query(collection(db, 'trees'), orderBy('timeLogged', 'desc'))
          onSnapshot(q, (querySnapshot) => {
            setTrees(querySnapshot.docs.map(doc => ({
              id: doc.id,
              data: doc.data()
            })))
          })
        }, [])
        
    return (
        <div>
            <br />
            <br />

            {user
            ? null
            : (
            <div>
                <p>You are not logged in! Only logged in users can log trees and view them.</p>
            </div>)}

            {user && trees.filter(tree => tree.data.uid === getAuth().currentUser.uid).length === 0
            ? (
                <div>
                    <p>You currently have no trees. Make pomodoros and log them as a tree to see them.</p>
                </div>)
            : null}

            {user
            ? (trees.filter(tree => tree.data.uid === getAuth().currentUser.uid).map(tree => (
            <>
                <div className="tree-list">
                    <div className="individual-tree-elements">
                        {tree.data.name
                        ? <>
                            <p>Name: {tree.data.name}</p>
                            <br />
                          </>
                        : null}
                        
                        {tree.data.timeLogged
                        ? <>
                        <p>Time Logged: {tree.data.timeLogged.toDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</p>
                        <br />
                          </>
                        : null}

                        <p>Score: {tree.data.score}</p>
                        <br />
                        <p>Total time: {Math.floor(tree.data.totalUsedTime / 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:{Math.floor(tree.data.totalUsedTime % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})} / {Math.floor(tree.data.totalStartTime / 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:{Math.floor(tree.data.totalStartTime % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</p>
                        <br />
                        <Accordion tree={tree}/>
                    </div>
                </div>
                <br />
            </>
            )))
            : null}
        </div>
    )
}

export default TreesList;