/*
import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import Polyline from 'ol/format/Polyline';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import {
    Circle as CircleStyle,
    Fill,
    Icon,
    Stroke,
    Style,
} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {getVectorContext} from 'ol/render';
*/

const key = 'get_your_own_D6rA4zTHduk6KOKTXzGB';
const attributions =
    '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
    '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

const center = [-5639523.95, -3501274.52];
const map = new ol.Map({
    target: document.getElementById('map'),
    view: new ol.View({
        center: center,
        zoom: 10,
        minZoom: 2,
        maxZoom: 19,
    }),
    layers: [
        new ol.layer.Tile({
            source: new ol.source.XYZ({
                attributions: attributions,
                url: 'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=' + key,
                tileSize: 512,
            }),
        }),
    ],
});

// The polyline string is read from a JSON similiar to those returned
// by directions APIs such as Openrouteservice and Mapbox.
fetch('https://openlayers.org/en/latest/examples/data/polyline/route.json').then(function (response) {
    response.json().then(function (result) {
        const polyline = result.routes[0].geometry;
        const route = new ol.format.Polyline({
            factor: 1e6,
        }).readGeometry(polyline, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
        });
        const routeFeature = new ol.Feature({
            type: 'route',
            geometry: route,
        });
        const startMarker = new ol.Feature({
            type: 'icon',
            geometry: new ol.geom.Point(route.getFirstCoordinate()),
        });
        const endMarker = new ol.Feature({
            type: 'icon',
            geometry: new ol.geom.Point(route.getLastCoordinate()),
        });
        const position = startMarker.getGeometry().clone();
        const geoMarker = new ol.Feature({
            type: 'geoMarker',
            geometry: position,
        });

        const styles = {
            'route': new ol.style.Style({
                stroke: new ol.style.Stroke({
                    width: 6,
                    color: [237, 212, 0, 0.8],
                }),
            }),
            'icon': new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: 'https://openlayers.org/en/latest/examples/data/icon.png',
                }),
            }),
            'geoMarker': new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({color: 'black'}),
                    stroke: new ol.style.Stroke({
                        color: 'white',
                        width: 2,
                    }),
                }),
            }),
        };

        let vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [routeFeature, geoMarker, startMarker, endMarker],
            }),
            style: function (feature) {
                return styles[feature.get('type')];
            },
        });

        map.addLayer(vectorLayer);

        const speedInput = document.getElementById('speed');
        const startButton = document.getElementById('start-animation');
        let animating = false;
        let distance = 0;
        let lastTime;

        function moveFeature(event) {
            const speed = Number(speedInput.value);
            const time = event.frameState.time;
            const elapsedTime = time - lastTime;
            distance = (distance + (speed * elapsedTime) / 1e6) % 2;
            lastTime = time;
            const currentCoordinate = route.getCoordinateAt(
                distance > 1 ? 2 - distance : distance
            );
            position.setCoordinates(currentCoordinate);
            const vectorContext = ol.render.getVectorContext(event);
            vectorContext.setStyle(styles.geoMarker);
            vectorContext.drawGeometry(position);
            // tell OpenLayers to continue the postrender animation
            map.render();
        }

        function startAnimation() {
            animating = true;
            lastTime = Date.now();
            startButton.textContent = '멈춤';
            vectorLayer.on('postrender', moveFeature);
            // hide geoMarker and trigger map render through change event
            geoMarker.setGeometry(null);
        }

        function stopAnimation() {
            animating = false;
            startButton.textContent = '시작';

            // Keep marker at current animation position
            geoMarker.setGeometry(position);
            vectorLayer.un('postrender', moveFeature);
        }

        startButton.addEventListener('click', function () {
            if (animating) {
                stopAnimation();
            } else {
                startAnimation();
            }
        });
    });
});
