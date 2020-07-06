(in-package :kekule)


(defparameter +smiles-format+ "smi")
(defparameter +kekule-json-format+ "Kekule-JSON")
(defparameter +kekule-xml-format+ "Kekule-XML")
(defparameter +mdl-mol-2000-format+ "mol")
(defparameter +mdl-mol-3000-format+ "mol3k")
(defparameter +mdl-structure-data-format+ "sd")
(defparameter +mdl-reaction-2000-format+ "rxn")
(defparameter +mdl-reaction-3000-format+ "rxn3k")


(defclass chem-widget (jupyter-widgets:dom-widget)
  ((data
     :accessor data
     :initarg :data
     :initform "Untitled Document"
     :trait :json)
   (format-id
     :accessor format-id
     :initarg :format-id
     :initform +mdl-reaction-2000-format+
     :trait :unicode))
  (:metaclass jupyter-widgets:trait-metaclass)
  (:default-initargs
    :%model-module +module-name+
    :%model-module-version +module-version+
    :%view-module +module-name+
    :%view-module-version +module-version+))


(defclass diagram (chem-widget)
  ((enable-toolbar
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
    :%view-name "KekuleDiagramView"))

(jupyter-widgets:register-widget diagram)


(defclass composer (chem-widget)
  ()
  (:metaclass jupyter-widgets:trait-metaclass)
  (:documentation "")
  (:default-initargs
    :%model-name "KekuleComposerModel"
    :%view-name "KekuleComposerView"))

(jupyter-widgets:register-widget composer)


(defun load-data (instance data format-id)
  (jupyter-widgets:send-custom instance
                               (jupyter:json-new-obj
                                 ("do" "load_data")
                                 ("data" data)
                                 ("format_id" format-id))))


(defun load-file (instance path)
  (jupyter-widgets:send-custom instance
                               (jupyter:json-new-obj
                                 ("do" "load_file")
                                 ("file" file))))


(defun load-url (instance url)
  (jupyter-widgets:send-custom instance
                               (jupyter:json-new-obj
                                 ("do" "load_url")
                                 ("url" url))))
  
