let ol = require('ol');
let TileLayer = require('ol/layer').Tile;
let OSM = require('ol/source').OSM;

function Electronica() {

  let electronica = new ol.Map({
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    target: 'map',
    view: new ol.View({
      center: [3314687, 8379464],
      zoom: 8,
      projection: 'EPSG:3857'
    }),
    renderer: "canvas"

  });
  return electronica;
}

module.exports = Electronica;