// import { initializeRecaptchaConfig } from "firebase/auth";
import useUser from '../hooks/useUser';
// import { getAuth } from "firebase/auth";

const PomodoroList = ({ pomodoros, uid }) => {
    const { user } = useUser();
    return (
        <>
            {user
          ? (
            <>
            <div className="pomodoro-list">
              {pomodoros.filter(pomo => pomo.data.uid === uid).slice().reverse().map(pomo => (
                  <>
                    <div className="individual-pomodoro">
                      <div className="individual-pomodoro-text">
                        {pomo.data.nth
                        ? (
                          <>
                            <h2>{pomo.data.nth} Pomodoro</h2>
                          </>
                          )
                        : null}
                        {pomo.data.pomodoroName
                        ? (
                          <>
                            <p><strong>Pomodoro Name:</strong> {pomo.data.pomodoroName}</p>
                            <br />
                          </>
                          )
                        : null}
                          <p><strong>Time:</strong> {Math.floor((Number(pomo.data.startTime) - Number(pomo.data.secondsLeft)) / 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:{((Number(pomo.data.startTime) - Number(pomo.data.secondsLeft)) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})} 
                          &nbsp;/&nbsp;
                          {(Math.floor(pomo.data.startTime / 60)).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:{(pomo.data.startTime % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</p>
                        <br />
                        {pomo.data.timeFinished
                        ? <p><strong>Finished Time:</strong> {pomo.data.timeFinished.toDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</p>
                        : null}
                        <br />
                        {pomo.data.rating !== 0 
                        ? <p><strong>Rating:</strong> {pomo.data.rating}</p>
                        : <p><strong>No rating</strong></p>}
                        <br />
                        {pomo.data.notes 
                        ? <p><strong>Notes:</strong> {pomo.data.notes}</p>
                        : null}
                      </div>
                    </div>
                  </>
              ))}
              <div className="individual-pomodoro-text">
                {pomodoros.filter(pomo => pomo.data.uid === uid).length <= 0
                ? <p>No pomodoros</p>
                : null}
              </div>
            </div>
            </>
            )
          : (
            <div className="pomodoro-list">
              {pomodoros.slice().reverse().map(pomo => (
                <>
                  <div className="individual-pomodoro">
                    <div className="individual-pomodoro-text">
                      {pomo.nth
                      ? (
                        <>
                          <h2>{pomo.nth} Pomodoro</h2>
                        </>
                        )
                      : null}
                      {pomo.pomodoroName
                      ? (
                      <>
                          <p><strong>Pomodoro Name:</strong> {pomo.pomodoroName}</p>
                          <br />
                      </>
                      )
                      : null}
                      <p><strong>Time:</strong> {Math.floor((Number(pomo.startTime) - Number(pomo.secondsLeft)) / 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:{((Number(pomo.startTime) - Number(pomo.secondsLeft)) % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})} 
                        &nbsp;/&nbsp;
                        {(Math.floor(pomo.startTime / 60)).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:{(pomo.startTime % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</p>
                      <br />
                      {pomo.timeFinished
                        ? <p><strong>Finished Time:</strong> {pomo.timeFinished.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}</p>
                        : null}
                      <br />
                      {pomo.rating !== 0 
                      ? <p><strong>Rating:</strong> {pomo.rating}</p>
                      : <p><strong>No rating</strong></p>}
                      <br />
                      {pomo.notes 
                        ? <p><strong>Notes:</strong> {pomo.notes}</p>
                        : null}
                    </div>
                  </div>
                  <br />
                </>
              ))}
              <div className="individual-pomodoro-text">
                {(pomodoros.length) <= 0
                ? <p>No pomodoros</p>
                : null}
              </div>
            </div>
            )}
        </>
    )
}

export default PomodoroList;