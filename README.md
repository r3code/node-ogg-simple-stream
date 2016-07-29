# node-ogg-simple-stream
Simple server to stream OGG file over http. Allows to play specified file in browser html5 &lt;audio>.

## Install
Download and install [Node.js 4 LTS](https://nodejs.org/en/).

## Run
```node play```

## Listen to the audio
Open browser at http://localhost:8125/sound.html and click "Play" button in the browser emedded html5 audio player.
By default server available from all network interfaces. 

To receive stream in ffplay:
```ffplay -vn -nodisp -loop 0 -f ogg http://localhost:8125```
-loop 0 is set to play in infinite loop.

