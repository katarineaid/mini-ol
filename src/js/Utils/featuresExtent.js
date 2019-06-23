function featuresExtent(features) {

  let minX = 99999999;
  let minY = 99999999;
  let maxX = 0;
  let maxY = 0;

  let countFeatures = features.length;

  for (let i = 0; i < countFeatures; i++) {

    let feature = features[i];
    let extent = feature.getGeometry().getExtent();

    if (minX > extent[0]) {
      minX = extent[0];
    }
    if (minY > extent[1]) {
      minY = extent[1];
    }
    if (maxX < extent[2]) {
      maxX = extent[2];
    }
    if (maxY < extent[3]) {
      maxY = extent[3];
    }
  }

  return [minX, minY, maxX, maxY]
}
module.exports = featuresExtent;