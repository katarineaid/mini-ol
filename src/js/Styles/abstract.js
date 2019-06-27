/**
 * Класс AbstractStyle - класс, для наследования классов, управляющих режимом отображения графических примитивов
 */
class AbstractStyle {
    /**
     * Создает экзепляр класса AbstractStyle
     * @param params
     */
    constructor(params) {
        this.params = params;
        this.geometryType = params.geometryType;
    }

    /**
     * Возвращает функцию или объект стиля
     * @return {*}
     */
    getStyle() {
        return this.style;
    }

    /**
     * Устанавливает функцию или объект стиля
     * @param style
     */
    setStyle(style) {
        this.style = style;
    }

    /**:
     * Возвращает массив описаний стиля
     */
    styleArray() {
        return [];
    }

    testGeometry(params) {
        if (params.icon || params.image) return "Point";
        if (params.stroke && !params.fill) return "LineString";
        if (params.fill) return "Polygon";
        return "Point";
    }
}

module.exports = AbstractStyle;