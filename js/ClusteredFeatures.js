/*import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import View from 'ol/View';
import {
    Circle as CircleStyle,
    Fill,
    Stroke,
    Style,
    Text,
} from 'ol/style';
import {Cluster, OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {boundingExtent} from 'ol/extent';*/

const distanceInput = document.getElementById('distance');
const minDistanceInput = document.getElementById('min-distance');

const count = 20000;
const features = new Array(count);
const e = 4500000;
for (let i = 0; i < count; ++i) {
    const coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e];
    features[i] = new ol.Feature(new ol.geom.Point(coordinates));
}

const source = new ol.source.Vector({
    features: features,
});

const clusterSource = new ol.source.Cluster({
    distance: parseInt(distanceInput.value, 10),
    minDistance: parseInt(minDistanceInput.value, 10),
    source: source,
});

const styleCache = {};
const clusters = new ol.layer.Vector({
    source: clusterSource,
    style: function (feature) {
        const size = feature.get('features').length;
        let style = styleCache[size];
        if (!style) {
            style = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 10,
                    stroke: new ol.style.Stroke({
                        color: '#fff',
                    }),
                    fill: new ol.style.Fill({
                        color: '#3399CC',
                    }),
                }),
                text: new ol.style.Text({
                    text: size.toString(),
                    fill: new ol.style.Fill({
                        color: '#fff',
                    }),
                }),
            });
            styleCache[size] = style;
        }
        return style;
    },
});

const raster = new ol.layer.Tile({
    source: new ol.source.OSM(),
});

const map = new ol.Map({
    layers: [raster, clusters],
    target: 'map',
    view: new ol.View({
        center: [0, 0],
        zoom: 2,
    }),
});

const distanceHandler = function () {
    clusterSource.setDistance(parseInt(distanceInput.value, 10));
};
distanceInput.addEventListener('input', distanceHandler);
distanceInput.addEventListener('change', distanceHandler);

const minDistanceHandler = function () {
    clusterSource.setMinDistance(parseInt(minDistanceInput.value, 10));
};
minDistanceInput.addEventListener('input', minDistanceHandler);
minDistanceInput.addEventListener('change', minDistanceHandler);

map.on('click', (e) => {
    clusters.getFeatures(e.pixel).then((clickedFeatures) => {
        if (clickedFeatures.length) {
            // Get clustered Coordinates
            const features = clickedFeatures[0].get('features');
            if (features.length > 1) {
                const extent = ol.extent.boundingExtent(
                    features.map((r) => r.getGeometry().getCoordinates())
                );
                map.getView().fit(extent, {duration: 1000, padding: [90, 90, 90, 90]});
            }
        }
    });
});
