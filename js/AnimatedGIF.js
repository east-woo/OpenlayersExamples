/*import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import View from 'ol/View';
import {Icon, Style} from 'ol/style';
import {Stamen, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';*/

const iconFeature = new ol.Feature({
    geometry: new ol.geom.Point([0, 0]),
});

const vectorSource = new ol.source.Vector({
    features: [iconFeature],
});

const vectorLayer = new ol.layer.Vector({
    source: vectorSource,
});

const rasterLayer = new ol.layer.Tile({
    source: new ol.source.Stamen({
        layer: 'watercolor',
    }),
});

const map = new ol.Map({
    layers: [rasterLayer, vectorLayer],
    target: document.getElementById('map'),
    view: new ol.View({
        center: [0, 0],
        zoom: 2,
    }),
});

const gifUrl = 'https://openlayers.org/en/latest/examples/data/globe.gif';
const gif = gifler(gifUrl);
gif.frames(
    document.createElement('canvas'),
    function (ctx, frame) {
        if (!iconFeature.getStyle()) {
            iconFeature.setStyle(
                new ol.style.Style({
                    image: new ol.style.Icon({
                        img: ctx.canvas,
                        imgSize: [frame.width, frame.height],
                        opacity: 0.8,
                    }),
                })
            );
        }
        ctx.clearRect(0, 0, frame.width, frame.height);
        ctx.drawImage(frame.buffer, frame.x, frame.y);
        map.render();
    },
    true
);

// change mouse cursor when over icon
map.on('pointermove', function (e) {
    const pixel = map.getEventPixel(e.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});
