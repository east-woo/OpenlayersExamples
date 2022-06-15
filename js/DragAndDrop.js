/*
import 'ol/ol.css';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import Map from 'ol/Map';
import View from 'ol/View';
import {GPX, GeoJSON, IGC, KML, TopoJSON} from 'ol/format';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Vector as VectorSource, XYZ} from 'ol/source';
*/

const key = 'get_your_own_D6rA4zTHduk6KOKTXzGB';
const attributions =
    '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
    '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

const map = new ol.Map({
    layers: [
        new ol.layer.Tile({
            source: new ol.source.XYZ({
                attributions: attributions,
                url:
                    'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
                maxZoom: 20,
            }),
        }),
    ],
    target: 'map',
    view: new ol.View({
        center: [0, 0],
        zoom: 2,
    }),
});

const extractStyles = document.getElementById('extractstyles');
let dragAndDropInteraction;

function setInteraction() {
    if (dragAndDropInteraction) {
        map.removeInteraction(dragAndDropInteraction);
    }
    dragAndDropInteraction = new ol.interaction.DragAndDrop({
        formatConstructors: [
            ol.format.GPX,
            ol.format.GeoJSON,
            ol.format.IGC,
            // use constructed format to set options
            new ol.format.KML({extractStyles: extractStyles.checked}),
            ol.format.TopoJSON,
        ],
    });
    dragAndDropInteraction.on('addfeatures', function (event) {
        const vectorSource = new ol.source.Vector({
            features: event.features,
        });
        map.addLayer(
            new ol.layer.Vector({
                source: vectorSource,
            })
        );
        map.getView().fit(vectorSource.getExtent());
    });
    map.addInteraction(dragAndDropInteraction);
}
setInteraction();

extractStyles.addEventListener('change', setInteraction);

const displayFeatureInfo = function (pixel) {
    const features = [];
    map.forEachFeatureAtPixel(pixel, function (feature) {
        features.push(feature);
    });
    if (features.length > 0) {
        const info = [];
        let i, ii;
        for (i = 0, ii = features.length; i < ii; ++i) {
            info.push(features[i].get('name'));
        }
        document.getElementById('info').innerHTML = info.join(', ') || '&nbsp';
    } else {
        document.getElementById('info').innerHTML = '&nbsp;';
    }
};

map.on('pointermove', function (evt) {
    if (evt.dragging) {
        return;
    }
    const pixel = map.getEventPixel(evt.originalEvent);
    displayFeatureInfo(pixel);
});

map.on('click', function (evt) {
    displayFeatureInfo(evt.pixel);
});

// Sample data downloads

const link = document.getElementById('download');

function download(fullpath, filename) {
    fetch(fullpath)
        .then(function (response) {
            return response.blob();
        })
        .then(function (blob) {
            if (navigator.msSaveBlob) {
                // link download attribute does not work on MS browsers
                navigator.msSaveBlob(blob, filename);
            } else {
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                link.click();
            }
        });
}

document.getElementById('download-gpx').addEventListener('click', function () {
    download('https://openlayers.org/en/latest/examples/data/gpx/fells_loop.gpx', 'fells_loop.gpx');
});

document
    .getElementById('download-geojson')
    .addEventListener('click', function () {
        download('https://openlayers.org/en/latest/examples/data/geojson/roads-seoul.geojson', 'roads-seoul.geojson');
    });

document.getElementById('download-igc').addEventListener('click', function () {
    download('https://openlayers.org/en/latest/examples/data/igc/Ulrich-Prinz.igc', 'Ulrich-Prinz.igc');
});

document.getElementById('download-kml').addEventListener('click', function () {
    download('https://openlayers.org/en/latest/examples/data/kml/states.kml', 'states.kml');
});

document
    .getElementById('download-topojson')
    .addEventListener('click', function () {
        download('https://openlayers.org/en/latest/examples/data/topojson/fr-departments.json', 'fr-departments.json');
    });
