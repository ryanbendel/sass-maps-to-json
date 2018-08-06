var
    _ = require('lodash'),
    fs = require('fs'),
    chalk = require('chalk'),
    jsonfile = require('jsonfile');

module.exports = convertFile;

function convertFile(settings) {
    var values = readCss(settings);
    values = filterValues(values);
    toJson(settings, values);
}

function filterValues(values) {
    var colorsGroup = {};
    var colorsGroupTempName;
    var colorsGroupTemp = {};
    var otherGroup = {
        "Other": {
            swatches: []
        }
    };

    var level = 0;
    values.forEach(function (item) {
        if (_.includes(item, '(')) {
            level = level + 2;
            colorsGroupTempName = item[0];
            colorsGroupTemp[capitalizeFirstLetter(colorsGroupTempName)] = {
                swatches: []
            };
        } else if (_.includes(item, ')')) {
            level = level - 2;
            colorsGroup = _.merge(colorsGroup, colorsGroupTemp);
        } else {
            if (level === 0) {
                swatch = {
                    name: item[0],
                    hex: item[1]
                };
                otherGroup["Other"].swatches.push(swatch);
                colorsGroup = _.merge(colorsGroup, otherGroup);
            } else if (level > 0) {
                colorsGroupTemp[capitalizeFirstLetter(colorsGroupTempName)].swatches.push({
                    name: '(' + colorsGroupTempName + ', ' + item[0] + ')',
                    hex: item[1]
                });
            }
        }
    });
    return colorsGroup;
}


function readCss(settings) {
    // split at new lines, and then filter out lines that start with $ (i.e. map name)
    var data = _.filter(fs.readFileSync(settings.src, 'utf8').split('\n'), item => !_.startsWith(item, '$'));
    // filter out any comments in the map, trimming leading whitespace
    data = _.filter(data, item => !_.startsWith(_.trimStart(item), '/'));
    newArray = [];
    let map = _.map(data, (item) => {
        let x = _.split(item, ':');

        filterData(x);
        newArray.push(x);
    });
    newArray = _.filter(newArray, function (sub) {
        return sub.length;
    });
    return newArray
}

function filterData(x) {
    filterArray = [];
    for (var i = 0; i < x.length; i++) {
        x[i] = x[i].replace(/default/, '').replace(/!/, '').replace(/\s/g, '').replace(/,/g, '').replace(/;/g, '').trim();
    }
    removeA(x, '');
}

function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function toJson(settings, values) {
    var contents = {
        "context": {
            colors: values
        }
    };
    jsonfile.writeFile(settings.dest, contents, {spaces: 2, EOL: '\r\n'}, function (err) {
        if (err) {
            console.log(chalk.red("ERROR - please refer to docs and ensure source is formatted correctly"));
        } else {
            console.log(chalk.green("Success! - json outputted!"));
        }
    })
}