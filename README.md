# JavaScript Table of Contents Generator

This is the repo for a simple vanilla JavaScript table of contents generator. It parses through a document looking for headers and then builds a table of contents by either using existing IDs or creating them.

![Example TOC Output](https://raw.githubusercontent.com/vincentlaucsb/js-toc/master/example.png)

## Directory Layout
 Folder | Files
 --- | ---
 dist/ | Compiled JavaScript, ready to use
 src/ | Original TypeScript files

## Usage

```
<head>
  <script src="toc.js" type="text/javascript"></script>
  <script>
      window.addEventListener("load", function (event) {
          makeList({
              'target': '#toc',   // Selector for element to place table of contents
              'parent': 'article' // Selector for element to parse headers from (default: 'body')
          });
      });
  </script>
</head>
```
