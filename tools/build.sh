#!/bin/sh

YUI="./yuicompressor-2.4.8.jar"
FILE_NAME="interactive-canvas-0.1.1.min.js"
SRC_DIR="../src"
OUT_DIR="../release"
DOC_DIR="../docs"

echo "Deleting old content of output..."
rm -rf $OUT_DIR
mkdir $OUT_DIR

echo "Combining JS files..."
cat \
$SRC_DIR/util/class.js \
$SRC_DIR/util/polyfill.js \
$SRC_DIR/util/event-handler.js \
$SRC_DIR/util/list.js \
$SRC_DIR/component.js \
$SRC_DIR/panel.js \
$SRC_DIR/label.js \
$SRC_DIR/button.js \
$SRC_DIR/canvas.js \
> $OUT_DIR/temp.combined.js

echo "Compressing JS files..."
java -jar "$YUI" \
--type js \
-o $OUT_DIR/temp.minified.js \
$OUT_DIR/temp.combined.js

echo "Adding the version header..."
cat \
./version.js \
$OUT_DIR/temp.minified.js \
> $OUT_DIR/$FILE_NAME

echo "Deleting temporary files..."
rm -f $OUT_DIR/temp.combined.js
rm -f $OUT_DIR/temp.minified.js

echo "Preparing docs..."
cp $OUT_DIR/$FILE_NAME $DOC_DIR/$FILE_NAME

echo "Done!"