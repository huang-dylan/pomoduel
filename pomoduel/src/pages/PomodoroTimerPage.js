import React, { useEffect, useState } from "react";
import useUser from '../hooks/useUser';
import { getAuth } from "firebase/auth";

import {collection, query, doc, addDoc, deleteDoc, orderBy, onSnapshot} from "firebase/firestore"
import {db} from './../firebase'
import PomodoroList from "../components/PomodoroList";
import MessageList from "../components/MessageList";
import ChallengeList from "../components/ChallengeList";

const PomodoroTimerPage = () => {
  // Initial times
  const [startSeconds, setStartSeconds] = useState(0);
  const [startMinutes, setStartMinutes] = useState(25);
  const [startHours, setStartHours] = useState(0);

  // Whether or not timer is finished
  const [finished, setFinished] = useState(false);

  // Sets timer to whatever's inside useState
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  // Makes timer and setTimer, doesn't put anything in yet
  const [timer, setTimer] = useState();
  const [timerStarted, setTimerStarted] = useState(false);

  // For pomodoro to be logged. sets name, rating, and notes.
  const [pomodoroName, setPomodoroName] = useState();
  const [rating, setRating] = useState(0);
  const [pomodoroNotes, setPomodoroNotes] = useState();

  // Variables to hold collections from Firestore. Pomodoros, messages, and challenges.
  const [pomodoros, setPomodoros] = useState([]);
  const [messages, setMessages] = useState([]);
  const [challenges, setChallenges] = useState([]);

  // Tree score. 
  const startingTreeScore = 6;
  const [treeScore, setTreeScore] = useState(startingTreeScore);

  // 
  const [totalUsedTime, setTotalUsedTime] = useState(0);
  const [totalStartTime, setTotalStartTime] = useState(0);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [finishedTime, setFinishedTime] = useState();

  const [challengeBegun, setChallengeBegun] = useState(false);

  const { user } = useUser();

  // Start, triggered when start button pressed.
  const start = () => {
    // Resets everything
    setTimerStarted(true);
    setFinished(false);
    setPomodoroName();
    setPomodoroNotes()
    setRating(0);
    // Timer IS the interval, decreasing secondsLeft by 1 every second
    const timer = setInterval(() => {
      setSecondsLeft((secondsLeft) => secondsLeft - 1);
      if (secondsLeft === 0) {
        clearInterval(timer);
        setRating(0);
        setFinished(true);
        setFinishedTime(currentTime);
      }
    }, 1000);
    setTimer(timer);
  };

  // Apparently also necessary to stop the timer
  useEffect(() => {
    if (secondsLeft === 0) {
      clearInterval(timer);
      setTimerStarted(false);
      setRating(0);
      setFinished(true);
      setFinishedTime(currentTime);
    }
  }, [secondsLeft, timer, currentTime]);

  // Apparently also also necessary to stop the timer
  useEffect(() => {
    return () => clearInterval(timer);
  }, [timer]);

  // Changes the clock every minute
  useEffect(() => {
    const clock = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => {
      clearInterval(clock); // Return a function to clear the clock so that it will stop being called on unmount
    }
  }, [])

  // Checks if any challenges are past their time, sets challengeBegun as true if so. If all challenges are gone, sets challengeBegun back to false
  useEffect(() => {
    if (user) {
      for (var i in challenges.filter(challenge => challenge.data.touid === getAuth().currentUser.uid)) {
        let currentChallenge = challenges.filter(challenge => challenge.data.touid === getAuth().currentUser.uid)[i];
        // console.log(currentChallenge.data.timePlanned.toDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}));
        // console.log(currentTime);
        if (currentChallenge.data.timePlanned.toDate() <= currentTime) {
          setChallengeBegun(true);
          return;
        }
      }
      setChallengeBegun(false);
    }
  }, [user, challenges, currentTime])

  // Reads pomodoros from Firestore database into pomodoros array if there's a user
  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'pomodoros'), orderBy("timeFinished"));
      onSnapshot(q, (querySnapshot) => {
        setPomodoros(querySnapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    }
  }, [user])

  // Loads messages collection into messages
  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'messages'), orderBy("timeSent"));
      onSnapshot(q, (querySnapshot) => {
        setMessages(querySnapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    }
  }, [user])

  // Loads challenges collection into challenges
  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'challenges'), orderBy("timePlanned"));
      onSnapshot(q, (querySnapshot) => {
        setChallenges(querySnapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    }
  }, [user])

  // If user state ever changes, local pomodoros array gets reset. If user just logged in, pomodoros taken from Firestore. If user logged out, pomodoros resets.
  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged(() => {
      setPomodoros([]);
    });

    return unsubscribe;
  }, []);

  // Calculate tree score. Goes through every pomodoro with the proper uid and calculates through ratingsToScores the correct score.
  useEffect(() => {
    let sumTreeScore = startingTreeScore;
    let sumUsedTime = 0;
    let sumStartTime = 0;
    const ratingsToScores = {0: -1, 1: -5, 2: -3, 3: 1, 4: 3, 5: 5};
    for (let pomo in pomodoros) {
      // console.log(pomodoros[pomo]);
      if (user) {
        if (pomodoros[pomo].data.uid === getAuth().currentUser.uid) {
          sumTreeScore += Number(ratingsToScores[pomodoros[pomo].data.rating]);
          sumUsedTime += Number(Math.floor(pomodoros[pomo].data.startTime - pomodoros[pomo].data.secondsLeft));
          sumStartTime += Number(Math.floor(pomodoros[pomo].data.startTime));
          console.log(pomodoros[pomo]);
        }        
      }
      else {
        sumTreeScore += Number(ratingsToScores[pomodoros[pomo].rating]);
        sumUsedTime += Number(Math.floor(pomodoros[pomo].startTime - pomodoros[pomo].secondsLeft));
        sumStartTime += Number(Math.floor(pomodoros[pomo].startTime));
        console.log(pomodoros[pomo]);
      }
    }
    setTreeScore(sumTreeScore);
    setTotalUsedTime(sumUsedTime);
    setTotalStartTime(sumStartTime);
  }, [pomodoros, user])

  function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}

  // Adds the finished pomodoro to the pomodoro list at the bottom. Uses the current startTime, secondsLeft, and rating
  const addPomodoro = async () => {
    try {
      if (user) {
        let currentnth = ordinal_suffix_of(pomodoros.filter(pomodoro => pomodoro.data.uid === getAuth().currentUser.uid).length + 1);
        await addDoc(collection(db, 'pomodoros'), {
          uid: getAuth().currentUser.uid,
          nth: currentnth,
          pomodoroName: (pomodoroName ? pomodoroName : ""),
          timeFinished: (finishedTime ? finishedTime : null),
          startTime: (startHours * 3600) + (startMinutes * 60) + Number(startSeconds),
          secondsLeft: secondsLeft,
          rating: (rating ? rating : 0),
          notes: (pomodoroNotes ? pomodoroNotes : null),
        })
      }
      else {
        // If user is not logged in, app will simply add the pomodoro to the local array
        let currentnth = ordinal_suffix_of(pomodoros.length + 1);
        setPomodoros([...pomodoros, {
          uid: null,
          nth: currentnth,
          pomodoroName: (pomodoroName ? pomodoroName : ""), 
          timeFinished: (finishedTime ? finishedTime : null),
          startTime: (startHours * 3600) + (startMinutes * 60) + Number(startSeconds), 
          secondsLeft: secondsLeft, 
          rating: (rating ? rating : 0),
          notes: (pomodoroNotes ? pomodoroNotes : null),
        }]);
      }
      setSecondsLeft((startHours * 3600) + (startMinutes * 60) + Number(startSeconds));
      
    } catch (err) {
      alert(err);
    }
  }
  
  // Goes through every pomodoro in the array from the user and deletes it.
  async function deleteLoggedPomodoros(pomo, index, pomoArray) {
    if (pomo.data.uid === getAuth().currentUser.uid) {
      await deleteDoc(doc(db, 'pomodoros', pomo.id));
    }
  }

  // Deletes every current pomodoro of the user and moves them to a new doc in the trees area.
  const logTree = async () => {
    try {
      var currentTreeName = prompt("Enter a name for the tree (or don't)");
      await addDoc(collection(db, 'trees'), {
        uid: getAuth().currentUser.uid,
        name: String(currentTreeName),
        timeLogged: new Date(),
        score: treeScore,
        totalUsedTime: totalUsedTime,
        totalStartTime: totalStartTime,
        pomodoros: pomodoros.filter(pomo => pomo.data.uid === getAuth().currentUser.uid).slice().reverse(),
      })
      pomodoros.forEach(deleteLoggedPomodoros);
      setPomodoros([]);
  }
    catch (err) {
      alert(err);
    }
  }

  return (
    <div className="App">
      <br />
      <br />

      {/* If scheduled challenge is due, everything in page will be taken away for this message. */}
      {challengeBegun
      ? <h1>A challenge has begun! You cannot log new pomodoros or trees at this time. Please head to the arena to fight.</h1>
      : null}

      {/* {challengeBegun
      ? <button onClick={() => setChallengeBegun(false)}>Temporary setChallengeBegun(false) button</button>
      : null} */}

      {user 
      ? null
      : <p>You are not logged in! Logged pomodoros won't save if you refresh, close the tab, or log into another account.</p>}

      <br />

      {/* Shows current time */}
      {currentTime && !challengeBegun
      ? currentTime.toLocaleTimeString('en', { hour: 'numeric', hour12: true, minute: 'numeric' })
      : null}

      <br />
      <br />

      {!challengeBegun && user 
      ? <ChallengeList challenges={challenges} arena={false}/>
      : null}

      {/* Goes through message list, maps out and lists every challenge with appropriate Yes/No or Dismiss buttons. */}
      {!challengeBegun && user && messages.filter(message => message.data.touid === getAuth().currentUser.uid).length > 0
      ? (<><br /> <MessageList messages={messages}/></>)
      : null}
      
      {/* <br /> */}

      {finished
      ? null
      : timerStarted || challengeBegun
        ? null
        : <input 
          placeholder="Set hours..."
          value={startHours}
          onChange={e => {
            let result = e.target.value.replace(/\D/g, '');
            setStartHours(result)}}
      />}

      {finished
      ? null
      : timerStarted || challengeBegun
        ? null
        : <input 
          placeholder="Set minutes..."
          value={startMinutes}
          onChange={e => {
            let result = e.target.value.replace(/\D/g, '');
            setStartMinutes(result)}}
      />}

      {finished
      ? null
      : timerStarted || challengeBegun
          ? null
          : <input
            placeholder = "Set seconds..."
            value = {startSeconds}
            onChange={e => {
            let result = e.target.value.replace(/\D/g, '');
            setStartSeconds(result)}}
      />}  
    
      &nbsp;

      {/* Sets timer for current pomodoro */}
      {finished
      ? null
      : timerStarted || challengeBegun
        ? null
        : <button onClick={() => {
          let setTimerTime = Number(Number((startHours ? startHours : 0) * 3600) + Number((startMinutes ? startMinutes : 0) * 60) + Number(startSeconds ? startSeconds : 0));
          if (setTimerTime <= 0 || isNaN(setTimerTime)) {
            alert(`Please set a proper time.`);
          }
          else {
            setSecondsLeft(setTimerTime);
          }}}>Set Timer</button>}

      &nbsp;

      {/* Starts or pauses current pomodoro */}
      {finished
      ? null
      : challengeBegun
        ? null
        : (timerStarted)
          ? <button onClick={() => {
            clearInterval(timer);
            setTimerStarted(false);
        }}>Pause</button>
          : <button onClick={start}>Start</button>}

      &nbsp;

      {/* Allows user to abort current pomodoro and finish early if they want */}
      {!challengeBegun && timerStarted
        ? <button onClick={() => {
          clearInterval(timer);
          setFinished(true);
          setTimerStarted(false);
          setFinishedTime(new Date());
        }}>Finished?</button>
        : null}

      {/* Timer for current pomodoro */}
      {challengeBegun
      ? null
      : <div>
          <h1>{Math.floor(secondsLeft / 3600).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})} : {Math.floor(secondsLeft % 3600 / 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})} : {(secondsLeft % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</h1>
        </div>}
      
      {/* Score for all logged pomodoros belonging to the user */}
      {challengeBegun
      ? null
      : <div>
          <h3>Score: {treeScore}</h3>
        </div>}
      
    {/* When timer finishes, allows user to log their finished pomodoro */}
      {!challengeBegun && finished
      ? (
        <>
        <br />
        <form>
            <fieldset>
                <legend><strong>Log your pomodoro</strong></legend>

                {/* Tells user how much of timer they used of complete timer */}
                <p>{`Total Time: ${Math.floor((Number(Number(startHours * 3600) + Number(startMinutes * 60) + Number(startSeconds)) - Number(secondsLeft)) / 3600).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${Math.floor((Number((startHours * 3600) + Number(startMinutes * 60) + Number(startSeconds)) - Number(secondsLeft)) % 3600 / 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${Math.floor((Number((startHours * 3600) + Number(startMinutes * 60) + Number(startSeconds)) - Number(secondsLeft)) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})} / 
                ${Math.floor(Number(Number(startHours * 3600) + Number(startMinutes * 60) + Number(startSeconds)) / 3600).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${Math.floor(Number(Number(startHours * 3600) + Number(startMinutes * 60) + Number(startSeconds)) % 3600 / 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${Math.floor(Number(Number(startHours * 3600) + Number(startMinutes * 60) + Number(startSeconds)) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`}</p>
                
                <br />
            
                {/* Shows time the pomodoro was finished */}
                <div>
                  <p>Finished Time: {finishedTime.toLocaleTimeString('en', { hour: 'numeric', hour12: true, minute: 'numeric' })}</p>
                </div>

                {/* Name for pomodoro */}
                <div>
                <p>Name:</p>
                  <input value={pomodoroName} onChange={e => setPomodoroName(e.target.value)} />
                </div>

                {/* Rates on a scale of 1 to 5 */}
                <div>
                    <p>Rate how well do you think you used your time on a scale of 1 to 5.</p>
                    <br />

                    <input type="radio" id='5' name="rating" value={5} onChange={e => setRating(e.target.value)}/>
                    <label for='5' id='5'>5</label>

                    <input type="radio" id={4} name="rating" value={4} onChange={e => setRating(e.target.value)}/>
                    <label for='4' id='4'>4</label>

                    <input type="radio" id={3} name="rating" value={3} onChange={e => setRating(e.target.value)}/>
                    <label for='3' id='3'>3</label>

                    <input type="radio" id={2} name="rating" value={2} onChange={e => setRating(e.target.value)}/>
                    <label for='2' id='2'>2</label>

                    <input type="radio" id={1} name="rating" value={1} onChange={e => setRating(e.target.value)}/>
                    <label for='1' id='1'>1</label>

                    <br />

                    <input type="radio" id={0} name="rating" value={0} onChange={e => setRating(e.target.value)} />
                    <label for='0' id='0'>No rating</label>
                    
                </div>

                <br />

                {/* User can write notes for pomodoro */}
                <p>Notes:</p>
                <textarea value={pomodoroNotes} onChange={e => setPomodoroNotes(e.target.value)}/>

                <br />

                <div>
                    <button type="button" onClick={() => {
                        // console.log("Submit button pushed");
                        addPomodoro()
                        setFinished(false);
                    }}>Submit</button>
                </div>
            </fieldset>
        </form>
        </>
        )
      : null}

      {/* Lists every finished pomodoro in the list in reverse chronological order */}
      {challengeBegun
      ? null
      : (<div>
          <h4>Last Logged Pomodoros:</h4>
          <br />
          <PomodoroList pomodoros={pomodoros} uid={user ? String(getAuth().currentUser.uid) : null}/>
        </div>)
      }

      <br />

      {/* Allows user to log tree. Calls logTree() which deletes all owned pomodoros from pomodoros collection and stores in tree collection */}
      {!challengeBegun && user
      ? <button onClick={() => {
        if (!user) {
          alert("You can't log a tree if you're not logged in.");
          void(0);
        }
        else if ((user && pomodoros.filter(pomo => pomo.data.uid === getAuth().currentUser.uid).length <= 0)) {
          alert("You can't log an empty tree! Try logging some pomodoros first.");
          void(0);
        }
        else {
          if (window.confirm("Are you sure you want to log this tree? Every pomodoro you have will be archived.")) {
            logTree();
          }
          else {
            void(0);
          }
        }
      }
      }>Log Tree</button>
      : null}
      
      
    </div>
  );
}

export default PomodoroTimerPage;