var fs = require('fs'),
    xml2js = require('xml2js'),
    XMLWriter = require('xml-writer');

var parser = new xml2js.Parser();
var file = '2016-09-18';
fs.readFile(__dirname + '/history-' + file + '.kml', function(err, data) {
    parser.parseString(data, function(err, result) {
        var coord = [];
        var placemarks = result['kml'].Document[0].Placemark;
        var name = result['kml'].Document[0].name[0];
        var descriptionArray = name.split("from");
        var descriptionLoc = descriptionArray[0] + "for Google User from" + descriptionArray[1];
        var open = result['kml'].Document[0].open[0];
        var description = result['kml'].Document[0].description[0];
        xw = new XMLWriter;
        xw.startDocument('1.0', 'UTF-8');
        xw.startElement('kml');
        xw.writeAttribute('xmlns', 'http://www.opengis.net/kml/2.2');
        xw.writeAttribute('xmlns:gx', 'http://www.google.com/kml/ext/2.2');
        xw.startElement('Document');
        xw.startElement('name');
        xw.text(name);
        xw.endElement();
        xw.startElement('open');
        xw.text(open);
        xw.endElement();
        xw.startElement('description');
        xw.text(description);
        xw.endElement();
        xw.startElement('StyleMap');
        xw.writeAttribute('id', 'multiTrack');
        xw.startElement('Pair');
        xw.startElement('key');
        xw.text('normal');
        xw.endElement();
        xw.startElement('styleUrl')
        xw.text('#multiTrack_n');
        xw.endElement();
        xw.endElement();
        xw.startElement('Pair');
        xw.startElement('key');
        xw.text('highlight');
        xw.endElement();
        xw.startElement('styleUrl')
        xw.text('#multiTrack_h');
        xw.endElement();
        xw.endElement();
        xw.endElement();

        xw.startElement('Style');
        xw.writeAttribute('id', 'multiTrack_n');
        xw.startElement('IconStyle');
        xw.startElement('Icon');
        xw.startElement('href');
        xw.text('https://earth.google.com/images/kml-icons/track-directional/track-0.png');
        xw.endElement();
        xw.endElement();
        xw.endElement();
        xw.startElement('LineStyle');
        xw.startElement('color');
        xw.text('99ffac59');
        xw.endElement();
        xw.startElement('width');
        xw.text('6');
        xw.endElement();
        xw.endElement();
        xw.endElement();
        xw.startElement('Style');
        xw.writeAttribute('id', 'multiTrack_h');
        xw.startElement('IconStyle');
        xw.startElement('scale');
        xw.text('1.2');
        xw.endElement();
        xw.startElement('Icon');
        xw.startElement('href');
        xw.text('https://earth.google.com/images/kml-icons/track-directional/track-0.png');
        xw.endElement();
        xw.endElement();
        xw.endElement();
        xw.startElement('LineStyle');
        xw.startElement('color');
        xw.text('99ffac59');
        xw.endElement();
        xw.startElement('width');
        xw.text('8');
        xw.endElement();
        xw.endElement();
        xw.endElement();

        xw.startElement('Placemark');
        xw.startElement('name');
        xw.text('Google User');
        xw.endElement();
        xw.startElement('description');
        xw.text(descriptionLoc);
        xw.endElement();
        xw.startElement('gx:Track');
        xw.startElement('altitudeMode');
        xw.text('clampToGround');
        xw.endElement();


        for (var placemark in placemarks) {
            var coords = placemarks[placemark]['gx:Track'][0]['gx:coord'];
            var coordBegin = coords[0];
            var coordEnd = coords[coords.length - 1];
            var begin = placemarks[placemark].TimeSpan[0].begin[0];
            var end = placemarks[placemark].TimeSpan[0].end[0];
            xw.startElement('when');
            xw.text(begin);
            xw.endElement();
            xw.startElement('gx:coord');
            xw.text(coordBegin);
            xw.endElement();
            xw.startElement('when');
            xw.text(end);
            xw.endElement();
            xw.startElement('gx:coord');
            xw.text(coordEnd);
            xw.endElement();
        }
        xw.endElement();

        xw.endElement();
        xw.endElement();
        xw.endDocument();
        fs.writeFile('history-' + file + '_converted.kml', xw.toString())

    });
});
