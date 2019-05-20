
// so what builder needs is the data parsed as js, does it, so it can require it
var yaml = require('js-yaml');
var fs   = require('fs');
var _ = require('lodash');


// Get frameworkdata
var FD;

var loggedErrors = [];

try {
  FD = yaml.safeLoad(fs.readFileSync('./src/fd.yml', 'utf8'));
  var story = yaml.safeLoad(fs.readFileSync('./src/story.yml', 'utf8'));
} catch (e) {
  console.log(e);
}

_.forOwn(story, function(value, key) {

  // iterate layuots
  var layouts = value;
  _.forOwn(layouts, function(layout, key) {

    // check if layout exists
    var _FDLayoutType = _.upperCase(layout.layoutType);
    var _FDLayout = _.get(FD, 'LAYOUTS[' + _FDLayoutType + ']', undefined);

    if (!_FDLayout) {
      logError( _FDLayout + ' is not a valid layout. Position: ...' );
    } else {
      var layoutData =  _.get(layout, 'layoutData', undefined);
      var _FDLayoutData = _FDLayout.DATA;

      _.forOwn(_FDLayoutData, function(prop, key) {
         // is type correct?
        if (typeof layoutData[key] !== _FDLayoutData[key].DATA_TYPEOF && layoutData[key] !== undefined) {
          logError('In ' + _FDLayoutType + ' ' + key + ' should be ' + _FDLayout.DATA[key].DATA_TYPEOF + ' and not ' + typeof layout.layoutData[key]);
        }
        // check values for the property
        if (_.get(_FDLayout.DATA[key], 'DATA_VALUES', undefined)) {

          // manager values differently depending on TYPEOF
          switch (_FDLayoutData[key].DATA_TYPEOF) {
            case 'string':
              if (!_.includes(_FDLayoutData[key].DATA_VALUES, layoutData[key]) || _.includes(_FDLayoutData[key].DATA_VALUES, undefined)) {
                logError(key + ' should be one of those: ' + _FDLayoutData[key].DATA_VALUES);
              }
              break;
            case 'boolean':
              break;
            case 'objectsArray':
              // check if the structure of the object matches the one in the json file
              // compare keys
              var _propertyKeys = _.keys(_FDLayoutData[key].DATA_VALUES);
              var propertyKeys = _.keys(layoutData[key][0]);
              if (_.isEqual(propertyKeys, _propertyKeys)) {

              }
              break;
            default:
              break;
          }
        }

      });
    }
  });
});

function checkIfModuleExists(moduleType) {
  if (FD.LAYOUTS[ moduleType ]) {
    return true;
  } else {
    return false;
  }
}


function logError(msg) {
  console.log(msg);
  loggedErrors.push(msg);
  return;
}
