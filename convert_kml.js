var fs = require('fs'),
    xml2js = require('xml2js'),
    XMLWriter = require('xml-writer');

var parser = new xml2js.Parser();


// create the <when></when> node with dynamic values
function createWhen(time, xmlWriterEl) {
    xmlWriterEl.startElement('when');
    xmlWriterEl.text(time);
    xmlWriterEl.endElement();
}
// create the <gx:coord></gx:coord> node with dynamic values
function createCoord(coordEl, xmlWriterEl) {
    xmlWriterEl.startElement('gx:coord');
    xmlWriterEl.text(coordEl);
    xmlWriterEl.endElement();
}
// create <when></when><gx:coord></gx:coord> pair with dynamic values
function createWhenCoordpair(time, coordEl, xmlWriterEl) {
    createWhen(time, xmlWriterEl);
    createCoord(coordEl, xmlWriterEl)
}
// create the <gx:Track></gx:Track> element
function createTrackElement(placemarks, xmlWriterEl) {
    xmlWriterEl.startElement('gx:Track');
    xmlWriterEl.startElement('altitudeMode');
    xmlWriterEl.text('clampToGround');
    xmlWriterEl.endElement();
    for (var placemark in placemarks) {
        var coords = placemarks[placemark]['gx:Track'][0]['gx:coord'];
        if (typeof(coords) == 'undefined') {
            continue;
        }
        var coordBegin = coords[0];
        var coordEnd = coords[coords.length - 1];
        var begin = placemarks[placemark].TimeSpan[0].begin[0];
        var end = placemarks[placemark].TimeSpan[0].end[0];
        if (coords.length == 1) {
            createWhenCoordpair(begin, coordBegin, xmlWriterEl);
            createWhenCoordpair(end, coordEnd, xmlWriterEl);
        } else {
            var beginDate = new Date(begin);
            var endDate = new Date(end);
            var timeSteps = Math.round((endDate - beginDate) / coords.length);
            for (var coord in coords) {
                var seconds = beginDate.getTime();
                var timeSection = new Date(seconds + coord * timeSteps);
                var isoDate = timeSection.toISOString();
                createWhenCoordpair(isoDate, coords[coord], xmlWriterEl);
            }
        }

    }
    xmlWriterEl.endElement();
}
// create KML file
function createDocument(placemarks, xmlWriterEl, filename) {
    xmlWriterEl.startDocument('1.0', 'UTF-8');
    xmlWriterEl.startElement('kml');
    xmlWriterEl.writeAttribute('xmlns', 'http://www.opengis.net/kml/2.2');
    xmlWriterEl.writeAttribute('xmlns:gx', 'http://www.google.com/kml/ext/2.2');
    xmlWriterEl.startElement('Document');
    xmlWriterEl.startElement('Placemark');

    createTrackElement(placemarks, xmlWriterEl);

    xmlWriterEl.endElement();
    xmlWriterEl.endElement();
    xmlWriterEl.endDocument();
    fs.writeFileSync(filename, xmlWriterEl.toString())
}
// read, parse and convert input file; write output file
exports.convertFile = function(filename) {
    var data = fs.readFileSync(filename);
    parser.parseString(data, function(err, result) {
        var placemarks = result['kml'].Document[0].Placemark;
        xw = new XMLWriter;
        createDocument(placemarks, xw, filename);
    });
}
