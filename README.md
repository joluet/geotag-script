# Geo tag photos based on the Google location timeline

This script fetches location history from your [Google timeline](https://www.google.co.uk/maps/timeline)
and uses it to geotag photo files.

Currently, the script assumes that the photos are grouped in folders by date.
The folder names need to have the format `yyyy-mm-dd`.
The script will iterate through all sub folders of the given path and update the
GPS coordinates of all photos based on your Google location history for these dates.

**Usage:**
```javascript
node node_geotag.js [path] [subfolder to start from]

e.g. node node_geotag.js /Users/joe/photos/2016 2016-02-25
```
