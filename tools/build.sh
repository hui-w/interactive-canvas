#!/bin/sh

YUI="./yuicompressor-2.4.8.jar"
SRC="../src"
OUT="../release"

echo "Deleting old content of output..."
rm -rf $OUT
mkdir $OUT

echo "Combining JS files..."
cat \
$SRC/util/class.js \
$SRC/util/polyfill.js \
$SRC/util/event-handler.js \
$SRC/util/list.js \
$SRC/component.js \
$SRC/panel.js \
$SRC/label.js \
$SRC/button.js \
$SRC/canvas.js \
> $OUT/temp.combined.js

echo "Compressing JS files..."
java -jar "$YUI" \
--type js \
-o $OUT/temp.minified.js \
$OUT/temp.combined.js

echo "Adding the version header..."
cat \
./version.js \
$OUT/temp.minified.js \
> $OUT/interactive-canvas-0.1.1.min.js

echo "Deleting temporary files..."
rm -f $OUT/temp.combined.js
rm -f $OUT/temp.minified.js

echo "Done!"