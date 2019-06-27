let Fill = require('ol/style').Fill;
let Stroke = require('ol/style').Stroke;
let Circle = require('ol/style').Circle;
let Icon = require('ol/style').Icon;
let Text = require('ol/style').Text;
let Style = require('ol/style').Style;
let Point = require('ol/geom').Point;

/**
 * Возвращает символ заливки
 * @param {object} params - конфигурация символа
 * @param params.color {string} - RGBA или HEX представление цвета
 * @return {*}
 */
function createFillStyle(params, feature, status) {
  return params ? new Fill(params) : undefined;
}

/**
 * Возвращает символ линии
 * @param {object} params - конфигурация символа
 * @param params.width {number} - толщина
 * @param params.color {string} - цвет
 * @param params.lineCap {string} - тип излома
 * @param params.lineJoin {string} - тип соединения
 * @param params.lineDash {array} - шриховка
 * @param params.lineDashOffset {number} - отступ штриховки
 * @return {*}
 */
function createStrokeStyle(params, feature, status) {
  return params ? new Stroke(params) : undefined;
}

/**
 * Возвращает символ фигуры
 * @param params
 * @return {*}
 */
function createImageStyle(params, feature, status) {
  return params ? new Circle({
      fill: createFillStyle(params.fill),
      stroke: createStrokeStyle(params.stroke),
      radius: params.radius || 5
    })
    :
    undefined;
}

/**
 * Возвращает символ иконки
 * @param params
 * @return {*}
 */
function createIconStyle(params, feature, status) {
  return params ? new Icon(params) : undefined;
}

/**
 * Возвращает символ текста
 * @param params
 * @param feature
 * @return {undefined}
 */
function createTextStyle(params, feature, resolution, status) {
  let flag = params && params.label && feature && resolution;
  let style = undefined;
  if (flag) {
    try {
      let minResolution = params.label.minResolution || 0;
      let maxResolution = params.label.maxResolution || Infinity;
      let textLabel = getText(params, feature, resolution, minResolution, maxResolution);
      style = new Text({
        text: textLabel,
        font: getFontSize(feature, resolution),
        offsetX: params.label.offsetX || 0,
        offsetY: 0,
        scale: params.label.scale || 1,
        rotateWithView: params.label.rotateWithView || true,
        rotation: feature.get(`rotation`) || 0,
        textAlign: params.label.textAlign || 'right',
        textBaseline: params.label.textBaseline || 'alphabetic',
        fill: createFillStyle(params.label.fill),
        backgroundFill: createFillStyle(params.label.backgroundFill),
        stroke: createStrokeStyle(params.label.style)
      });
      if (resolution < minResolution || resolution > maxResolution) {
        return undefined;
      }
    }
    catch (e) {

    }
  }

  return style;
}

function getFontSize(feature, resolution) {
  const fontSize = feature.get(`font`);
  return `normal ${fontSize / (Math.LOG2E * resolution)}px Arial`;
}

function getText(params, feature, resolution, minResolution, maxResolution) {
  if (resolution < minResolution || resolution > maxResolution) {
    return undefined;
  } else {
    let textLabel = feature.get(params.label.field) || params.label.text || "";
    return String(textLabel)
  }
}

function createGeometryCollectionStyle(params, feature, resolution, status) {
  let flag = params && feature;
  let geometryCollectionStyle = undefined;
  if (flag) {
    try {
      //здесь нужно явно передать feature, потому что это повторный вызов
      let fill = SymbolFabric().fill(params.fill, feature);
      let stroke = SymbolFabric().stroke(params.stroke, feature);
      let image = SymbolFabric().image(params.image, feature);
      let text = SymbolFabric().text(params, feature, resolution);
      let icon = SymbolFabric().icon(params.icon, feature);

      if (feature.getGeometry().getType() === 'GeometryCollection') {
        let geometry = feature.getGeometry();
        //let geometries = geometry.getGeometries();
        let geometries = geometry.getExtent();
        let x = (geometries[0] + geometries[2]) / 2;
        let y = (geometries[1] + geometries[3]) / 2;

        let properties = feature.getProperties();
        let point = new Point([x, y]);
        if (properties.textLabelOffsetX && properties.textLabelOffsetY) {
          point = new Point([x + properties.textLabelOffsetX, y - properties.textLabelOffsetY]);
        }
        let startStyle = new Style({
          //geometry: geometries[0],
          geometry: point,
          fill: fill,
          image: icon || image,
          stroke: stroke,
          text: text
        });

        let endStyle = new Style({
          geometry: geometry,
          fill: fill,
          image: icon || image,
          stroke: stroke,
        })

        geometryCollectionStyle = [startStyle, endStyle];
      } else {
        geometryCollectionStyle = new Style({
          stroke: stroke
        })
      }
    }
    catch (e) {

    }
  }

  return geometryCollectionStyle;
}

function createTextLineString(params, feature, resolution) {
  let flag = params && params.label && feature && resolution;
  let style = undefined;
  if (flag) {
    let stroke = SymbolFabric().stroke(params.stroke, feature);
    let text = SymbolFabric().text(params, feature, resolution);


    let geometry = feature.getGeometry();
    let geometries = geometry.getExtent();
    let x = (geometries[0] + geometries[2]) / 2;
    let y = (geometries[1] + geometries[3]) / 2;
    let properties = feature.getProperties();
    let point = new Point([x, y]);
    if (properties.textLabelOffsetX && properties.textLabelOffsetY) {
      point = new Point([x + properties.textLabelOffsetX, y - properties.textLabelOffsetY]);
    }
    let label = new Style({
      geometry: point,
      text: text
    });

    let figure = new Style({
      geometry: geometry,
      stroke: stroke,
    });

    style = [label, figure]
  }
  return style
}


/**
 * Фабрика символов, позволяющая получить объект части стиля в зависимости от выбранного типа и входных параметров
 * @return {{fill: createFillStyle, stroke: createStrokeStyle, image: createImageStyle, text: createTextStyle}}
 */
function SymbolFabric() {
  const fabricDict = {
    "fill": createFillStyle,
    "stroke": createStrokeStyle,
    "image": createImageStyle,
    "text": createTextStyle,
    "icon": createIconStyle,
    "geometryCollection": createGeometryCollectionStyle,
    "textLineString": createTextLineString,
  };
  return fabricDict;
}

module.exports = SymbolFabric;