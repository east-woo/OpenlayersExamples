/*
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import {
    DragAndDrop,
    defaults as defaultInteractions,
} from 'ol/interaction';
import {GPX, GeoJSON, IGC, KML, TopoJSON} from 'ol/format';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
*/

// Create functions to extract KML and icons from KMZ array buffer,
// which must be done synchronously.

const zip = new JSZip();

function getKMLData(buffer) {
    let kmlData;
    zip.load(buffer);
    const kmlFile = zip.file(/.kml$/i)[0];
    if (kmlFile) {
        kmlData = kmlFile.asText();
    }
    return kmlData;
}

function getKMLImage(href) {
    let url = href;
    let path = window.location.href;
    path = path.slice(0, path.lastIndexOf('/') + 1);
    if (href.indexOf(path) === 0) {
        const regexp = new RegExp(href.replace(path, '') + '$', 'i');
        const kmlFile = zip.file(regexp)[0];
        if (kmlFile) {
            url = URL.createObjectURL(new Blob([kmlFile.asArrayBuffer()]));
        }
    }
    return url;
}

// Define a KMZ format class by subclassing ol/format/KML

class KMZ extends ol.format.KML {
    constructor(opt_options) {
        const options = opt_options || {};
        options.iconUrlFunction = getKMLImage;
        super(options);
    }

    getType() {
        return 'arraybuffer';
    }

    readFeature(source, options) {
        const kmlData = getKMLData(source);
        return super.readFeature(kmlData, options);
    }

    readFeatures(source, options) {
        const kmlData = getKMLData(source);
        return super.readFeatures(kmlData, options);
    }
}

// 드롭엔 드롭으로 지도 설정

const dragAndDropInteraction = new ol.interaction.DragAndDrop({
    formatConstructors: [KMZ, ol.format.GPX, ol.format.GeoJSON, ol.format.IGC, ol.format.KML, ol.format.TopoJSON],
});

const map = new ol.Map({
    interactions: ol.interaction.defaults().extend([dragAndDropInteraction]),
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

dragAndDropInteraction.on('addfeatures', function (event) {
    const vectorSource = new ol.source.Vector({
        features: event.features,
    });
    map.addLayer(
        new ol.layer.Vector({
            source: vectorSource,
        })
    );
    map.getView().fit(vectorSource.getExtent());
});

//표안에 데이터 삽입
const displayFeatureInfo = function (pixel) {
    const features = [];
    map.forEachFeatureAtPixel(pixel, function (feature) {
        features.push(feature);
    });
    if (features.length > 0) {
        const info = [];
        let i, ii;
        for (i = 0, ii = features.length; i < ii; ++i) {
            const description =
                features[i].get('description') ||
                features[i].get('name') ||
                features[i].get('_name') ||
                features[i].get('layer');
            if (description) {
                info.push(description);
            }
        }
        document.getElementById('info').innerHTML = info.join('<br/>') || '&nbsp';
    } else {
        document.getElementById('info').innerHTML = '&nbsp;';
    }
};

map.on('pointermove', function (evt) {
    if (evt.dragging) {
        return;
    }
    const pixel = map.getEventPixel(evt.originalEvent);
    displayFeatureInfo(pixel);
});

map.on('click', function (evt) {
    displayFeatureInfo(evt.pixel);
});

// 파일다운로드

const link = document.getElementById('download');

function download(fullpath, filename) {
    fetch(fullpath)
        .then(function (response) {
            return response.blob();
        })
        .then(function (blob) {
            if (navigator.msSaveBlob) {
                // link download attribute does not work on MS browsers
                navigator.msSaveBlob(blob, filename);
            } else {
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                link.click();
            }
        });
}

document.getElementById('download-kmz').addEventListener('click', function () {
    download('https://openlayers.org/en/latest/examples/data/kmz/iceland.kmz', 'iceland.kmz');
});
