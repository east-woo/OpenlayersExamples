/*
import 'ol/ol.css';
import GeoTIFF from 'ol/source/GeoTIFF';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/WebGLTile';
import View from 'ol/View';
*/

const channels = ['red', 'green', 'blue'];
for (const channel of channels) {
    const selector = document.getElementById(channel);
    selector.addEventListener('change', update);

    const input = document.getElementById(`${channel}Max`);
    input.addEventListener('input', update);
}

function getVariables() {
    const variables = {};
    for (const channel of channels) {
        const selector = document.getElementById(channel);
        variables[channel] = parseInt(selector.value, 10);

        const inputId = `${channel}Max`;
        const input = document.getElementById(inputId);
        variables[inputId] = parseInt(input.value, 10);
    }
    return variables;
}

const layer = new ol.layer.WebGLTile({
    style: {
        variables: getVariables(),
        color: [
            'array',
            ['/', ['band', ['var', 'red']], ['var', 'redMax']],
            ['/', ['band', ['var', 'green']], ['var', 'greenMax']],
            ['/', ['band', ['var', 'blue']], ['var', 'blueMax']],
            1,
        ],
    },
    source: new ol.source.GeoTIFF({
        normalize: false,
        sources: [
            {
                url: 'https://s2downloads.eox.at/demo/EOxCloudless/2020/rgbnir/s2cloudless2020-16bits_sinlge-file_z0-4.tif',
            },
        ],
    }),
});

function update() {
    layer.updateStyleVariables(getVariables());
}

const map = new ol.Map({
    target: 'map',
    layers: [layer],
    view: new ol.View({
        projection: 'EPSG:4326',
        center: [0, 0],
        zoom: 2,
        maxZoom: 6,
    }),
});
