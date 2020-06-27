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
     :trait :unicode))
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

