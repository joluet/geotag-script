'use strict';
const DEFAULT_DIR = '/Users/jonas/Pictures/2016/';
const TWO_DAYS_SECS = 172800;
const THREE_MINS_SECS = 180;
var request = require('request');
var fs = require('fs');
var exif = require('exiftool');
var exec = require('sync-exec');
var chrome = require('chrome-cookies-secure');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var convertKml = require('./convert_kml.js');


if (argv['help'] || argv['h']) {
    console.log("Usage: geotag [path] [subfolder to start from] \n\n" +
        "Iterates through sub folders of the given path and updates the\n" +
        "coordinates of all images based on your Google location history.\n" +
        "The images have to be grouped by date and the folder names need\n" +
        "to have the format yyyy-mm-dd.");
    return;
}

var args = argv['_'];
if (args.length >= 1) {
    var dir = args[0];
} else {
    var dir = DEFAULT_DIR;
}
var subdirs = getDirectories(dir);
if (args.length >= 2) {
    var start = subdirs.indexOf(args[1]);
    if (start == -1) {
        start = 0;
    }
} else {
    var start = 0;
}

for (var i = start; i < subdirs.length; i++) {
    var subdir = subdirs[i];
    var d = new Date(subdir);
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var kml_request_url = `https://www.google.com/maps/timeline/kml?authuser=0&pb=!1m8!1m3!1i${year}!2i${month}!3i${day}!2m3!1i${year}!2i${month}!3i${day}`;
    console.log(kml_request_url);
    var jar = getCookies("https://www.google.com");
    var google_response = getKml(kml_request_url, jar);

    fs.writeFileSync(`${subdir}places.kml`, google_response, 'utf8');
    convertKml.convertFile(`${subdir}places.kml`);

    var cmd = `exiftool -overwrite_original -geotag ${subdir}places.kml '-geotime<\$\{DateTimeOriginal\}+00:00' -api GeoMaxIntSecs=${THREE_MINS_SECS} -api GeoMaxExtSecs=${TWO_DAYS_SECS} ${dir}${subdir}/`;
    console.log(cmd);
    console.log(exec(cmd));
}

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

function getCookies(req) {
    var ret;
    chrome.getCookies(req, 'jar', function(err, jar) {
        ret = jar;
    });
    while (ret === undefined) {
        require('deasync').runLoopOnce();
    }
    return ret;
}

function getKml(kml_request_url, jar) {
    var ret;
    request({
            url: kml_request_url,
            jar: jar
        },
        function(error, response, body) {
            ret = body;
        });
    while (ret === undefined) {
        require('deasync').runLoopOnce();
    }
    return ret;
}
