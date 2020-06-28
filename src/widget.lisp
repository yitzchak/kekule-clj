(in-package :kekule)

(defclass diagram (jupyter-widgets:styled-widget)
  ((object
     :accessor object
     :initarg :object
     :initform ""
     :trait :unicode)
   (format
     :accessor %format
     :initarg :format
     :initform "mol"
     :trait :unicode)
   (enable-toolbar
     :accessor enable-toolbar
     :initarg :enable-toolbar
     :initform nil
     :trait :bool)
   (enable-direct-interaction
     :accessor enable-direct-interaction
     :initarg :enable-direct-interaction
     :initform t
     :trait :bool)
   (enable-edit
     :accessor enable-edit
     :initarg :enable-edit
     :initform t
     :trait :bool)
   (tool-buttons
     :accessor tool-buttons
     :initarg :tool-buttons
     :initform (list "loadData" "saveData" "molDisplayType" "molHideHydrogens" "zoomIn" "zoomOut"
                     "rotateLeft" "rotateRight" "rotateX" "rotateY" "rotateZ" "reset" "openEditor"
                     "config"))
   (resizable
     :accessor resizable
     :initarg :resizable
     :initform nil
     :trait :bool))
  (:metaclass jupyter-widgets:trait-metaclass)
  (:documentation "")
  (:default-initargs
    :%model-name "KekuleDiagramModel"
    :%model-module +module-name+
    :%model-module-version +module-version+
    :%view-name "KekuleDiagramView"
    :%view-module +module-name+
    :%view-module-version +module-version+))

(jupyter-widgets:register-widget diagram)


(defclass composer (jupyter-widgets:styled-widget)
  ((object
     :accessor object
     :initarg :object
     :initform ""
     :trait :unicode)
   (format
     :accessor %format
     :initarg :format
     :initform "mol"
     :trait :unicode))
  (:metaclass jupyter-widgets:trait-metaclass)
  (:documentation "")
  (:default-initargs
    :%model-name "KekuleComposerModel"
    :%model-module +module-name+
    :%model-module-version +module-version+
    :%view-name "KekuleComposerView"
    :%view-module +module-name+
    :%view-module-version +module-version+))

(jupyter-widgets:register-widget composer)

