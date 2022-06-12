/*
import 'ol/ol.css';
import ImageWMS from 'ol/source/ImageWMS';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import {Image as ImageLayer, Tile as TileLayer} from 'ol/layer';
*/

//
const wmsSource = new ol.source.ImageWMS({
    url: 'https://ahocevar.com/geoserver/wms',
    params: {'LAYERS': 'topp:states'},
    ratio: 1,
    serverType: 'geoserver',
});

const updateLegend = function (resolution) {
    const graphicUrl = wmsSource.getLegendUrl();
    const img = document.getElementById('legend');
    img.src = graphicUrl;
};

const layers = [
    new ol.layer.Tile({
        source: new ol.source.OSM(),
    }),
    new ol.layer.Image({
        extent: [-13884991, 2870341, -7455066, 6338219],
        source: wmsSource,
    }),
];

const map = new ol.Map({
    layers: layers,
    target: 'map',
    view: new ol.View({
        center: [-10997148, 4569099],
        zoom: 4,
    }),
});

// Initial legend
const resolution = map.getView().getResolution();
updateLegend(resolution);

// Update the legend when the resolution changes
map.getView().on('change:resolution', function (event) {
    const resolution = event.target.getResolution();
    updateLegend(resolution);
});
