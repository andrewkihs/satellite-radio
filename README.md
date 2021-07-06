# Satellite Radio

## Background and Overview

Satellite Radio is a data visualizer that fetches asteroid data to inform video and audio across a web page. [Live site](https://satellite-radio.herokuapp.com/).

## About
On webpage load, user's will be prompted to start the visualizer in order for the page to fetch satellite data from [CelesTrak](https://celestrak.com/), initialize Web Audio Audio nodes, and give the user the option to read about the project via an 'About' modal. After fetching data on active satellites via Axios and a lightweight node server, the propagation of individual satellites are approximated using [satellite.js](https://github.com/shashwatak/satellite-js) and rendered on screen using [three.js](https://threejs.org/). The coordinates of 256 satellites are used to control the oscillators' respective pitches based on satellite's distance from the earth. Future iterations of this project will likely see more options for controlling oscillators' pitch, allowing the user to seek and adjust knobs similar to an oscillator or well -- satellite radio.


## Technology Used
- Vanilla JavaScript
- Node.js
- Express
- Axios
- [Satellite.js](https://github.com/shashwatak/satellite-js)
- [CelesTrak Orbit API](https://celestrak.com/)
- [Three.js](https://threejs.org/)
- Heroku

## View

Below is a truncated view of the website's main feature, a 3D canvas object that allows for zooming and panning via mouse input. 

![zoom/grab example](design_assets/satellite-radio-zoom.gif)

Below is a code snippet which is ran each frame. Because the speed of the animation is controlled and _not_ in realtime, a `Date` object with input based on the value of a range slider. Initially, this value and the rotation of the earth are meant to match realtime. Then, satellite coordinates are updated with select satellites' coordinates updating oscillator pitch..

```javascript 
//game_view.js

const animate = (t) => {
      const date = new Date(newActiveClock.elapsed(t).date());
      line.rotation.y += (1 / 86400) * window.rate; // rotates once a day * rate of playback
      requestAnimationFrame(animate);
      controls.update();
      for (let i = 0; i < satRecs.length; i++) {
        satellites.geometry.vertices[i] = satelliteVectorFunc(satRecs[i], date);
        if (i < 256) { // only update audio for first 256 satellites
          this.updateSatelliteOsc(satellites.geometry.vertices[i], i);
        }
      }
      satellites.geometry.verticesNeedUpdate = true;
      renderer.render(scene, camera);
    };
    animate(this.t);
  }

```

## Data Shape

Satellite data is pulled in from [this](https://celestrak.com/NORAD/elements/gp.php?GROUP=ACTIVE&FORMAT=tle) specific set via CelesTrak. Data is formatted as TLE sets and are fetched using a very lightweight Express/Node server. Below is an example of what these TLE sets look like before they are sent to `Satellite.js`. According to CelesTrak, here are currently more than 4,500 active satellites in orbit. 

```text
...
XMM-NEWTON              
1 25989U 99066A   21188.46966197 -.00000030  00000+0  00000+0 0  9993
2 25989  70.7822 311.6333 6549153  90.2384   0.2836  0.50136190 28318
DMSP 5D-3 F15 (USA 147) 
1 25991U 99067A   21187.57874990 -.00000103  00000+0 -28833-4 0  9998
2 25991  99.0173 168.9167 0010987  89.5020  22.2555 14.16450059114826
...
```

This data is then passed into `satellite.js` and returned as an array with the shape `[x, y, z]` for use with `Three.js`

## Looking forward
The webpage is meant to be very sparse, there are several means through which users may interact with the site (dragging/zooming animation, adjusting playback speed). In the future, there is room for more features that invite user interaction, most revolving around audio manipulation.

### Bonus features

- User can limit types of satellite data (active, historical, private interest)

- User can limit information fed to oscillators

- Polished audio components
