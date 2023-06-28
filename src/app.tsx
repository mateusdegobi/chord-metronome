import { useState, useEffect, useCallback } from "preact/hooks";
import "./app.css";

export function App() {
  const [bpm, setBpm] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext>();
  const [intervalId, setIntervalId] = useState<number>();

  const playSound = useCallback(() => {
    if (audioContext) {
      const oscillator = audioContext.createOscillator();
      oscillator.frequency.value = 650; // Freq. do som do metrônomo
      oscillator.connect(audioContext.destination);
      oscillator.start();

      setTimeout(() => {
        oscillator.stop();
        oscillator.disconnect();
      }, 100); // Duração do som do metrônomo em ms
    }
  }, [audioContext]);
  const handleBpmChange = useCallback((e) => {
    setBpm(Number(e.target.value));
  }, []);
  const handleStartStop = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    const newAudioContext = new AudioContext();
    setAudioContext(newAudioContext);

    return () => {
      newAudioContext.close();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / bpm) * 1000;
      const id = setInterval(playSound, interval);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [bpm, intervalId, isPlaying, playSound]);
  return (
    <>
      <div>
        <h1>Metronome</h1>
        <div>
          <label>BPM:</label>
          <input type="number" value={bpm} onChange={handleBpmChange} />
        </div>
        <button onClick={handleStartStop}>
          {isPlaying ? "Stop" : "Start"}
        </button>
      </div>
    </>
  );
}
