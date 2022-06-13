/*import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {
    Modify,
    Select,
    defaults as defaultInteractions,
} from 'ol/interaction';
import {fromLonLat} from 'ol/proj';*/

const vector = new ol.layer.Vector({
    background: 'white',
    source: new ol.source.Vector({
        url: 'https://openlayers.org/data/vector/us-states.json',
        format: new ol.format.GeoJSON(),
        wrapX: false,
    }),
});

const select = new ol.interaction.Select({
    wrapX: false,
});

const modify = new ol.interaction.Modify({
    features: select.getFeatures(),
});

const map = new ol.Map({
    interactions: ol.interaction.defaults().extend([select, modify]),
    layers: [vector],
    target: 'map',
    view: new ol.View({
        center: ol.proj.fromLonLat([-100, 38.5]),
        zoom: 4,
    }),
});
