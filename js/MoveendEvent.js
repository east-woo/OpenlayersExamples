/*import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import {getBottomLeft, getTopRight} from 'ol/extent';
import {toLonLat} from 'ol/proj';*/

const map = new ol.Map({
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

function display(id, value) {
    document.getElementById(id).value = value.toFixed(2);
}

function wrapLon(value) {
    const worlds = Math.floor((value + 180) / 360);
    return value - worlds * 360;
}

function onMoveEnd(evt) {
    const map = evt.map;
    const extent = map.getView().calculateExtent(map.getSize());
    const bottomLeft = ol.proj.toLonLat(ol.extent.getBottomLeft(extent));
    const topRight = ol.proj.toLonLat(ol.extent.getTopRight(extent));
    display('left', wrapLon(bottomLeft[0]));
    display('bottom', bottomLeft[1]);
    display('right', wrapLon(topRight[0]));
    display('top', topRight[1]);
}

map.on('moveend', onMoveEnd);
