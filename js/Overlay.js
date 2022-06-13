/*import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import {fromLonLat, toLonLat} from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';*/

const layer = new ol.layer.Tile({
    source: new ol.source.OSM(),
});

const map = new ol.Map({
    layers: [layer],
    target: 'map',
    view: new ol.View({
        center: [0, 0],
        zoom: 2,
    }),
});

const pos = ol.proj.fromLonLat([16.3725, 48.208889]);

// Popup showing the position the user clicked
const popup = new ol.Overlay({
    element: document.getElementById('popup'),
});
map.addOverlay(popup);

// Vienna marker
const marker = new ol.Overlay({
    position: pos,
    positioning: 'center-center',
    element: document.getElementById('marker'),
    stopEvent: false,
});
map.addOverlay(marker);

// Vienna label
const vienna = new ol.Overlay({
    position: pos,
    element: document.getElementById('vienna'),
});
map.addOverlay(vienna);

map.on('click', function (evt) {
    const element = popup.getElement();
    const coordinate = evt.coordinate;
    const hdms = ol.coordinate.toStringHDMS(ol.proj.toLonLat(coordinate));

    $(element).popover('dispose');
    popup.setPosition(coordinate);
    $(element).popover({
        container: element,
        placement: 'top',
        animation: false,
        html: true,
        content: '<p>The location you clicked was:</p><code>' + hdms + '</code>',
    });
    $(element).popover('show');
});
