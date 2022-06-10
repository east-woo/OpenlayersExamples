/*import 'ol/ol.css';
import Map from 'ol/Map';
import SourceState from 'ol/source/State';
import Stamen from 'ol/source/Stamen';
import View from 'ol/View';
import {Layer, Tile as TileLayer} from 'ol/layer';
import {fromLonLat, toLonLat} from 'ol/proj';
import {getCenter, getWidth} from 'ol/extent';*/

class CanvasLayer extends ol.layer.Layer {
    constructor(options) {
        super(options);
        this.features = options.features;
        this.svg = d3
            .select(document.createElement('div'))
            .append('svg')
            .style('position', 'absolute');
        this.svg.append('path').datum(this.features).attr('class', 'boundary');
    }

/*
    getSourceState() {
        var SourceState = ol.source.State;
        return SourceState.READY;
    }
*/

    render(frameState) {
        const width = frameState.size[0];
        const height = frameState.size[1];
        const projection = frameState.viewState.projection;
        const d3Projection = d3.geoMercator().scale(1).translate([0, 0]);
        let d3Path = d3.geoPath().projection(d3Projection);

        const pixelBounds = d3Path.bounds(this.features);
        const pixelBoundsWidth = pixelBounds[1][0] - pixelBounds[0][0];
        const pixelBoundsHeight = pixelBounds[1][1] - pixelBounds[0][1];

        const geoBounds = d3.geoBounds(this.features);
        const geoBoundsLeftBottom = ol.proj.fromLonLat(geoBounds[0], projection);
        const geoBoundsRightTop = ol.proj.fromLonLat(geoBounds[1], projection);
        let geoBoundsWidth = geoBoundsRightTop[0] - geoBoundsLeftBottom[0];
        if (geoBoundsWidth < 0) {
            geoBoundsWidth += ol.extent.getWidth(projection.getExtent());
        }
        const geoBoundsHeight = geoBoundsRightTop[1] - geoBoundsLeftBottom[1];

        const widthResolution = geoBoundsWidth / pixelBoundsWidth;
        const heightResolution = geoBoundsHeight / pixelBoundsHeight;
        const r = Math.max(widthResolution, heightResolution);
        const scale = r / frameState.viewState.resolution;

        const center = ol.proj.toLonLat(ol.extent.getCenter(frameState.extent), projection);
        const angle = (-frameState.viewState.rotation * 180) / Math.PI;

        d3Projection
            .scale(scale)
            .center(center)
            .translate([width / 2, height / 2])
            .angle(angle);

        d3Path = d3Path.projection(d3Projection);
        d3Path(this.features);

        this.svg.attr('width', width);
        this.svg.attr('height', height);

        this.svg.select('path').attr('d', d3Path);

        return this.svg.node();
    }
}

const map = new ol.Map({
    layers: [
        new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'watercolor',
            }),
        }),
    ],
    target: 'map',
    view: new ol.View({
        center: ol.proj.fromLonLat([-97, 38]),
        zoom: 4,
    }),
});

/**
 * Load the topojson data and create an ol/layer/Image for that data.
 */
d3.json('https://openlayers.org/en/latest/examples/data/topojson/us.json').then(function (us) {
    const layer = new CanvasLayer({
        features: topojson.feature(us, us.objects.counties),
    });
    map.addLayer(layer);
});
