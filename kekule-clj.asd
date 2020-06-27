(asdf:defsystem #:kekule-clj
  :description "A Kekule widget for Common Lisp Jupyter"
  :version "0.1.1"
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
         (:file "diagram")))))
