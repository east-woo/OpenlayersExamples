/*import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import {
    DragRotateAndZoom,
    defaults as defaultInteractions,
} from 'ol/interaction';
import {OverviewMap, defaults as defaultControls} from 'ol/control';*/

const rotateWithView = document.getElementById('rotateWithView');

//오버뷰 컨트롤
const overviewMapControl = new ol.control.OverviewMap({
    // see in overviewmap-custom.html to see the custom CSS used
    className: 'ol-overviewmap ol-custom-overviewmap',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM({
                'url':
                    'https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png' +
                    '?apikey=0e6fc415256d4fbb9b5166a718591d71',
            }),
        }),
    ],
    collapseLabel: '\u00BB',
    label: '\u00AB',
    collapsed: false,//초기값
});

//rotate with view 체크박스
// 컨트롤 뷰가 회전해야 하는 경우 true입니다. setRotateWithView
rotateWithView.addEventListener('change', function () {
    overviewMapControl.setRotateWithView(this.checked);
});

const map = new ol.Map({
    controls: ol.control.defaults().extend([overviewMapControl]),
    interactions: ol.interaction.defaults().extend([new ol.interaction.DragRotateAndZoom()]),
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM(),
        }),
    ],
    target: 'map',
    view: new ol.View({
        center: [500000, 6000000],
        zoom: 7,
    }),
});
