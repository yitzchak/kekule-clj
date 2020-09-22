(asdf:defsystem #:kekule-clj
  :description "A Kekule widget for Common Lisp Jupyter"
  :version "0.4.0"
  :author "Tarn W. Burton"
  :license "MIT"
  :depends-on
    (:common-lisp-jupyter
     :jsown)
  :components
    ((:module src
      :serial t
      :components
        ((:file "packages")
         (:file "version")
         (:file "widget")))))
