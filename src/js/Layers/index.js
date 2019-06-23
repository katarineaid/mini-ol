let GeoJSON = require('ol/format').GeoJSON;
let VectorLayer = require('ol/layer').Vector;
let VectorSource = require('ol/source').Vector;

const getFeaturesExtent = require('../Utils/featuresExtent');
const setExtent = require('../Utils/setExtent');

class Layers {
  constructor(params) {
    this.electronica = params.electronica;
    this.initScheme(params);
  }

  initScheme(params) {
    let self = this;
    let geojsonObject = params.data.data;
    let electronica = self.electronica;
    const projection = geojsonObject.crs.properties.name || 'EPSG:3857';

    let vectorSource = new VectorSource({
      features: (new GeoJSON()).readFeatures(geojsonObject, {
        featureProjection: projection
      }),
      projection: projection
    });

    let features = vectorSource.getFeatures();
    if (features.length !== 0) {

      let extent = getFeaturesExtent(features);

      setExtent({ extent: extent }, electronica);
    } else {
      setExtent({
        extent: [
          3290510,
          8362102,
          3439207,
          8440816,
        ]
      }, electronica);
    }

    let vector = new VectorLayer({
      source: vectorSource,
    });

    self.scheme = vectorSource;
    self.SchemeLayer = vector;


    electronica.addLayer(vector);
    return self;
  }
}

module.exports = Layers;