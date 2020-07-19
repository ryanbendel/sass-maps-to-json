# Convert Sass Colour Maps to Json for Fractal [![NPM version][npm-image]][npm-url]

This library will convert a SASS/SCSS color map into a JSON file for the sole purpose of being used for a Fractal styleguide.

The format of the color map can only include HEX values, lighten/darken, and references to other variables are not supported.

## Install

```
$ npm install --save sass-maps-to-json -D
```

This script can be used as part of a gulp task, or standalone as a script you run from the command line.


### Parameters

| Name             | Type               | Description   |
| ---------------- | ------------------ | ------------- |
| src              | `string`           | A string containing a path to the input file.
| dest             | `string`           | JSON file destination |  

---

#### Usage - Option 1 - Gulp task


Example (as a gulp task):

```js
var gulp = require('gulp');
var sassMapToJson = require('sass-maps-to-json');
gulp.task('sassToJson', function() {
   var settings = {
      "src": "sass/settings/_colors.scss",
      "dest": "colors.config.json"
    };
   sassMapToJson(settings);
});  
```
#### Usage - Option 2 - NPM task

Create a js file in your project (convertsass.js in this example)
```js
var sassMapToJson = require('sass-maps-to-json');
   var settings = {
      "src": "sass/settings/_colors.scss",
      "dest": "colors.config.json"
};  
sassMapToJson(settings);
```

Then in your package.json file create a script that will execute this:
```json
  "scripts": {
    "convert-sass": "node convertsass.js"
  },
```

##### Input:
```scss
$palette: (
    red: (
        light: #fff2f1,
        mid: #ff7369,
        dark: #c90d00
    ),
    blue: (
        lightest: #5e7298,
        light: #404d69
    ),
    black: #000,
    white: #fff,
    grey: #333
)!default;
```
##### Output:
```json
{
  "context": {
    "colors": {
      "Red": {
        "swatches": [
          {
            "name": "light",
            "groupcollated": "(red, light)",
            "hex": "#fff2f1"
          },
          {
            "name": "mid",
            "groupcollated": "(red, mid)",
            "hex": "#ff7369"
          },
          {
            "name": "dark",
            "groupcollated": "(red, dark)",
            "hex": "#c90d00"
          }
        ]
      },
      "Blue": {
        "swatches": [
          {
            "name": "lightest",
            "groupcollated": "(blue, lightest)",
            "hex": "#5e7298"
          },
          {
            "name": "light",
            "groupcollated": "(blue, light)",
            "hex": "#404d69"
          }
        ]
      },
      "Other": {
        "swatches": [
          {
            "name": "black",
            "hex": "#000"
          },
          {
            "name": "white",
            "hex": "#fff"
          },
          {
            "name": "grey",
            "hex": "#333"
          }
        ]
      }
    }
  }
}
```
### Fractal Usage

The drive for this script was to create as much of a "live" styleguide as possible, and we use [Fractal][fractal-url] to generate a static site in our build process from our up to date sass files.
Fractal uses `handlebars.js` as a template engine.

I have included an example in the `fractal_examples` directory of this project which should help get you up and running. The file will output a section with named title for each group containing the colour name, and hex value

## Changelog
 **v1.1.0 - 08-Aug-2018** 
 - Updated output. Swatch now outputs `name` and `groupcollated` as well as the hex value
 
 **v1.0.1 - 07-Aug-2018** 
 - Docs update
 
 **v1.0.0 - 06-Aug-2018** 
 - initial release


[npm-url]: https://www.npmjs.com/package/sass-maps-to-json
[npm-image]: https://img.shields.io/npm/v/sass-maps-to-json.svg
[fractal-url]: https://fractal.build
