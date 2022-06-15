/*import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';*/
/*import SimpleGeometry from 'ol/geom/SimpleGeometry';*/
/** @type {VectorSource<import("../src/ol/geom/SimpleGeometry.js").default>} */
const source = new ol.source.Vector({
    url: 'https://openlayers.org/en/latest/examples/data/geojson/switzerland.geojson',
    format: new ol.format.GeoJSON(),
});
const style = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.6)',
    }),
    stroke: new ol.style.Stroke({
        color: '#319FD3',
        width: 1,
    }),
    image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.6)',
        }),
        stroke: new ol.style.Stroke({
            color: '#319FD3',
            width: 1,
        }),
    }),
});
const vectorLayer = new ol.layer.Vector({
    source: source,
    style: style,
});
const view = new ol.View({
    center: [0, 0],
    zoom: 1,
});
const map = new ol.Map({
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM(),
        }),
        vectorLayer,
    ],
    target: 'map',
    view: view,
});

const zoomtoswitzerland = document.getElementById('zoomtoswitzerland');
zoomtoswitzerland.addEventListener(
    'click',
    function () {
        const feature = source.getFeatures()[0];
        const polygon = feature.getGeometry();
        view.fit(polygon, {padding: [170, 50, 30, 150]});
    },
    false
);

const zoomtolausanne = document.getElementById('zoomtolausanne');
zoomtolausanne.addEventListener(
    'click',
    function () {
        const feature = source.getFeatures()[0];
        const point = feature.getGeometry();
        view.fit(point, {padding: [170, 50, 30, 150], minResolution: 50});
    },
    false
);

const centerlausanne = document.getElementById('centerlausanne');
centerlausanne.addEventListener(
    'click',
    function () {
        const feature = source.getFeatures()[1];
        const point = feature.getGeometry();
        const size = map.getSize();
        view.centerOn(point.getCoordinates(), size, [570, 500]);
    },
    false
);
