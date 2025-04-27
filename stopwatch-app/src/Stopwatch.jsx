import React, { useState, useRef, useEffect } from 'react';

const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  const milliseconds = String(ms % 1000).padStart(3, '0');
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

const Stopwatch = () => {
  const [elapsed, setElapsed] = useState(0); 
  const [running, setRunning] = useState(false); 
  const [laps, setLaps] = useState([]); 
  const [bestTime, setBestTime] = useState(null); 

  const startTimeRef = useRef(0); 
  const intervalRef = useRef(null); 

  const update = () => {
    const currentTime = Date.now();
    setElapsed(currentTime - startTimeRef.current); 
  };

  const start = () => {
    if (!running) {
      startTimeRef.current = Date.now() - elapsed; 
      setRunning(true); 
      intervalRef.current = setInterval(update, 10); 
    }
  };

  const stop = () => {
    if (running) {
      setRunning(false); 
      clearInterval(intervalRef.current); 
    }
  };

  
  const reset = () => {
    stop(); 
    setElapsed(0); 
    setLaps([]); 
    setBestTime(null); 
  };

  const recordLap = () => {
    const newLap = elapsed;
    setLaps([...laps, newLap]); 

    if (bestTime === null || newLap < bestTime) {
      setBestTime(newLap); 
    }
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div style={styles.container}>
      {/* Watch image background */}
      <div style={styles.watchImageContainer}>
        <img src="/https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fpin%2Fdownload-premium-png-of-black-watch-screen-template-transparent-png-by-eye-about-smart-watcch-png-smar--971159107125749648%2F&psig=AOvVaw2g5DHNKohuUl3Naud9wV5r&ust=1745830255470000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPiAttvq94wDFQAAAAAdAAAAABAE" alt="Stopwatch" style={styles.watchImage} />
      </div>

      <div style={styles.time}>{formatTime(elapsed)}</div>
      <div style={styles.buttons}>
        <button onClick={running ? stop : start}>
          {running ? 'Stop' : 'Start'}
        </button>
        <button onClick={reset} disabled={elapsed === 0}>
          Reset
        </button>
        <button onClick={recordLap} disabled={!running}>
          Lap
        </button>
      </div>

      <div style={styles.laps}>
        <h3>Laps</h3>
        {laps.length === 0 ? (
          <p>No laps recorded yet.</p>
        ) : (
          <ul>
            {laps.map((lap, index) => (
              <li key={index}>{`Lap ${index + 1}: ${formatTime(lap)}`}</li>
            ))}
          </ul>
        )}
      </div>

      {bestTime !== null && (
        <div style={styles.bestTime}>
          <h3>Best Time</h3>
          <p>{formatTime(bestTime)}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#121212',
    color: 'white',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', 
  },
  watchImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1, 
  },
  watchImage: {
    width: '80%', 
    maxWidth: '500px',
    opacity: 0.6, 
  },
  time: {
    fontSize: '3em',
    marginBottom: '20px',
  },
  buttons: {
    display: 'flex',
    gap: '15px',
  },
  laps: {
    marginTop: '20px',
    color: 'lightgrey',
  },
  bestTime: {
    marginTop: '20px',
    color: 'lightgreen',
  },
};

export default Stopwatch;
