/*
import 'ol/ol.css';
import Map from 'ol/Map';
import MousePosition from 'ol/control/MousePosition';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import {createStringXY} from 'ol/coordinate';
import {defaults as defaultControls} from 'ol/control';
*/

const mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    projection: 'EPSG:4326',
    // comment the following two lines to have the mouse position
    // be placed within the map.
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position'),
});

const map = new ol.Map({
    controls: ol.control.defaults().extend([mousePositionControl]),
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM(),
        }),
    ],
    target: 'map',
    view: new ol.View({
        center: [0, 0],
        zoom: 2,
    }),
});

const projectionSelect = document.getElementById('projection');
projectionSelect.addEventListener('change', function (event) {
    mousePositionControl.setProjection(event.target.value);
});

const precisionInput = document.getElementById('precision');
precisionInput.addEventListener('change', function (event) {
    const format = ol.coordinate.createStringXY(event.target.valueAsNumber);
    mousePositionControl.setCoordinateFormat(format);
});
