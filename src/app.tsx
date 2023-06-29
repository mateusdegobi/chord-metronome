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
  const [bpmIncrement, setBpmIncrement] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [audioContext, setAudioContext] = useState<AudioContext>();
  const [bipIntervalo, setBipIntervalo] = useState<number>(3);
  const [reverse, setReverse] = useState(false);

  const playSound = useCallback(() => {
    if (audioContext) {
      const oscillator = audioContext.createOscillator();

      const isActiveChord = chords.map(
        (_, index) => (index + 1) * bipIntervalo
      );

      oscillator.frequency.value = isActiveChord.includes(activeIndex + 1)
        ? 1000 // play
        : 650; // interval
      oscillator.connect(audioContext.destination);
      oscillator.start();

      setTimeout(() => {
        oscillator.stop();
        oscillator.disconnect();
      }, 100); // Duração do som do metrônomo em ms
    }
  }, [activeIndex, audioContext, bipIntervalo]);

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
          if (reverse && curr === 1) {
            setBpm((curr) => curr + bpmIncrement);
            return chords.length * bipIntervalo;
          }
          if (!reverse && curr === chords.length * bipIntervalo) {
            setBpm((curr) => curr + bpmIncrement);
            return 1;
          }

          return !reverse ? curr + 1 : curr - 1;
        });
      }, interval);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [bpm, isPlaying, audioContext, playSound, bipIntervalo, reverse]);

  return (
    <>
      <div>
        <h1>Metronome</h1>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {chords.map((chord, index) => {
            const isActiveChord = (index + 1) * bipIntervalo === activeIndex;
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
          <label htmlFor="bpmInput">BPM:</label>
          <input
            id="bpmInput"
            type="number"
            value={bpm}
            onChange={handleBpmChange}
          />
        </div>
        <div>
          <label htmlFor="intervalInput">Interval/BIP:</label>
          <input
            id="intervalInput"
            type="number"
            value={bipIntervalo}
            onChange={({ target }) => setBipIntervalo(Number(target.value))}
          />
        </div>
        <div>
          <label htmlFor="bpmIncrementInput">Aumentar velocidade de BPM:</label>
          <input
            id="bpmIncrementInput"
            type="number"
            value={bpmIncrement}
            onChange={({ target }) => setBpmIncrement(Number(target.value))}
          />
        </div>
        <div>
          <label htmlFor="reverseCheckbox" style={{ cursor: "pointer" }}>
            Reverse:
          </label>
          <input
            id="reverseCheckbox"
            type="checkbox"
            value={bipIntervalo}
            onChange={({ target }) => setReverse(target.value)}
            style={{ cursor: "pointer" }}
          />
        </div>
        <button onClick={handleStartStop}>
          {isPlaying ? "Stop" : "Start"}
        </button>
      </div>
    </>
  );
}
