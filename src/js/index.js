let AbstractMap = require('./abstractMap');

let initElectronica = require('./initElectronica');
let Layers = require('./Layers');

class Electronica extends AbstractMap {
  constructor(params) {
    super(params);
    this.electronica = initElectronica();
    this.initScheme = this.initScheme.bind(this);
  }

  initScheme(params) {
    let self = this;
    self.data = params.data;
    self.layers = new Layers(self);
    self.electronica.layers = self.layers;
    //todo refactor
    // self.initStack();
    return self;
  }

}

module.exports = Electronica;
