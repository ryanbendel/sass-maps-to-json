import lodash from 'lodash';
import fs from 'fs';
import chalk from 'chalk';
import jsonfile from 'jsonfile';

export default convertFile

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
        let swatch;
        if (lodash.includes(item, '(')) {
            level = level + 2;
            colorsGroupTempName = item[0];
            colorsGroupTemp[capitalizeFirstLetter(colorsGroupTempName)] = {
                swatches: []
            };
        } else if (lodash.includes(item, ')')) {
            level = level - 2;
            colorsGroup = lodash.merge(colorsGroup, colorsGroupTemp);
        } else {
            if (level === 0) {
                swatch = {
                    name: item[0],
                    hex: item[1]
                };
                otherGroup["Other"].swatches.push(swatch);
                colorsGroup = lodash.merge(colorsGroup, otherGroup);
            } else if (level > 0) {
                colorsGroupTemp[capitalizeFirstLetter(colorsGroupTempName)].swatches.push({
                    name: item[0],
                    groupcollated: '(' + colorsGroupTempName + ', ' + item[0] + ')',
                    hex: item[1]
                });
            }
        }
    });
    return colorsGroup;
}


function readCss(settings) {
    let newArray;
    // split at new lines, and then filter out lines that start with $ (i.e. map name)
    var data = lodash.filter(fs.readFileSync(settings.src, 'utf8').split('\n'), item => !lodash.startsWith(item, '$'));
    // filter out any comments in the map, trimming leading whitespace
    data = lodash.filter(data, item => !lodash.startsWith(lodash.trimStart(item), '/'));
    newArray = [];
    let map = lodash.map(data, (item) => {
        let x = lodash.split(item, ':');

        filterData(x);
        newArray.push(x);
    });
    newArray = lodash.filter(newArray, function (sub) {
        return sub.length;
    });
    return newArray
}

function filterData(x) {
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
            console.log(chalk.red(err));
            console.log(chalk.red("Please refer to docs and ensure source is formatted correctly and paths are correct"));
        } else {
            console.log(chalk.green("Success! - json outputted!"));
        }
    })
}
