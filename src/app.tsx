import { useState, useEffect, useCallback } from "preact/hooks";
import "./app.css";

export function App() {
  const [bpm, setBpm] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext>();

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
    playSound();
  }, [playSound]);

  const handleStartStop = useCallback(() => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  }, []);

  useEffect(() => {
    const newAudioContext = new AudioContext();
    setAudioContext(newAudioContext);

    return () => {
      newAudioContext.close();
    };
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying && audioContext) {
      const interval = (60 / bpm) * 1000;
      intervalId = setInterval(playSound, interval);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [bpm, isPlaying, audioContext, playSound]);

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
