import A_image from "../assets/chords/A.png";
import A7_image from "../assets/chords/A7.png";
import Am_image from "../assets/chords/Am.png";
import C_image from "../assets/chords/C.png";
import D_image from "../assets/chords/D.png";
import Dm_image from "../assets/chords/Dm.png";
import E_image from "../assets/chords/E.png";
import Em_image from "../assets/chords/Em.png";
import Fmaj7_image from "../assets/chords/Fmaj7.png";
import G_image from "../assets/chords/G.png";

export type ChordType = (typeof chords)[0];

const chords = [
  {
    chord: "A",
    image: A_image,
  },
  {
    chord: "A7",
    image: A7_image,
  },
  {
    chord: "Am",
    image: Am_image,
  },
  {
    chord: "C",
    image: C_image,
  },
  {
    chord: "D",
    image: D_image,
  },
  {
    chord: "Dm",
    image: Dm_image,
  },
  {
    chord: "E",
    image: E_image,
  },
  {
    chord: "Em",
    image: Em_image,
  },
  {
    chord: "Fmaj7",
    image: Fmaj7_image,
  },
  {
    chord: "G",
    image: G_image,
  },
];

export default chords;
