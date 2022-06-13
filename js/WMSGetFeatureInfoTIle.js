/*
import 'ol/ol.css';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import View from 'ol/View';
*/

const wmsSource = new ol.source.TileWMS({
    url: 'https://ahocevar.com/geoserver/wms',
    params: {'LAYERS': 'ne:ne', 'TILED': true},
    serverType: 'geoserver',
    crossOrigin: 'anonymous',
});

const wmsLayer = new ol.layer.Tile({
    source: wmsSource,
});

const view = new ol.View({
    center: [0, 0],
    zoom: 1,
});

const map = new ol.Map({
    layers: [wmsLayer],
    target: 'map',
    view: view,
});

map.on('singleclick', function (evt) {
    document.getElementById('info').innerHTML = '';
    const viewResolution = /** @type {number} */ (view.getResolution());
    const url = wmsSource.getFeatureInfoUrl(
        evt.coordinate,//마우스 좌표
        viewResolution, //해상도
        'EPSG:3857',
        {'INFO_FORMAT': 'text/html'}
    );
    if (url) {
        fetch(url)
            .then((response) => response.text())
            .then((html) => {
                document.getElementById('info').innerHTML = html;
            });
    }
});

map.on('pointermove', function (evt) {
    if (evt.dragging) {
        return;
    }
    const data = wmsLayer.getData(evt.pixel);
    const hit = data && data[3] > 0; // transparent pixels have zero for data[3]
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});
