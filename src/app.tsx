import { useState, useEffect, useCallback } from "preact/hooks";
import "./app.css";

import C_chords from "./assets/C.png";
import Dm_chords from "./assets/Dm.png";
import F7m_chords from "./assets/F7m.png";

const chords = [
  {
    image: C_chords,
    name: "C",
  },
  {
    image: Dm_chords,
    name: "Dm",
  },
  {
    image: F7m_chords,
    name: "F7m",
  },
];

export function App() {
  const [bpm, setBpm] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [audioContext, setAudioContext] = useState<AudioContext>();
  const [bepIntervalo, setBepIntervalo] = useState<number>(3);

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

  const handleBpmChange = useCallback(
    (e) => {
      setBpm(Number(e.target.value));
      playSound();
    },
    [playSound]
  );

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
      intervalId = setInterval(() => {
        playSound();
        setActiveIndex((curr) => {
          if (curr === chords.length * bepIntervalo) {
            return 0;
          }

          return curr + 1;
        });
      }, interval);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [bpm, isPlaying, audioContext, playSound, bepIntervalo]);

  return (
    <>
      <div>
        <h1>Metronome</h1>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {chords.map((chord, index) => {
            const isActiveChord = index * bepIntervalo === activeIndex;

            return (
              <div key={index}>
                <img
                  src={chord.image}
                  className={`imageChords ${
                    isActiveChord && "activeImageChord"
                  }`}
                />
                <p
                  className={`titleChord ${
                    isActiveChord && "titleChordActive"
                  }`}
                >
                  {chord.name}
                </p>
              </div>
            );
          })}
        </div>

        <div>
          <label>BPM:</label>
          <input type="number" value={bpm} onChange={handleBpmChange} />
        </div>
        <div>
          <label>Intervalo de acordes por bep:</label>
          <input
            type="number"
            value={bepIntervalo}
            onChange={({ target }) => setBepIntervalo(target.value)}
          />
        </div>
        <button onClick={handleStartStop}>
          {isPlaying ? "Stop" : "Start"}
        </button>
      </div>
    </>
  );
}
