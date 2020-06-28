import {
  DOMWidgetModel,
  DOMWidgetView,
} from '@jupyter-widgets/base';

import { MODULE_NAME, MODULE_VERSION } from './version';

// Import the CSS
import '../css/widget.css';

// @ts-ignore
import { Kekule } from 'kekule';


class KekuleModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      object: "",
      format: "mol",
      _model_module: MODULE_NAME,
      _model_module_version: MODULE_VERSION,
      _view_module: MODULE_NAME,
      _view_module_version: MODULE_VERSION,
    };
  }
}


export class KekuleView extends DOMWidgetView {
  kekule_obj: any;

  initialize(parameters: any): void {
    super.initialize(parameters);

    this.model.on('msg:custom', this.handle_custom_message.bind(this));

    this.model.on('change:object', this.loadObject.bind(this), this);
    this.model.on('change:format', () => this.sendObject(null), this);
  }

  handle_custom_message(content: any): void {
    if (this.kekule_obj) {
    }
  }

  loadObject(): void {
    if (this.kekule_obj) {
      let myMolecule = Kekule.IO.loadFormatData(this.model.get('object'), this.model.get('format'));
      this.kekule_obj.setChemObj(myMolecule);
    }
  }

  sendObject(obj: any): void {
    try { // This might fail if there are dangling bonds.
      this.model.set('object', String(Kekule.IO.saveFormatData(obj || this.kekule_obj.getChemObj(), this.model.get('format'))));
      this.model.save_changes();
    } catch (e) {}
  }

  on_editing_done(event: any): void {
    this.sendObject(event.obj);
  }

  render() {
    super.render();

    this.el.classList.add('kekule-widget');
    this.el.classList.add('jupyter-widgets');
  }

  load_kekule_obj(): void {
    this.kekule_obj.setDimension(this.el.clientWidth, this.el.clientHeight);
    this.loadObject();
  }

  processPhosphorMessage(msg: any): void {
    super.processPhosphorMessage(msg);
    if ((msg.type === 'resize' || msg.type === 'after-show') && this.kekule_obj) {
      this.kekule_obj.setDimension(this.el.clientWidth, this.el.clientHeight);
    }
  }
}


export class KekuleDiagramModel extends KekuleModel {
  defaults() {
    return {
      ...super.defaults(),
      enable_toolbar: false,
      enable_direct_interaction: true,
      enable_edit: true,
      tool_buttons: [
        "loadData", "saveData", "molDisplayType", "molHideHydrogens", "zoomIn",
        "zoomOut", "rotateLeft", "rotateRight", "rotateX", "rotateY", "rotateZ",
        "reset", "openEditor", "config"
      ],
      resizable: false,
      _model_name: 'KekuleDiagramModel',
      _view_name: 'KekuleDiagramView',
    };
  }
}

export class KekuleDiagramView extends KekuleView {
  initialize(parameters: any): void {
    super.initialize(parameters);

    this.model.on('change:enable_toolbar', this.set_enable_toolbar.bind(this), this);
    this.model.on('change:enable_direct_interaction', this.set_enable_direct_interaction.bind(this), this);
    this.model.on('change:enable_edit', this.set_enable_edit.bind(this), this);
    this.model.on('change:tool_buttons', this.set_tool_buttons.bind(this), this);
    this.model.on('change:resizable', this.set_resizable.bind(this), this);
  }

  set_enable_toolbar(): void {
    if (this.kekule_obj) {
      this.kekule_obj.setEnableToolbar(this.model.get('enable_toolbar'));
    }
  }

  set_enable_direct_interaction(): void {
    if (this.kekule_obj) {
      this.kekule_obj.setEnableDirectInteraction(this.model.get('enable_direct_interaction'));
    }
  }

  set_enable_edit(): void {
    if (this.kekule_obj) {
      this.kekule_obj.setEnableEdit(this.model.get('enable_edit'));
    }
  }

  set_tool_buttons(): void {
    if (this.kekule_obj) {
      this.kekule_obj.setToolButtons(this.model.get('tool_buttons'));
    }
  }

  set_resizable(): void {
    if (this.kekule_obj) {
      this.kekule_obj.setResizable(this.model.get('resizable'));
    }
  }

  render() {
    super.render();

    this.el.classList.add('kekule-widget');
    this.el.classList.add('jupyter-widgets');

    this.displayed.then(() => {
      this.kekule_obj = new Kekule.ChemWidget.Viewer(this.el);

      this.kekule_obj.addEventListener('editingDone', this.on_editing_done.bind(this));

      this.set_enable_toolbar();
      this.set_enable_direct_interaction();
      this.set_enable_edit();
      this.set_tool_buttons();
      this.set_resizable();

      this.load_kekule_obj();
    });
  }
}


export class KekuleComposerModel extends KekuleModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: 'KekuleComposerModel',
      _view_name: 'KekuleComposerView',
    };
  }
}

export class KekuleComposerView extends KekuleView {
  initialize(parameters: any): void {
    super.initialize(parameters);
  }

  render() {
    super.render();

    this.displayed.then(() => {
      this.kekule_obj = new Kekule.Editor.Composer(this.el);
      this.kekule_obj.setPredefinedSetting('fullFunc');

      //this.kekule_obj.addEventListener('editObjsChanged', () => this.sendObject(null));

      this.load_kekule_obj();
    });
  }
}

