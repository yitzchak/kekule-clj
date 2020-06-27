import {
  DOMWidgetModel,
  DOMWidgetView,
} from '@jupyter-widgets/base';

import { MODULE_NAME, MODULE_VERSION } from './version';

// Import the CSS
import '../css/widget.css';

// @ts-ignore
import { Kekule } from 'kekule';

export class KekuleDiagramModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      object: "",
      format: "mol",
      _model_name: KekuleDiagramModel.model_name,
      _model_module: KekuleDiagramModel.model_module,
      _model_module_version: KekuleDiagramModel.model_module_version,
      _view_name: KekuleDiagramModel.view_name,
      _view_module: KekuleDiagramModel.view_module,
      _view_module_version: KekuleDiagramModel.view_module_version,
    };
  }

  static model_name = 'KekuleDiagramModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'KekuleDiagramView';
  static view_module = MODULE_NAME;
  static view_module_version = MODULE_VERSION;
}

export class KekuleDiagramView extends DOMWidgetView {
  viewer: any;

  initialize(parameters: any): void {
    super.initialize(parameters);
    this.model.on('msg:custom', this.handle_custom_message.bind(this));
    this.model.on_some_change([
      'object',
      'format'
    ], this.loadObject.bind(this), this);

  }

  handle_custom_message(content: any): void {
    if (this.viewer) {
    }
  }

  loadObject(): void {
    if (this.viewer) {
      let myMolecule = Kekule.IO.loadFormatData(this.model.get('object'), this.model.get('format'));
      this.viewer.setChemObj(myMolecule);
    }
  }

  render() {
    super.render();

    this.el.classList.add('kekule-widget');
    this.el.classList.add('jupyter-widgets');

    this.displayed.then(() => {
      this.viewer = new Kekule.ChemWidget.Viewer(this.el);
      this.viewer.setDimension(this.el.clientWidth, this.el.clientHeight);
      this.viewer.setPredefinedSetting('fullFunc');
      this.loadObject();
    });
  }

  processPhosphorMessage(msg: any): void {
    super.processPhosphorMessage(msg);
    if ((msg.type === 'resize' || msg.type === 'after-show') && this.viewer) {
      this.viewer.setDimension(this.el.clientWidth, this.el.clientHeight);
    }
  }
}

