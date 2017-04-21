#!/bin/sh

YUI="./yuicompressor-2.4.8.jar"
SRC="../src"
OUT="../output"

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
> $OUT/canvas-ui-0.1.1.min.js

echo "Deleting temporary files..."
rm -f $OUT/temp.combined.js
rm -f $OUT/temp.minified.js

echo "Preparing files for web site..."
mkdir $OUT/pages
cp $OUT/canvas-ui-0.1.1.min.js $OUT/pages/canvas-ui-0.1.1.min.js
cp ../pages/demo.js $OUT/pages/demo.js
cp ../pages/index_release.html $OUT/pages/index.html
cp ../pages/overview.png $OUT/pages/overview.png
cp ../pages/palette.js $OUT/pages/palette.js
cp ../pages/reference.html $OUT/pages/reference.html
cp ../pages/responsive-app.js $OUT/pages/responsive-app.js
cp ../pages/responsive_release.html $OUT/pages/responsive.html
cp ../pages/web.css $OUT/pages/web.css

echo "Done!"