/*
import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import {
    DragAndDrop,
    defaults as defaultInteractions,
} from 'ol/interaction';
import {GPX, GeoJSON, IGC, KML, MVT, TopoJSON} from 'ol/format';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {createXYZ} from 'ol/tilegrid';
*/

// Define a custom MVT format as ol/format/MVT requires an extent

const tileCoordZ = document.getElementById('tileCoordZ');
const tileCoordX = document.getElementById('tileCoordX');
const tileCoordY = document.getElementById('tileCoordY');

class customMVT extends ol.format.MVT {
    constructor() {
        super({featureClass: ol.Feature});
    }
    readFeatures(source, options) {
        options.extent = ol.tilegrid.createXYZ().getTileCoordExtent([
            parseInt(tileCoordZ.value),
            parseInt(tileCoordX.value),
            parseInt(tileCoordY.value),
        ]);
        return super.readFeatures(source, options);
    }
}

// Set up map with Drag and Drop interaction

const dragAndDropInteraction = new ol.interaction.DragAndDrop({
    formatConstructors: [customMVT, ol.format.GPX, ol.format.GeoJSON, ol.format.IGC, ol.format.KML, ol.format.TopoJSON],
});

const map = new ol.Map({
    interactions: ol.interaction.defaults().extend([dragAndDropInteraction]),
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

const displayFeatureInfo = function (pixel) {
    const features = [];
    map.forEachFeatureAtPixel(pixel, function (feature) {
        features.push(feature);
    });
    if (features.length > 0) {
        const info = [];
        let i, ii;
        for (i = 0, ii = features.length; i < ii; ++i) {
            const description =
                features[i].get('name') ||
                features[i].get('_name') ||
                features[i].get('layer');
            if (description) {
                info.push(description);
            }
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

// Sample data download

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

document.getElementById('download-mvt').addEventListener('click', function () {
    const fullpath =
        'https://basemaps.arcgis.com/v1/arcgis/rest/services/World_Basemap/VectorTileServer/tile/' +
        tileCoordZ.value +
        '/' +
        tileCoordY.value +
        '/' +
        tileCoordX.value +
        '.pbf';
    const filename =
        tileCoordZ.value + '-' + tileCoordX.value + '-' + tileCoordY.value + '.mvt';
    download(fullpath, filename);
});
