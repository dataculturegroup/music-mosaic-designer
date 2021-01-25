Music Mosaic Designer
=====================

A quick web-app to turn audio files into a design for creating hand-made mosaic designed based on the volume.
 
Instructions
------------

1. Drop `.wav` files into the `data/songs/` directory
2. Install python 3 and the depedencies: `pip install -r requirements`
3. Run the app: `python server.py`
4. Visit `http://localhost:5000` and pick a song to visualize

Background
----------

This processes the audio into the number of segments you specify.  Then it evaluates the relative volume of each of 
those segmets, based on the loudest one. Louder segments get longer bars, quieter ones get shorter bars. This is based
decibels (ie. perceptual volume). Then you can use that design to make a circular mosaic mirror-frame!
