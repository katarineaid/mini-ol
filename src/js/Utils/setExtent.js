function setExtent(params, map) {
  let view = map.getView();
  let extent = params.extent || params.geometry;
  let nearest = params.nearest || false;
  view.fit(extent, {nearest: nearest, minResolution:4});
}

module.exports = setExtent;