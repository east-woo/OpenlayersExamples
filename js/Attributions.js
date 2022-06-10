
/*
import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import {Attribution, defaults as defaultControls} from 'ol/control';
*/

const attribution = new ol.control.Attribution({
    collapsible: false,
});
const map = new ol.Map({
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM(),
        }),
    ],
    controls: ol.control.defaults({attribution: false}).extend([attribution]),
    target: 'map',
    view: new ol.View({
        center: [0, 0],
        zoom: 2,
    }),
});

function checkSize() {
    const small = map.getSize()[0] < 600;
    attribution.setCollapsible(small);
    attribution.setCollapsed(small);
}

window.addEventListener('resize', checkSize);
checkSize();
