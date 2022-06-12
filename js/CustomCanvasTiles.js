/*import 'ol/ol.css';
import MVT from 'ol/format/MVT';
import Map from 'ol/Map';
import TileDebug from 'ol/source/TileDebug';
import TileLayer from 'ol/layer/Tile';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import View from 'ol/View';
import {Fill, Stroke, Style, Text} from 'ol/style';*/

const style = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.6)',
    }),
    stroke: new ol.style.Stroke({
        color: '#319FD3',
        width: 1,
    }),
    text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        fill: new ol.style.Fill({
            color: '#000',
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 3,
        }),
    }),
});

const vtLayer = new ol.layer.VectorTile({
    declutter: true,
    source: new ol.source.VectorTile({
        maxZoom: 15,
        format: new ol.format.MVT(),
        url:
            'https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/' +
            'ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf',
    }),
    style: function (feature) {
        style.getText().setText(feature.get('name'));
        return style;
    },
});

const debugLayer = new ol.layer.Tile({
    source: new ol.source.TileDebug({
        template: 'z:{z} x:{x} y:{-y}',
        projection: vtLayer.getSource().getProjection(),
        tileGrid: vtLayer.getSource().getTileGrid(),
        zDirection: 1,
    }),
});

const map = new ol.Map({
    layers: [vtLayer, debugLayer],
    target: 'map',
    view: new ol.View({
        center: [0, 6000000],
        zoom: 4,
    }),
});
