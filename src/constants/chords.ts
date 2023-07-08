import C_image from "../assets/chords/C.png";
import Dm_image from "../assets/chords/Dm.png";
import F7m_image from "../assets/chords/F7m.png";

export type ChordType = (typeof chords)[0];

const chords = [
  {
    chord: "Fmaj7",
    image: F7m_image,
  },
  {
    chord: "C",
    image: C_image,
  },
  {
    chord: "Dm",
    image: Dm_image,
  },
];

export default chords;
