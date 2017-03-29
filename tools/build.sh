#!/bin/sh

YUI="./yuicompressor-2.4.8.jar"
SRC="../src"
OUT="../output"

echo "Deleting old content of output..."
rm -rf $OUT
mkdir $OUT

echo "Combining JS files..."
cat \
$SRC/polyfill.js \
$SRC/component.js \
$SRC/button.js \
$SRC/label.js \
$SRC/panel.js \
$SRC/canvas_app.js \
> $OUT/temp.output.js

echo "Compressing JS files..."
java -jar "$YUI" \
--type js \
-o $OUT/canvas-ui.min.js \
$OUT/temp.output.js

echo "Deleting temporary files..."
rm -f $OUT/temp.output.js

echo "Done!"
# find . -iname "*.js" -exec cat "{}" \; > singlefile.js