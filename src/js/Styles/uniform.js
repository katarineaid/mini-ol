let Style = require('ol/style').Style;
let AbstractStyle = require('./abstract');

let SymbolFabric = require('../Symbols/SymbolFabric');

/**
 * Класс UniformStyle обеспечивает рендеринг объектов слоя в одном стиле
 * @extends AbstractStyle
 */
class UniformStyle extends AbstractStyle {
  /**
   * Создает экземпляр стиля
   * @param params {object} - опции создания стиля
   * @param params.geometryType {string} - тип геометрии
   */
  constructor(params) {
    super(params);
    this.params = params;
    this.type = "uniform";
    this.geometryType = params.geometryType;
    this.style = this.create(params);
    this.getStyle = this.getStyle.bind(this);
  }

  /**
   * Возвращает функцию стиля
   * @return {styleFunction}
   */
  getStyle() {
    let self = this;
    let style = self.style;
    let params = self.params;
    const styleFunction = function(feature, resolution) {

      let geometryType = feature.getGeometry().getType();

      //грязный hack по пересозданию стиля для GeometryCollection
      if (geometryType === 'GeometryCollection') {

        return SymbolFabric().geometryCollection(params, feature, resolution);

      }

      style.setText(SymbolFabric().text(params, feature, resolution));
      return style


    };
    return styleFunction;
  }


  /**
   * Устанавливает функцию стиля
   * @param style
   */
  setStyle(style) {
    this.style = style;
  }

  create(params) {
    let style;
    try {
      let fill = SymbolFabric().fill(params.fill);
      let stroke = SymbolFabric().stroke(params.stroke);
      let image = SymbolFabric().image(params.image);
      let text = SymbolFabric().text(params.label);
      let icon = SymbolFabric().icon(params.icon);
      style = new Style({
        fill: fill,
        image: icon || image,
        stroke: stroke,
        text: text
      });
    }
    catch (e) {
      console.log(e);
    }
    return style;

  }

}

module.exports = UniformStyle;