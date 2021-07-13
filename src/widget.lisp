(in-package :kekule)


(defparameter +smiles-format+ "smi"
  "Simplified molecular-input line-entry system format tag")
(defparameter +kekule-json-format+ "Kekule-JSON"
  "Kekule native JSON format tag")
(defparameter +kekule-xml-format+ "Kekule-XML"
  "Kekule specific XML format tag")
(defparameter +mdl-mol-2000-format+ "mol"
  "MDL Molfile V2000 format tag")
(defparameter +mdl-mol-3000-format+ "mol3k"
  "MDL Molfile V3000 format tag")
(defparameter +mdl-structure-data-format+ "sd"
  "MDL Structure Data format tag")
(defparameter +mdl-reaction-2000-format+ "rxn"
  "MDL Reaction V2000 format tag")
(defparameter +mdl-reaction-3000-format+ "rxn3k"
  "MDL Reaction V3000 format tag")


(jupyter/widgets:defwidget chem-widget (jupyter/widgets:dom-widget)
  ((data
     :accessor data
     :initarg :data
     :initform "Untitled Document"
     :trait :json
     :documentation "Data to be displayed by the widget.")
   (format-id
     :accessor format-id
     :initarg :format-id
     :initform +mdl-reaction-2000-format+
     :type string
     :trait :unicode
     :documentation "Format tag of data. Current allowed values are smi, Kekule-JSON, Kekuule-XML, mol, mol3k, sd, rxn and rxn3k."))
  (:documentation "Base widget used by the diagram and composer widgets.")
  (:default-initargs
    :%model-module +module-name+
    :%model-module-version +module-version+
    :%view-module +module-name+
    :%view-module-version +module-version+
    :layout (make-instance 'jupyter/widgets:layout :width "100%" :height "480px")))


(jupyter/widgets:defwidget diagram (chem-widget)
  ((enable-toolbar
     :accessor enable-toolbar
     :initarg :enable-toolbar
     :initform nil
     :type boolean
     :trait :bool
     :documentation "Whether to show the toolbar or not.")
   (enable-direct-interaction
     :accessor enable-direct-interaction
     :initarg :enable-direct-interaction
     :initform t
     :type boolean
     :trait :bool
     :documentation "Whether to allow interaction with the molecule or not.")
   (enable-edit
     :accessor enable-edit
     :initarg :enable-edit
     :initform t
     :type boolean
     :trait :bool
     :documentation "Whether to allow a popup editor to be shown or not.")
   (tool-buttons
     :accessor tool-buttons
     :initarg :tool-buttons
     :type list
     :initform (list "loadData" "saveData" "molDisplayType" "molHideHydrogens" "zoomIn" "zoomOut"
                     "rotateLeft" "rotateRight" "rotateX" "rotateY" "rotateZ" "reset" "openEditor"
                     "config")
     :trait :list
     :documentation "A list of the names of buttons to show in the toolbar.")
   (resizable
     :accessor resizable
     :initarg :resizable
     :initform nil
     :type boolean
     :trait :bool
     :documentation "Whether the diagram is resizable or not."))
  (:documentation "A widget that displays molecular data.")
  (:default-initargs
    :%model-name "KekuleDiagramModel"
    :%view-name "KekuleDiagramView"))


(jupyter/widgets:defwidget composer (chem-widget)
  ()
  (:documentation "A widget that edits molecular data.")
  (:default-initargs
    :%model-name "KekuleComposerModel"
    :%view-name "KekuleComposerView"))


(defun fit (instance)
  "Fit view to current structures."
  (jupyter/widgets:send-custom instance
                               `(:object-plist
                                 "do" "fit")))


(defun load-data (instance data format-id)
  "Load molecular data into an existing widget."
  (jupyter/widgets:send-custom instance
                               `(:object-plist
                                 "do" "load_data"
                                 "data" ,data
                                 "format_id" ,format-id)))


(defun load-file (instance path)
  "Load molecular data from a file into an existing widget."
  (jupyter/widgets:send-custom instance
                               `(:object-plist
                                 "do" "load_file"
                                 "file" ,file)))


(defun load-url (instance url)
  "Load molecular data from a url into an existing widget."
  (jupyter/widgets:send-custom instance
                               `(:object-plist
                                 "do" "load_url"
                                 "url" ,url)))
  
