export function isAttrRemovalValue(value) {
  return value === null || value === undefined;
}

function UNDEFINED() {}

// TODO should this be an o_create kind of thing?
export var propertyCaches = {};

export function normalizeProperty(element, attrName) {
  var tagName = element.tagName;
  var key, cachedAttrName;
  var cache = propertyCaches[tagName];
  if (!cache) {
    // TODO should this be an o_create kind of thing?
    cache = {};
    for (cachedAttrName in element) {
      key = cachedAttrName.toLowerCase();
      if (isSettable(element, cachedAttrName)) {
        cache[key] = cachedAttrName;
      } else {
        cache[key] = UNDEFINED;
      }
    }
    propertyCaches[tagName] = cache;
  }

  // presumes that the attrName has been lowercased.
  var value = cache[attrName];
  return value === UNDEFINED ? undefined : value;
}

// elements with a property that does not conform to the spec in certain
// browsers. In these cases, we'll end up using setAttribute instead
var badPairs = [{
  // phantomjs < 2.0 lets you set it as a prop but won't reflect it
  // back to the attribute. button.getAttribute('type') === null
  tagName: 'BUTTON',
  propName: 'type'
}, {
  // Some version of IE (like IE9) actually throw an exception
  // if you set input.type = 'something-unknown'
  tagName: 'INPUT',
  propName: 'type'
}, {
  // Some versions of IE (IE8) throw an exception when setting
  // `input.list = 'somestring'`:
  // https://github.com/emberjs/ember.js/issues/10908
  // https://github.com/emberjs/ember.js/issues/11364
  tagName: 'INPUT',
  propName: 'list'
}];

function isSettable(element, attrName) {
  for (let i = 0, l = badPairs.length; i < l; i++) {
    let pair = badPairs[i];
    if (pair.tagName === element.tagName && pair.propName === attrName) {
      return false;
    }
  }

  return true;
}
