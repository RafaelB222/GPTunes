import colourSquare1 from '../assets/playlistGraphics/colourSquare1.png';
import colourSquare2 from '../assets/playlistGraphics/colourSquare2.png';
import colourSquare3 from '../assets/playlistGraphics/colourSquare3.png';

const playlistColours = (num) => {
  if (num == 1) {
    return colourSquare1;
  } else if (num == 2) {
    return colourSquare2;
  } else {
    return colourSquare3;
  }
};

export default playlistColours;
