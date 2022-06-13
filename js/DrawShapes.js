/*import 'ol/ol.css';
import Draw, {
    createBox,
    createRegularPolygon,
} from 'ol/interaction/Draw';
import Map from 'ol/Map';
import Polygon from 'ol/geom/Polygon';
import View from 'ol/View';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';*/

const raster = new ol.layer.Tile({
    source: new ol.source.OSM(),
});

const source = new ol.source.Vector({wrapX: false});

const vector = new ol.layer.Vector({
    source: source,
});

const map = new ol.Map({
    layers: [raster, vector],
    target: 'map',
    view: new ol.View({
        center: [-11000000, 4600000],
        zoom: 4,
    }),
});

const typeSelect = document.getElementById('type');

let draw; // global so we can remove it later
function addInteraction() {
    let value = typeSelect.value;
    if (value !== 'None') {
        let geometryFunction;
        if (value === 'Square') {
            value = 'Circle';
            geometryFunction = ol.interaction.draw.createRegularPolygon(4);
        } else if (value === 'Box') {
            value = 'Circle';
            geometryFunction = ol.interaction.draw.createBox();
        } else if (value === 'Star') {
            value = 'Circle';
            geometryFunction = function (coordinates, geometry) {
                const center = coordinates[0];
                const last = coordinates[coordinates.length - 1];
                const dx = center[0] - last[0];
                const dy = center[1] - last[1];
                const radius = Math.sqrt(dx * dx + dy * dy);
                const rotation = Math.atan2(dy, dx);
                const newCoordinates = [];
                const numPoints = 12;
                for (let i = 0; i < numPoints; ++i) {
                    const angle = rotation + (i * 2 * Math.PI) / numPoints;
                    const fraction = i % 2 === 0 ? 1 : 0.5;
                    const offsetX = radius * fraction * Math.cos(angle);
                    const offsetY = radius * fraction * Math.sin(angle);
                    newCoordinates.push([center[0] + offsetX, center[1] + offsetY]);
                }
                newCoordinates.push(newCoordinates[0].slice());
                if (!geometry) {
                    geometry = new ol.geom.Polygon([newCoordinates]);
                } else {
                    geometry.setCoordinates([newCoordinates]);
                }
                return geometry;
            };
        }
        draw = new ol.interaction.Draw({
            source: source,
            type: value,
            geometryFunction: geometryFunction,
        });
        map.addInteraction(draw);
    }
}

/**
 * Handle change event.
 */
typeSelect.onchange = function () {
    map.removeInteraction(draw);
    addInteraction();
};

document.getElementById('undo').addEventListener('click', function () {
    draw.removeLastPoint();
});

addInteraction();
