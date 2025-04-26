import React, { useState, useRef, useEffect } from 'react';

// Format the elapsed time (in milliseconds) into a string
const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  const milliseconds = String(ms % 1000).padStart(3, '0');
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

const Stopwatch = () => {
  const [elapsed, setElapsed] = useState(0); // Store the elapsed time in state
  const [running, setRunning] = useState(false); // Track if the stopwatch is running
  const [laps, setLaps] = useState([]); // Store recorded lap times
  const [bestTime, setBestTime] = useState(null); // Store the best time

  const startTimeRef = useRef(0); // Ref to store the starting time
  const intervalRef = useRef(null); // Ref to store the interval ID

  // Update the elapsed time on each tick
  const update = () => {
    const currentTime = Date.now();
    setElapsed(currentTime - startTimeRef.current); // Calculate elapsed time
  };

  // Start the stopwatch
  const start = () => {
    if (!running) {
      startTimeRef.current = Date.now() - elapsed; // Set the start time
      setRunning(true); // Mark the stopwatch as running
      intervalRef.current = setInterval(update, 10); // Update every 10ms
    }
  };

  // Stop the stopwatch
  const stop = () => {
    if (running) {
      setRunning(false); // Mark the stopwatch as stopped
      clearInterval(intervalRef.current); // Stop the interval
    }
  };

  // Reset the stopwatch
  const reset = () => {
    stop(); // Stop the stopwatch before resetting
    setElapsed(0); // Reset the elapsed time
    setLaps([]); // Clear the laps
    setBestTime(null); // Reset the best time
  };

  // Record a lap time
  const recordLap = () => {
    const newLap = elapsed;
    setLaps([...laps, newLap]); // Add new lap to the laps array

    // Update the best time
    if (bestTime === null || newLap < bestTime) {
      setBestTime(newLap); // Set the new best time if it's faster
    }
  };

  useEffect(() => {
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div style={styles.container}>
      {/* Watch image background */}
      <div style={styles.watchImageContainer}>
        <img src="/watch.png" alt="Stopwatch" style={styles.watchImage} />
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
    position: 'relative', // To position the watch image inside the container
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
    zIndex: -1, // Ensure the image is behind the stopwatch controls
  },
  watchImage: {
    width: '80%', // Adjust this value to resize the image as needed
    maxWidth: '500px',
    opacity: 0.6, // Add opacity to the background image if needed
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
