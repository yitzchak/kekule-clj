import {
  DOMWidgetModel,
  DOMWidgetView,
} from '@jupyter-widgets/base';

import { MODULE_NAME, MODULE_VERSION } from './version';

// Import the CSS
import '../css/widget.css';

// @ts-ignore
import { Kekule } from 'kekule';

// @ts-ignore
String.prototype.toJSON = undefined; // Undo the lunacy of the Kekule polyfill.

Kekule.Atom.prototype.defineProp('annotation', {
  'dataType': 'string',
  'serializable': true
});

Kekule.Molecule.prototype.defineProp('annotation', {
  'dataType': 'string',
  'serializable': true
});

Kekule.Editor.Composer.prototype.getZoomButtonNames = function() {
  return [
    Kekule.ChemWidget.ComponentWidgetNames.zoomIn,
    Kekule.ChemWidget.ComponentWidgetNames.zoomOut,
    Kekule.ChemWidget.ComponentWidgetNames.reset,
    Kekule.ChemWidget.ComponentWidgetNames.resetZoom,
    "fit"
  ];
}


class KekuleModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      data: null,
      format_id: "mol",
      _model_module: MODULE_NAME,
      _model_module_version: MODULE_VERSION,
      _view_module: MODULE_NAME,
      _view_module_version: MODULE_VERSION,
    };
  }
}


export class KekuleView extends DOMWidgetView {
  kekule_obj: any;
  kekule_container: any;
  in_sendData: boolean = false;

  initialize(parameters: any): void {
    super.initialize(parameters);

    this.model.on('msg:custom', this.handle_custom_message.bind(this));

    this.model.on('change:data', this.loadData.bind(this), this);
    this.model.on('change:format_id', () => this.sendData(null), this);
  }

  handle_custom_message(content: any): void {
    if (this.kekule_obj) {
      switch (content.do) {
        case 'fit':
          this.fit();
          break;
        case 'load_data':
          this.loadFromData(content.data, content.format_id);
          break;
        case 'load_file':
          Kekule.IO.loadFileData(content.file);
          break;
        case 'load_url':
          Kekule.IO.loadUrlData(content.url);
          break;
      }
    }
  }

  fit(): void {}

  loadFromData(data: any, format_id: string): void {
    let obj = null;

    if (data) {
      obj = Kekule.IO.loadFormatData((format_id === 'Kekule-JSON' && typeof data !== 'string') ? JSON.stringify(data) : data, format_id);
    }

    this.kekule_obj.setChemObj(obj ? obj : null);
  }

  loadData(): void {
    if (this.kekule_obj && !this.in_sendData) {
      this.loadFromData(this.model.get('data'), this.model.get('format_id'));
    }
  }

  sendData(obj: any): void {
    try { // This might fail if there are dangling bonds.
      if (!obj) obj = this.kekule_obj.getChemObj();
      let format_id = this.model.get('format_id');
	    let writer = Kekule.IO.ChemDataWriterManager.getWriterByFormat(format_id, null, obj);
	    if (writer) {
        this.in_sendData = true;
		    let result = writer.writeData(obj,
		                                  (format_id === 'Kekule-JSON') ? Kekule.IO.ChemDataType.JSON : Kekule.IO.ChemDataType.TEXT,
		                                  format_id);
        this.model.set('data', result);
        this.model.save_changes();
        this.in_sendData = false;
      }
    } catch (e) {}
  }

  on_editing_done(event: any): void {
    this.sendData(event.obj);
  }

  render() {
    super.render();

    this.el.classList.add('kekule-widget');

    this.kekule_container = document.createElement('div');
    this.kekule_container.classList.add('kekule-widget');
    this.el.appendChild(this.kekule_container);
  }

  resize(): void {
    let width: number = this.el.clientWidth - this.kekule_container.style.paddingLeft - this.kekule_container.style.paddingRight
        - this.kekule_container.style.borderLeft - this.kekule_container.style.borderRight
        - this.kekule_container.style.marginLeft - this.kekule_container.style.marginRight;
    let height: number = this.el.clientHeight - this.kekule_container.style.paddingTop - this.kekule_container.style.paddingBottom
        - this.kekule_container.style.borderTop - this.kekule_container.style.borderBottom
        - this.kekule_container.style.marginTop - this.kekule_container.style.marginBottom;
    this.kekule_obj.setDimension(width, height);
  }

  load_kekule_obj(): void {
    this.resize();
    this.loadData();
  }

  processPhosphorMessage(msg: any): void {
    super.processPhosphorMessage(msg);
    if ((msg.type === 'resize' || msg.type === 'after-show') && this.kekule_obj) {
      this.resize();
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

    this.displayed.then(() => {
      this.kekule_obj = new Kekule.ChemWidget.Viewer(this.kekule_container);

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
  timeout: any = null;

  initialize(parameters: any): void {
    super.initialize(parameters);
  }

  fit(): void {
    var chemEditor = this.kekule_obj.getEditor();
    var objBox = chemEditor.getObjectsContainerBox(chemEditor.getChemSpace().getChildren());
    var visualBox = chemEditor.getVisibleClientScreenBox();
    if (objBox && visualBox) {
      var sx = (visualBox.x2 - visualBox.x1) / (objBox.x2 - objBox.x1);
      var sy = (visualBox.y2 - visualBox.y1) / (objBox.y2 - objBox.y1);
      chemEditor.setZoom(Math.max(chemEditor.getCurrZoom() * Math.min(sx, sy) - .25, 1));
      chemEditor.scrollClientToObject(chemEditor.getChemSpace().getChildren());
    }
  }

  render() {
    super.render();

    this.displayed.then(() => {
      this.kekule_obj = new Kekule.Editor.Composer(this.kekule_container);
      this.kekule_obj.setPredefinedSetting('fullFunc');
      this.kekule_obj.setCommonToolButtons([
	Kekule.ChemWidget.ComponentWidgetNames.newDoc,
	Kekule.ChemWidget.ComponentWidgetNames.loadData,
	Kekule.ChemWidget.ComponentWidgetNames.saveData,
	Kekule.ChemWidget.ComponentWidgetNames.undo,
	Kekule.ChemWidget.ComponentWidgetNames.redo,
	Kekule.ChemWidget.ComponentWidgetNames.copy,
	Kekule.ChemWidget.ComponentWidgetNames.cut,
	Kekule.ChemWidget.ComponentWidgetNames.paste,
	Kekule.ChemWidget.ComponentWidgetNames.zoomIn,
	Kekule.ChemWidget.ComponentWidgetNames.zoomOut,
	{
          "name": "fit",
          "htmlClass": 'K-Chem-ResetZoom',
          "#execute": this.fit.bind(this),
	  "hint": "Fit"
	},
	Kekule.ChemWidget.ComponentWidgetNames.config,
	Kekule.ChemWidget.ComponentWidgetNames.objInspector
      ]);

      this.kekule_obj.addEventListener('editObjsChanged', () => {
        if (!this.timeout) {
          this.timeout = setTimeout(() => {
            this.sendData(null);
            this.timeout = null;
          }, 1000);
        }
        return true;
      }, this);

      this.load_kekule_obj();
    });
  }
}

