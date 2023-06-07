(asdf:defsystem #:kekule-clj
  :description "A Kekule widget for Common Lisp Jupyter"
  :version "0.4.0"
  :author "Tarn W. Burton"
  :license "MIT"
  :defsystem-depends-on (#:jupyter-lab-extension)
  :depends-on (#:common-lisp-jupyter)
  :components ((:jupyter-lab-extension kekule-clj
                :pathname "prebuilt/")
               (:module src
                :serial t
                :components ((:file "packages")
                             (:file "version")
                             (:file "widget")
                             (:file "register-widgets")))))
