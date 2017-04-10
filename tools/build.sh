#!/bin/sh

YUI="./yuicompressor-2.4.8.jar"
SRC="../src"
OUT="../output"

echo "Deleting old content of output..."
rm -rf $OUT
mkdir $OUT

echo "Combining JS files..."
cat \
$SRC/util/polyfill.js \
$SRC/util/class.js \
$SRC/util/list.js \
$SRC/component.js \
$SRC/panel.js \
$SRC/button.js \
$SRC/canvas.js \
$SRC/label.js \
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
> $OUT/canvas-ui-0.0.0.min.js

echo "Deleting temporary files..."
rm -f $OUT/temp.combined.js
rm -f $OUT/temp.minified.js

echo "Done!"