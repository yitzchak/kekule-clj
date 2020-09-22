# kekule-clj

A [common-lisp-jupyter][] widget for [kekule.js][].

## Installation

The Jupyter Lab frontend code should be installed using the following command:

```
jupyter-labextension install kekule-clj
```

Once the extension has been installed then widget can be loaded in a notebook
using Quicklisp.

```lisp
(ql:quickload :kekule-clj)
```

## Usage

For sample notebooks please see the examples directory. There are two main 
widgets exported by kekule-clj. The `diagram` widget displays a molecular 
diagram using a data source and format id. The `composer` widget allows editing 
of the attached data. Both share a set of common slots `data` and `format-id`.

The accepted formats are:
- Smiles format via `+smiles-format+` or `"smi"` 
- Kekule native JSON format via `+kekule-json-format+` or `"Kekule-JSON"`
- Kekule specific XML format via `+kekule-xml-format+` or `"Kekule-XML"`
- MDL Molfile V2000 format via `+mdl-mol-2000-format+` or `"mol"`
- MDL Molfile V3000 format via `+mdl-mol-3000-format+` or `"mol3k"`
- MDL Structure Data format via `+mdl-structure-data-format+` or `"sd"`
- MDL Reaction V2000 format via `+mdl-reaction-2000-format+` or `"rxn"`
- MDL Reaction V3000 format via `+mdl-reaction-3000-format+` or `"rxn3k"`

The default format is MDL Molfile V2000 hence the following will display a
file in the diagram widget and display a toolbar in addition.

```lisp
(make-instance 'kekule:diagram 
               :enable-toolbar t
               :data (alexandria:read-file-into-string "chemFiles/2D/aromaticRings.mol"))
```

More options are available on the various widgets and can be seen in the source
code.

[common-lisp-jupyter]: https://yitzchak.github.io/common-lisp-jupyter/ 
[kekule.js]: https://partridgejiang.github.io/Kekule.js/
