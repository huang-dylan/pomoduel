// import React, { useEffect, useState } from "react";
import useUser from '../hooks/useUser';
import { getAuth } from "firebase/auth";
import {collection, doc, addDoc, deleteDoc} from "firebase/firestore"
import {db} from './../firebase'

const MessageList = ({messages}) => {
    const { user } = useUser();

    return (
        <> 
            {/* Goes through message list, maps out and lists every challenge with appropriate Yes/No or Dismiss buttons. */}
      {user && messages.filter(message => message.data.touid === getAuth().currentUser.uid).length > 0
      ? (
        <div className="message-list">
          <ul>
            {messages.filter(message => message.data.touid === getAuth().currentUser.uid).map(message => (
            <>
              {message.data.type === "challenge"
              ? (<fieldset>
                  <p>{message.data.timeSent.toDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}: Challenge from {message.data.fromusername} to duel at {message.data.timePlanned.toDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}! Do you accept?</p>
                  <button onClick={async () => {
                    try {
                      await addDoc(collection(db, 'messages'), {
                        type: "confirmation",
                        timeSent: new Date(),
                        fromuid: String(getAuth().currentUser.uid),
                        fromusername: String(getAuth().currentUser.displayName),
                        touid: String(message.data.fromuid),
                        tousername: String(message.data.fromusername),
                      })
                      await addDoc(collection(db, 'challenges'), {
                        timePlanned: message.data.timePlanned,
                        fromuid: message.data.fromuid,
                        fromusername: message.data.fromusername,
                        touid: message.data.touid,
                        tousername: message.data.tousername,
                      })
                      await addDoc(collection(db, 'challenges'), {
                        timePlanned: message.data.timePlanned,
                        fromuid: message.data.touid,
                        fromusername: message.data.tousername,
                        touid: message.data.fromuid,
                        tousername: message.data.fromusername,
                      })
                      await deleteDoc(doc(db, 'messages', message.id));
                      alert(`Challenge confirmed!`);
                    }
                    catch (err) {
                      alert(err);
                    }
                  }}>Yes</button>

                  &nbsp;
                  
                  <button onClick={async () => {
                    await addDoc(collection(db, 'messages'), {
                      type: "declination",
                      timeSent: new Date(),
                      fromuid: String(getAuth().currentUser.uid),
                      fromusername: String(getAuth().currentUser.displayName),
                      touid: String(message.data.fromuid),
                      tousername: String(message.data.fromusername),
                    })
                    await deleteDoc(doc(db, 'messages', message.id));
                    alert(`Challenge declined.`);
                  }}>No</button>
                </fieldset>)
              : null}
              {message.data.type === "confirmation"
              ? (<fieldset>
                  <p>{message.data.timeSent.toDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}: {message.data.fromusername} has accepted your challenge! Get ready to duel!</p>
                  <button onClick={async () => {
                    await deleteDoc(doc(db, 'messages', message.id));
                  }}>Dismiss</button>
                </fieldset>)
              : null}
              {message.data.type === "declination"
              ? (<fieldset>
                  <p>{message.data.timeSent.toDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}: {message.data.fromusername} has declined your challenge.</p>
                  <button onClick={async () => {
                    await deleteDoc(doc(db, 'messages', message.id));
                  }}>Dismiss</button>
                </fieldset>)
              : null}
              {message.data.type === "challengeArrival"
              ? (<fieldset>
                <p>{message.data.timeSent.toDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}: Your challenge has arrived!</p>
                <button onClick={async () => {
                  await deleteDoc(doc(db, 'messages', message.id));
                }}>Dismiss</button>
              </fieldset>)
            : null}
            </>
            ))}
          </ul>
        </div>)
      : null}
        </>
    )
}

export default MessageList;