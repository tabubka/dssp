var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (callback, module2) => () => {
  if (!module2) {
    module2 = {exports: {}};
    callback(module2.exports, module2);
  }
  return module2.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// node_modules/source-map/lib/base64.js
var require_base64 = __commonJS((exports2) => {
  var intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
  exports2.encode = function(number) {
    if (0 <= number && number < intToCharMap.length) {
      return intToCharMap[number];
    }
    throw new TypeError("Must be between 0 and 63: " + number);
  };
  exports2.decode = function(charCode) {
    var bigA = 65;
    var bigZ = 90;
    var littleA = 97;
    var littleZ = 122;
    var zero = 48;
    var nine = 57;
    var plus = 43;
    var slash = 47;
    var littleOffset = 26;
    var numberOffset = 52;
    if (bigA <= charCode && charCode <= bigZ) {
      return charCode - bigA;
    }
    if (littleA <= charCode && charCode <= littleZ) {
      return charCode - littleA + littleOffset;
    }
    if (zero <= charCode && charCode <= nine) {
      return charCode - zero + numberOffset;
    }
    if (charCode == plus) {
      return 62;
    }
    if (charCode == slash) {
      return 63;
    }
    return -1;
  };
});

// node_modules/source-map/lib/base64-vlq.js
var require_base64_vlq = __commonJS((exports2) => {
  var base64 = require_base64();
  var VLQ_BASE_SHIFT = 5;
  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
  var VLQ_BASE_MASK = VLQ_BASE - 1;
  var VLQ_CONTINUATION_BIT = VLQ_BASE;
  function toVLQSigned(aValue) {
    return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
  }
  function fromVLQSigned(aValue) {
    var isNegative = (aValue & 1) === 1;
    var shifted = aValue >> 1;
    return isNegative ? -shifted : shifted;
  }
  exports2.encode = function base64VLQ_encode(aValue) {
    var encoded = "";
    var digit;
    var vlq = toVLQSigned(aValue);
    do {
      digit = vlq & VLQ_BASE_MASK;
      vlq >>>= VLQ_BASE_SHIFT;
      if (vlq > 0) {
        digit |= VLQ_CONTINUATION_BIT;
      }
      encoded += base64.encode(digit);
    } while (vlq > 0);
    return encoded;
  };
  exports2.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
    var strLen = aStr.length;
    var result = 0;
    var shift = 0;
    var continuation, digit;
    do {
      if (aIndex >= strLen) {
        throw new Error("Expected more digits in base 64 VLQ value.");
      }
      digit = base64.decode(aStr.charCodeAt(aIndex++));
      if (digit === -1) {
        throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
      }
      continuation = !!(digit & VLQ_CONTINUATION_BIT);
      digit &= VLQ_BASE_MASK;
      result = result + (digit << shift);
      shift += VLQ_BASE_SHIFT;
    } while (continuation);
    aOutParam.value = fromVLQSigned(result);
    aOutParam.rest = aIndex;
  };
});

// node_modules/source-map/lib/util.js
var require_util = __commonJS((exports2) => {
  function getArg(aArgs, aName, aDefaultValue) {
    if (aName in aArgs) {
      return aArgs[aName];
    } else if (arguments.length === 3) {
      return aDefaultValue;
    } else {
      throw new Error('"' + aName + '" is a required argument.');
    }
  }
  exports2.getArg = getArg;
  var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
  var dataUrlRegexp = /^data:.+\,.+$/;
  function urlParse(aUrl) {
    var match = aUrl.match(urlRegexp);
    if (!match) {
      return null;
    }
    return {
      scheme: match[1],
      auth: match[2],
      host: match[3],
      port: match[4],
      path: match[5]
    };
  }
  exports2.urlParse = urlParse;
  function urlGenerate(aParsedUrl) {
    var url = "";
    if (aParsedUrl.scheme) {
      url += aParsedUrl.scheme + ":";
    }
    url += "//";
    if (aParsedUrl.auth) {
      url += aParsedUrl.auth + "@";
    }
    if (aParsedUrl.host) {
      url += aParsedUrl.host;
    }
    if (aParsedUrl.port) {
      url += ":" + aParsedUrl.port;
    }
    if (aParsedUrl.path) {
      url += aParsedUrl.path;
    }
    return url;
  }
  exports2.urlGenerate = urlGenerate;
  function normalize(aPath) {
    var path = aPath;
    var url = urlParse(aPath);
    if (url) {
      if (!url.path) {
        return aPath;
      }
      path = url.path;
    }
    var isAbsolute = exports2.isAbsolute(path);
    var parts = path.split(/\/+/);
    for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
      part = parts[i];
      if (part === ".") {
        parts.splice(i, 1);
      } else if (part === "..") {
        up++;
      } else if (up > 0) {
        if (part === "") {
          parts.splice(i + 1, up);
          up = 0;
        } else {
          parts.splice(i, 2);
          up--;
        }
      }
    }
    path = parts.join("/");
    if (path === "") {
      path = isAbsolute ? "/" : ".";
    }
    if (url) {
      url.path = path;
      return urlGenerate(url);
    }
    return path;
  }
  exports2.normalize = normalize;
  function join(aRoot, aPath) {
    if (aRoot === "") {
      aRoot = ".";
    }
    if (aPath === "") {
      aPath = ".";
    }
    var aPathUrl = urlParse(aPath);
    var aRootUrl = urlParse(aRoot);
    if (aRootUrl) {
      aRoot = aRootUrl.path || "/";
    }
    if (aPathUrl && !aPathUrl.scheme) {
      if (aRootUrl) {
        aPathUrl.scheme = aRootUrl.scheme;
      }
      return urlGenerate(aPathUrl);
    }
    if (aPathUrl || aPath.match(dataUrlRegexp)) {
      return aPath;
    }
    if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
      aRootUrl.host = aPath;
      return urlGenerate(aRootUrl);
    }
    var joined = aPath.charAt(0) === "/" ? aPath : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
    if (aRootUrl) {
      aRootUrl.path = joined;
      return urlGenerate(aRootUrl);
    }
    return joined;
  }
  exports2.join = join;
  exports2.isAbsolute = function(aPath) {
    return aPath.charAt(0) === "/" || urlRegexp.test(aPath);
  };
  function relative(aRoot, aPath) {
    if (aRoot === "") {
      aRoot = ".";
    }
    aRoot = aRoot.replace(/\/$/, "");
    var level = 0;
    while (aPath.indexOf(aRoot + "/") !== 0) {
      var index = aRoot.lastIndexOf("/");
      if (index < 0) {
        return aPath;
      }
      aRoot = aRoot.slice(0, index);
      if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
        return aPath;
      }
      ++level;
    }
    return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
  }
  exports2.relative = relative;
  var supportsNullProto = function() {
    var obj = Object.create(null);
    return !("__proto__" in obj);
  }();
  function identity(s) {
    return s;
  }
  function toSetString(aStr) {
    if (isProtoString(aStr)) {
      return "$" + aStr;
    }
    return aStr;
  }
  exports2.toSetString = supportsNullProto ? identity : toSetString;
  function fromSetString(aStr) {
    if (isProtoString(aStr)) {
      return aStr.slice(1);
    }
    return aStr;
  }
  exports2.fromSetString = supportsNullProto ? identity : fromSetString;
  function isProtoString(s) {
    if (!s) {
      return false;
    }
    var length = s.length;
    if (length < 9) {
      return false;
    }
    if (s.charCodeAt(length - 1) !== 95 || s.charCodeAt(length - 2) !== 95 || s.charCodeAt(length - 3) !== 111 || s.charCodeAt(length - 4) !== 116 || s.charCodeAt(length - 5) !== 111 || s.charCodeAt(length - 6) !== 114 || s.charCodeAt(length - 7) !== 112 || s.charCodeAt(length - 8) !== 95 || s.charCodeAt(length - 9) !== 95) {
      return false;
    }
    for (var i = length - 10; i >= 0; i--) {
      if (s.charCodeAt(i) !== 36) {
        return false;
      }
    }
    return true;
  }
  function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
    var cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0 || onlyCompareOriginal) {
      return cmp;
    }
    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }
    return strcmp(mappingA.name, mappingB.name);
  }
  exports2.compareByOriginalPositions = compareByOriginalPositions;
  function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
    var cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0 || onlyCompareGenerated) {
      return cmp;
    }
    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0) {
      return cmp;
    }
    return strcmp(mappingA.name, mappingB.name);
  }
  exports2.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
  function strcmp(aStr1, aStr2) {
    if (aStr1 === aStr2) {
      return 0;
    }
    if (aStr1 === null) {
      return 1;
    }
    if (aStr2 === null) {
      return -1;
    }
    if (aStr1 > aStr2) {
      return 1;
    }
    return -1;
  }
  function compareByGeneratedPositionsInflated(mappingA, mappingB) {
    var cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0) {
      return cmp;
    }
    return strcmp(mappingA.name, mappingB.name);
  }
  exports2.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
  function parseSourceMapInput(str) {
    return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ""));
  }
  exports2.parseSourceMapInput = parseSourceMapInput;
  function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
    sourceURL = sourceURL || "";
    if (sourceRoot) {
      if (sourceRoot[sourceRoot.length - 1] !== "/" && sourceURL[0] !== "/") {
        sourceRoot += "/";
      }
      sourceURL = sourceRoot + sourceURL;
    }
    if (sourceMapURL) {
      var parsed = urlParse(sourceMapURL);
      if (!parsed) {
        throw new Error("sourceMapURL could not be parsed");
      }
      if (parsed.path) {
        var index = parsed.path.lastIndexOf("/");
        if (index >= 0) {
          parsed.path = parsed.path.substring(0, index + 1);
        }
      }
      sourceURL = join(urlGenerate(parsed), sourceURL);
    }
    return normalize(sourceURL);
  }
  exports2.computeSourceURL = computeSourceURL;
});

// node_modules/source-map/lib/array-set.js
var require_array_set = __commonJS((exports2) => {
  var util = require_util();
  var has = Object.prototype.hasOwnProperty;
  var hasNativeMap = typeof Map !== "undefined";
  function ArraySet() {
    this._array = [];
    this._set = hasNativeMap ? new Map() : Object.create(null);
  }
  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
    var set = new ArraySet();
    for (var i = 0, len = aArray.length; i < len; i++) {
      set.add(aArray[i], aAllowDuplicates);
    }
    return set;
  };
  ArraySet.prototype.size = function ArraySet_size() {
    return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
  };
  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
    var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
    var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
    var idx = this._array.length;
    if (!isDuplicate || aAllowDuplicates) {
      this._array.push(aStr);
    }
    if (!isDuplicate) {
      if (hasNativeMap) {
        this._set.set(aStr, idx);
      } else {
        this._set[sStr] = idx;
      }
    }
  };
  ArraySet.prototype.has = function ArraySet_has(aStr) {
    if (hasNativeMap) {
      return this._set.has(aStr);
    } else {
      var sStr = util.toSetString(aStr);
      return has.call(this._set, sStr);
    }
  };
  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
    if (hasNativeMap) {
      var idx = this._set.get(aStr);
      if (idx >= 0) {
        return idx;
      }
    } else {
      var sStr = util.toSetString(aStr);
      if (has.call(this._set, sStr)) {
        return this._set[sStr];
      }
    }
    throw new Error('"' + aStr + '" is not in the set.');
  };
  ArraySet.prototype.at = function ArraySet_at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
    }
    throw new Error("No element indexed by " + aIdx);
  };
  ArraySet.prototype.toArray = function ArraySet_toArray() {
    return this._array.slice();
  };
  exports2.ArraySet = ArraySet;
});

// node_modules/source-map/lib/mapping-list.js
var require_mapping_list = __commonJS((exports2) => {
  var util = require_util();
  function generatedPositionAfter(mappingA, mappingB) {
    var lineA = mappingA.generatedLine;
    var lineB = mappingB.generatedLine;
    var columnA = mappingA.generatedColumn;
    var columnB = mappingB.generatedColumn;
    return lineB > lineA || lineB == lineA && columnB >= columnA || util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
  }
  function MappingList() {
    this._array = [];
    this._sorted = true;
    this._last = {generatedLine: -1, generatedColumn: 0};
  }
  MappingList.prototype.unsortedForEach = function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };
  MappingList.prototype.add = function MappingList_add(aMapping) {
    if (generatedPositionAfter(this._last, aMapping)) {
      this._last = aMapping;
      this._array.push(aMapping);
    } else {
      this._sorted = false;
      this._array.push(aMapping);
    }
  };
  MappingList.prototype.toArray = function MappingList_toArray() {
    if (!this._sorted) {
      this._array.sort(util.compareByGeneratedPositionsInflated);
      this._sorted = true;
    }
    return this._array;
  };
  exports2.MappingList = MappingList;
});

// node_modules/source-map/lib/source-map-generator.js
var require_source_map_generator = __commonJS((exports2) => {
  var base64VLQ = require_base64_vlq();
  var util = require_util();
  var ArraySet = require_array_set().ArraySet;
  var MappingList = require_mapping_list().MappingList;
  function SourceMapGenerator(aArgs) {
    if (!aArgs) {
      aArgs = {};
    }
    this._file = util.getArg(aArgs, "file", null);
    this._sourceRoot = util.getArg(aArgs, "sourceRoot", null);
    this._skipValidation = util.getArg(aArgs, "skipValidation", false);
    this._sources = new ArraySet();
    this._names = new ArraySet();
    this._mappings = new MappingList();
    this._sourcesContents = null;
  }
  SourceMapGenerator.prototype._version = 3;
  SourceMapGenerator.fromSourceMap = function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot
    });
    aSourceMapConsumer.eachMapping(function(mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };
      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util.relative(sourceRoot, newMapping.source);
        }
        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };
        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }
      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function(sourceFile) {
      var sourceRelative = sourceFile;
      if (sourceRoot !== null) {
        sourceRelative = util.relative(sourceRoot, sourceFile);
      }
      if (!generator._sources.has(sourceRelative)) {
        generator._sources.add(sourceRelative);
      }
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };
  SourceMapGenerator.prototype.addMapping = function SourceMapGenerator_addMapping(aArgs) {
    var generated = util.getArg(aArgs, "generated");
    var original = util.getArg(aArgs, "original", null);
    var source = util.getArg(aArgs, "source", null);
    var name = util.getArg(aArgs, "name", null);
    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }
    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }
    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }
    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source,
      name
    });
  };
  SourceMapGenerator.prototype.setSourceContent = function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util.relative(this._sourceRoot, source);
    }
    if (aSourceContent != null) {
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      delete this._sourcesContents[util.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };
  SourceMapGenerator.prototype.applySourceMap = function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(`SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`);
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    if (sourceRoot != null) {
      sourceFile = util.relative(sourceRoot, sourceFile);
    }
    var newSources = new ArraySet();
    var newNames = new ArraySet();
    this._mappings.unsortedForEach(function(mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util.join(aSourceMapPath, mapping.source);
          }
          if (sourceRoot != null) {
            mapping.source = util.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }
      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }
      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }
    }, this);
    this._sources = newSources;
    this._names = newNames;
    aSourceMapConsumer.sources.forEach(function(sourceFile2) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile2);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile2 = util.join(aSourceMapPath, sourceFile2);
        }
        if (sourceRoot != null) {
          sourceFile2 = util.relative(sourceRoot, sourceFile2);
        }
        this.setSourceContent(sourceFile2, content);
      }
    }, this);
  };
  SourceMapGenerator.prototype._validateMapping = function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource, aName) {
    if (aOriginal && typeof aOriginal.line !== "number" && typeof aOriginal.column !== "number") {
      throw new Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");
    }
    if (aGenerated && "line" in aGenerated && "column" in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) {
      return;
    } else if (aGenerated && "line" in aGenerated && "column" in aGenerated && aOriginal && "line" in aOriginal && "column" in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) {
      return;
    } else {
      throw new Error("Invalid mapping: " + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };
  SourceMapGenerator.prototype._serializeMappings = function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = "";
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;
    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = "";
      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ";";
          previousGeneratedLine++;
        }
      } else {
        if (i > 0) {
          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ",";
        }
      }
      next += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;
      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;
        next += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;
        next += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;
        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }
      result += next;
    }
    return result;
  };
  SourceMapGenerator.prototype._generateSourcesContent = function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function(source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util.relative(aSourceRoot, source);
      }
      var key = util.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key) ? this._sourcesContents[key] : null;
    }, this);
  };
  SourceMapGenerator.prototype.toJSON = function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }
    return map;
  };
  SourceMapGenerator.prototype.toString = function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };
  exports2.SourceMapGenerator = SourceMapGenerator;
});

// node_modules/source-map/lib/binary-search.js
var require_binary_search = __commonJS((exports2) => {
  exports2.GREATEST_LOWER_BOUND = 1;
  exports2.LEAST_UPPER_BOUND = 2;
  function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
    var mid = Math.floor((aHigh - aLow) / 2) + aLow;
    var cmp = aCompare(aNeedle, aHaystack[mid], true);
    if (cmp === 0) {
      return mid;
    } else if (cmp > 0) {
      if (aHigh - mid > 1) {
        return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
      }
      if (aBias == exports2.LEAST_UPPER_BOUND) {
        return aHigh < aHaystack.length ? aHigh : -1;
      } else {
        return mid;
      }
    } else {
      if (mid - aLow > 1) {
        return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
      }
      if (aBias == exports2.LEAST_UPPER_BOUND) {
        return mid;
      } else {
        return aLow < 0 ? -1 : aLow;
      }
    }
  }
  exports2.search = function search(aNeedle, aHaystack, aCompare, aBias) {
    if (aHaystack.length === 0) {
      return -1;
    }
    var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare, aBias || exports2.GREATEST_LOWER_BOUND);
    if (index < 0) {
      return -1;
    }
    while (index - 1 >= 0) {
      if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
        break;
      }
      --index;
    }
    return index;
  };
});

// node_modules/source-map/lib/quick-sort.js
var require_quick_sort = __commonJS((exports2) => {
  function swap(ary, x, y) {
    var temp = ary[x];
    ary[x] = ary[y];
    ary[y] = temp;
  }
  function randomIntInRange(low, high) {
    return Math.round(low + Math.random() * (high - low));
  }
  function doQuickSort(ary, comparator, p, r) {
    if (p < r) {
      var pivotIndex = randomIntInRange(p, r);
      var i = p - 1;
      swap(ary, pivotIndex, r);
      var pivot = ary[r];
      for (var j = p; j < r; j++) {
        if (comparator(ary[j], pivot) <= 0) {
          i += 1;
          swap(ary, i, j);
        }
      }
      swap(ary, i + 1, j);
      var q = i + 1;
      doQuickSort(ary, comparator, p, q - 1);
      doQuickSort(ary, comparator, q + 1, r);
    }
  }
  exports2.quickSort = function(ary, comparator) {
    doQuickSort(ary, comparator, 0, ary.length - 1);
  };
});

// node_modules/source-map/lib/source-map-consumer.js
var require_source_map_consumer = __commonJS((exports2) => {
  var util = require_util();
  var binarySearch = require_binary_search();
  var ArraySet = require_array_set().ArraySet;
  var base64VLQ = require_base64_vlq();
  var quickSort = require_quick_sort().quickSort;
  function SourceMapConsumer(aSourceMap, aSourceMapURL) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === "string") {
      sourceMap = util.parseSourceMapInput(aSourceMap);
    }
    return sourceMap.sections != null ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL) : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
  }
  SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
    return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
  };
  SourceMapConsumer.prototype._version = 3;
  SourceMapConsumer.prototype.__generatedMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, "_generatedMappings", {
    configurable: true,
    enumerable: true,
    get: function() {
      if (!this.__generatedMappings) {
        this._parseMappings(this._mappings, this.sourceRoot);
      }
      return this.__generatedMappings;
    }
  });
  SourceMapConsumer.prototype.__originalMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, "_originalMappings", {
    configurable: true,
    enumerable: true,
    get: function() {
      if (!this.__originalMappings) {
        this._parseMappings(this._mappings, this.sourceRoot);
      }
      return this.__originalMappings;
    }
  });
  SourceMapConsumer.prototype._charIsMappingSeparator = function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };
  SourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };
  SourceMapConsumer.GENERATED_ORDER = 1;
  SourceMapConsumer.ORIGINAL_ORDER = 2;
  SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
  SourceMapConsumer.LEAST_UPPER_BOUND = 2;
  SourceMapConsumer.prototype.eachMapping = function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
    var mappings;
    switch (order) {
      case SourceMapConsumer.GENERATED_ORDER:
        mappings = this._generatedMappings;
        break;
      case SourceMapConsumer.ORIGINAL_ORDER:
        mappings = this._originalMappings;
        break;
      default:
        throw new Error("Unknown order of iteration.");
    }
    var sourceRoot = this.sourceRoot;
    mappings.map(function(mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
      return {
        source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };
  SourceMapConsumer.prototype.allGeneratedPositionsFor = function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, "line");
    var needle = {
      source: util.getArg(aArgs, "source"),
      originalLine: line,
      originalColumn: util.getArg(aArgs, "column", 0)
    };
    needle.source = this._findSourceIndex(needle.source);
    if (needle.source < 0) {
      return [];
    }
    var mappings = [];
    var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];
      if (aArgs.column === void 0) {
        var originalLine = mapping.originalLine;
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, "generatedLine", null),
            column: util.getArg(mapping, "generatedColumn", null),
            lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
          });
          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;
        while (mapping && mapping.originalLine === line && mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, "generatedLine", null),
            column: util.getArg(mapping, "generatedColumn", null),
            lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
          });
          mapping = this._originalMappings[++index];
        }
      }
    }
    return mappings;
  };
  exports2.SourceMapConsumer = SourceMapConsumer;
  function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === "string") {
      sourceMap = util.parseSourceMapInput(aSourceMap);
    }
    var version = util.getArg(sourceMap, "version");
    var sources = util.getArg(sourceMap, "sources");
    var names = util.getArg(sourceMap, "names", []);
    var sourceRoot = util.getArg(sourceMap, "sourceRoot", null);
    var sourcesContent = util.getArg(sourceMap, "sourcesContent", null);
    var mappings = util.getArg(sourceMap, "mappings");
    var file = util.getArg(sourceMap, "file", null);
    if (version != this._version) {
      throw new Error("Unsupported version: " + version);
    }
    if (sourceRoot) {
      sourceRoot = util.normalize(sourceRoot);
    }
    sources = sources.map(String).map(util.normalize).map(function(source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source) ? util.relative(sourceRoot, source) : source;
    });
    this._names = ArraySet.fromArray(names.map(String), true);
    this._sources = ArraySet.fromArray(sources, true);
    this._absoluteSources = this._sources.toArray().map(function(s) {
      return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
    });
    this.sourceRoot = sourceRoot;
    this.sourcesContent = sourcesContent;
    this._mappings = mappings;
    this._sourceMapURL = aSourceMapURL;
    this.file = file;
  }
  BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
  BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
  BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util.relative(this.sourceRoot, relativeSource);
    }
    if (this._sources.has(relativeSource)) {
      return this._sources.indexOf(relativeSource);
    }
    var i;
    for (i = 0; i < this._absoluteSources.length; ++i) {
      if (this._absoluteSources[i] == aSource) {
        return i;
      }
    }
    return -1;
  };
  BasicSourceMapConsumer.fromSourceMap = function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);
    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(), smc.sourceRoot);
    smc.file = aSourceMap._file;
    smc._sourceMapURL = aSourceMapURL;
    smc._absoluteSources = smc._sources.toArray().map(function(s) {
      return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
    });
    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];
    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping();
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;
      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;
        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }
        destOriginalMappings.push(destMapping);
      }
      destGeneratedMappings.push(destMapping);
    }
    quickSort(smc.__originalMappings, util.compareByOriginalPositions);
    return smc;
  };
  BasicSourceMapConsumer.prototype._version = 3;
  Object.defineProperty(BasicSourceMapConsumer.prototype, "sources", {
    get: function() {
      return this._absoluteSources.slice();
    }
  });
  function Mapping() {
    this.generatedLine = 0;
    this.generatedColumn = 0;
    this.source = null;
    this.originalLine = null;
    this.originalColumn = null;
    this.name = null;
  }
  BasicSourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;
    while (index < length) {
      if (aStr.charAt(index) === ";") {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      } else if (aStr.charAt(index) === ",") {
        index++;
      } else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);
        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }
          if (segment.length === 2) {
            throw new Error("Found a source, but no line and column");
          }
          if (segment.length === 3) {
            throw new Error("Found a source and line, but no column");
          }
          cachedSegments[str] = segment;
        }
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;
        if (segment.length > 1) {
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          mapping.originalLine += 1;
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;
          if (segment.length > 4) {
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }
        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === "number") {
          originalMappings.push(mapping);
        }
      }
    }
    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;
    quickSort(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };
  BasicSourceMapConsumer.prototype._findMapping = function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName, aColumnName, aComparator, aBias) {
    if (aNeedle[aLineName] <= 0) {
      throw new TypeError("Line must be greater than or equal to 1, got " + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError("Column must be greater than or equal to 0, got " + aNeedle[aColumnName]);
    }
    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };
  BasicSourceMapConsumer.prototype.computeColumnSpans = function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];
        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }
      mapping.lastGeneratedColumn = Infinity;
    }
  };
  BasicSourceMapConsumer.prototype.originalPositionFor = function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, "line"),
      generatedColumn: util.getArg(aArgs, "column")
    };
    var index = this._findMapping(needle, this._generatedMappings, "generatedLine", "generatedColumn", util.compareByGeneratedPositionsDeflated, util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
    if (index >= 0) {
      var mapping = this._generatedMappings[index];
      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, "source", null);
        if (source !== null) {
          source = this._sources.at(source);
          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
        }
        var name = util.getArg(mapping, "name", null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source,
          line: util.getArg(mapping, "originalLine", null),
          column: util.getArg(mapping, "originalColumn", null),
          name
        };
      }
    }
    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };
  BasicSourceMapConsumer.prototype.hasContentsOfAllSources = function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(sc) {
      return sc == null;
    });
  };
  BasicSourceMapConsumer.prototype.sourceContentFor = function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }
    var index = this._findSourceIndex(aSource);
    if (index >= 0) {
      return this.sourcesContent[index];
    }
    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util.relative(this.sourceRoot, relativeSource);
    }
    var url;
    if (this.sourceRoot != null && (url = util.urlParse(this.sourceRoot))) {
      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
      if (url.scheme == "file" && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)];
      }
      if ((!url.path || url.path == "/") && this._sources.has("/" + relativeSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
    }
    if (nullOnMissing) {
      return null;
    } else {
      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
    }
  };
  BasicSourceMapConsumer.prototype.generatedPositionFor = function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, "source");
    source = this._findSourceIndex(source);
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }
    var needle = {
      source,
      originalLine: util.getArg(aArgs, "line"),
      originalColumn: util.getArg(aArgs, "column")
    };
    var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
    if (index >= 0) {
      var mapping = this._originalMappings[index];
      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, "generatedLine", null),
          column: util.getArg(mapping, "generatedColumn", null),
          lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
        };
      }
    }
    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };
  exports2.BasicSourceMapConsumer = BasicSourceMapConsumer;
  function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === "string") {
      sourceMap = util.parseSourceMapInput(aSourceMap);
    }
    var version = util.getArg(sourceMap, "version");
    var sections = util.getArg(sourceMap, "sections");
    if (version != this._version) {
      throw new Error("Unsupported version: " + version);
    }
    this._sources = new ArraySet();
    this._names = new ArraySet();
    var lastOffset = {
      line: -1,
      column: 0
    };
    this._sections = sections.map(function(s) {
      if (s.url) {
        throw new Error("Support for url field in sections not implemented.");
      }
      var offset = util.getArg(s, "offset");
      var offsetLine = util.getArg(offset, "line");
      var offsetColumn = util.getArg(offset, "column");
      if (offsetLine < lastOffset.line || offsetLine === lastOffset.line && offsetColumn < lastOffset.column) {
        throw new Error("Section offsets must be ordered and non-overlapping.");
      }
      lastOffset = offset;
      return {
        generatedOffset: {
          generatedLine: offsetLine + 1,
          generatedColumn: offsetColumn + 1
        },
        consumer: new SourceMapConsumer(util.getArg(s, "map"), aSourceMapURL)
      };
    });
  }
  IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
  IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
  IndexedSourceMapConsumer.prototype._version = 3;
  Object.defineProperty(IndexedSourceMapConsumer.prototype, "sources", {
    get: function() {
      var sources = [];
      for (var i = 0; i < this._sections.length; i++) {
        for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
          sources.push(this._sections[i].consumer.sources[j]);
        }
      }
      return sources;
    }
  });
  IndexedSourceMapConsumer.prototype.originalPositionFor = function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, "line"),
      generatedColumn: util.getArg(aArgs, "column")
    };
    var sectionIndex = binarySearch.search(needle, this._sections, function(needle2, section2) {
      var cmp = needle2.generatedLine - section2.generatedOffset.generatedLine;
      if (cmp) {
        return cmp;
      }
      return needle2.generatedColumn - section2.generatedOffset.generatedColumn;
    });
    var section = this._sections[sectionIndex];
    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }
    return section.consumer.originalPositionFor({
      line: needle.generatedLine - (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn - (section.generatedOffset.generatedLine === needle.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
      bias: aArgs.bias
    });
  };
  IndexedSourceMapConsumer.prototype.hasContentsOfAllSources = function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function(s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };
  IndexedSourceMapConsumer.prototype.sourceContentFor = function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    } else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };
  IndexedSourceMapConsumer.prototype.generatedPositionFor = function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      if (section.consumer._findSourceIndex(util.getArg(aArgs, "source")) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line + (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column + (section.generatedOffset.generatedLine === generatedPosition.line ? section.generatedOffset.generatedColumn - 1 : 0)
        };
        return ret;
      }
    }
    return {
      line: null,
      column: null
    };
  };
  IndexedSourceMapConsumer.prototype._parseMappings = function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];
        var source = section.consumer._sources.at(mapping.source);
        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
        this._sources.add(source);
        source = this._sources.indexOf(source);
        var name = null;
        if (mapping.name) {
          name = section.consumer._names.at(mapping.name);
          this._names.add(name);
          name = this._names.indexOf(name);
        }
        var adjustedMapping = {
          source,
          generatedLine: mapping.generatedLine + (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn + (section.generatedOffset.generatedLine === mapping.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name
        };
        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === "number") {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }
    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort(this.__originalMappings, util.compareByOriginalPositions);
  };
  exports2.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
});

// node_modules/source-map/lib/source-node.js
var require_source_node = __commonJS((exports2) => {
  var SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
  var util = require_util();
  var REGEX_NEWLINE = /(\r?\n)/;
  var NEWLINE_CODE = 10;
  var isSourceNode = "$$$isSourceNode$$$";
  function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
    this.children = [];
    this.sourceContents = {};
    this.line = aLine == null ? null : aLine;
    this.column = aColumn == null ? null : aColumn;
    this.source = aSource == null ? null : aSource;
    this.name = aName == null ? null : aName;
    this[isSourceNode] = true;
    if (aChunks != null)
      this.add(aChunks);
  }
  SourceNode.fromStringWithSourceMap = function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    var node = new SourceNode();
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var remainingLinesIndex = 0;
    var shiftNextLine = function() {
      var lineContents = getNextLine();
      var newLine = getNextLine() || "";
      return lineContents + newLine;
      function getNextLine() {
        return remainingLinesIndex < remainingLines.length ? remainingLines[remainingLinesIndex++] : void 0;
      }
    };
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;
    var lastMapping = null;
    aSourceMapConsumer.eachMapping(function(mapping) {
      if (lastMapping !== null) {
        if (lastGeneratedLine < mapping.generatedLine) {
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
        } else {
          var nextLine = remainingLines[remainingLinesIndex] || "";
          var code = nextLine.substr(0, mapping.generatedColumn - lastGeneratedColumn);
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn - lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          lastMapping = mapping;
          return;
        }
      }
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[remainingLinesIndex] || "";
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    if (remainingLinesIndex < remainingLines.length) {
      if (lastMapping) {
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      node.add(remainingLines.splice(remainingLinesIndex).join(""));
    }
    aSourceMapConsumer.sources.forEach(function(sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });
    return node;
    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === void 0) {
        node.add(code);
      } else {
        var source = aRelativePath ? util.join(aRelativePath, mapping.source) : mapping.source;
        node.add(new SourceNode(mapping.originalLine, mapping.originalColumn, source, code, mapping.name));
      }
    }
  };
  SourceNode.prototype.add = function SourceNode_add(aChunk) {
    if (Array.isArray(aChunk)) {
      aChunk.forEach(function(chunk) {
        this.add(chunk);
      }, this);
    } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      if (aChunk) {
        this.children.push(aChunk);
      }
    } else {
      throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
    }
    return this;
  };
  SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
    if (Array.isArray(aChunk)) {
      for (var i = aChunk.length - 1; i >= 0; i--) {
        this.prepend(aChunk[i]);
      }
    } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      this.children.unshift(aChunk);
    } else {
      throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
    }
    return this;
  };
  SourceNode.prototype.walk = function SourceNode_walk(aFn) {
    var chunk;
    for (var i = 0, len = this.children.length; i < len; i++) {
      chunk = this.children[i];
      if (chunk[isSourceNode]) {
        chunk.walk(aFn);
      } else {
        if (chunk !== "") {
          aFn(chunk, {
            source: this.source,
            line: this.line,
            column: this.column,
            name: this.name
          });
        }
      }
    }
  };
  SourceNode.prototype.join = function SourceNode_join(aSep) {
    var newChildren;
    var i;
    var len = this.children.length;
    if (len > 0) {
      newChildren = [];
      for (i = 0; i < len - 1; i++) {
        newChildren.push(this.children[i]);
        newChildren.push(aSep);
      }
      newChildren.push(this.children[i]);
      this.children = newChildren;
    }
    return this;
  };
  SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
    var lastChild = this.children[this.children.length - 1];
    if (lastChild[isSourceNode]) {
      lastChild.replaceRight(aPattern, aReplacement);
    } else if (typeof lastChild === "string") {
      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
    } else {
      this.children.push("".replace(aPattern, aReplacement));
    }
    return this;
  };
  SourceNode.prototype.setSourceContent = function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
  };
  SourceNode.prototype.walkSourceContents = function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }
    var sources = Object.keys(this.sourceContents);
    for (var i = 0, len = sources.length; i < len; i++) {
      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  };
  SourceNode.prototype.toString = function SourceNode_toString() {
    var str = "";
    this.walk(function(chunk) {
      str += chunk;
    });
    return str;
  };
  SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
    var generated = {
      code: "",
      line: 1,
      column: 0
    };
    var map = new SourceMapGenerator(aArgs);
    var sourceMappingActive = false;
    var lastOriginalSource = null;
    var lastOriginalLine = null;
    var lastOriginalColumn = null;
    var lastOriginalName = null;
    this.walk(function(chunk, original) {
      generated.code += chunk;
      if (original.source !== null && original.line !== null && original.column !== null) {
        if (lastOriginalSource !== original.source || lastOriginalLine !== original.line || lastOriginalColumn !== original.column || lastOriginalName !== original.name) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
        lastOriginalSource = original.source;
        lastOriginalLine = original.line;
        lastOriginalColumn = original.column;
        lastOriginalName = original.name;
        sourceMappingActive = true;
      } else if (sourceMappingActive) {
        map.addMapping({
          generated: {
            line: generated.line,
            column: generated.column
          }
        });
        lastOriginalSource = null;
        sourceMappingActive = false;
      }
      for (var idx = 0, length = chunk.length; idx < length; idx++) {
        if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
          generated.line++;
          generated.column = 0;
          if (idx + 1 === length) {
            lastOriginalSource = null;
            sourceMappingActive = false;
          } else if (sourceMappingActive) {
            map.addMapping({
              source: original.source,
              original: {
                line: original.line,
                column: original.column
              },
              generated: {
                line: generated.line,
                column: generated.column
              },
              name: original.name
            });
          }
        } else {
          generated.column++;
        }
      }
    });
    this.walkSourceContents(function(sourceFile, sourceContent) {
      map.setSourceContent(sourceFile, sourceContent);
    });
    return {code: generated.code, map};
  };
  exports2.SourceNode = SourceNode;
});

// node_modules/source-map/source-map.js
var require_source_map = __commonJS((exports2) => {
  exports2.SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
  exports2.SourceMapConsumer = require_source_map_consumer().SourceMapConsumer;
  exports2.SourceNode = require_source_node().SourceNode;
});

// node_modules/buffer-from/index.js
var require_buffer_from = __commonJS((exports2, module2) => {
  var toString = Object.prototype.toString;
  var isModern = typeof Buffer.alloc === "function" && typeof Buffer.allocUnsafe === "function" && typeof Buffer.from === "function";
  function isArrayBuffer(input) {
    return toString.call(input).slice(8, -1) === "ArrayBuffer";
  }
  function fromArrayBuffer(obj, byteOffset, length) {
    byteOffset >>>= 0;
    var maxLength = obj.byteLength - byteOffset;
    if (maxLength < 0) {
      throw new RangeError("'offset' is out of bounds");
    }
    if (length === void 0) {
      length = maxLength;
    } else {
      length >>>= 0;
      if (length > maxLength) {
        throw new RangeError("'length' is out of bounds");
      }
    }
    return isModern ? Buffer.from(obj.slice(byteOffset, byteOffset + length)) : new Buffer(new Uint8Array(obj.slice(byteOffset, byteOffset + length)));
  }
  function fromString(string, encoding) {
    if (typeof encoding !== "string" || encoding === "") {
      encoding = "utf8";
    }
    if (!Buffer.isEncoding(encoding)) {
      throw new TypeError('"encoding" must be a valid string encoding');
    }
    return isModern ? Buffer.from(string, encoding) : new Buffer(string, encoding);
  }
  function bufferFrom(value, encodingOrOffset, length) {
    if (typeof value === "number") {
      throw new TypeError('"value" argument must not be a number');
    }
    if (isArrayBuffer(value)) {
      return fromArrayBuffer(value, encodingOrOffset, length);
    }
    if (typeof value === "string") {
      return fromString(value, encodingOrOffset);
    }
    return isModern ? Buffer.from(value) : new Buffer(value);
  }
  module2.exports = bufferFrom;
});

// node_modules/source-map-support/source-map-support.js
var require_source_map_support = __commonJS((exports2, module2) => {
  var SourceMapConsumer = require_source_map().SourceMapConsumer;
  var path = require("path");
  var fs;
  try {
    fs = require("fs");
    if (!fs.existsSync || !fs.readFileSync) {
      fs = null;
    }
  } catch (err) {
  }
  var bufferFrom = require_buffer_from();
  function dynamicRequire(mod, request) {
    return mod.require(request);
  }
  var errorFormatterInstalled = false;
  var uncaughtShimInstalled = false;
  var emptyCacheBetweenOperations = false;
  var environment = "auto";
  var fileContentsCache = {};
  var sourceMapCache = {};
  var reSourceMap = /^data:application\/json[^,]+base64,/;
  var retrieveFileHandlers = [];
  var retrieveMapHandlers = [];
  function isInBrowser() {
    if (environment === "browser")
      return true;
    if (environment === "node")
      return false;
    return typeof window !== "undefined" && typeof XMLHttpRequest === "function" && !(window.require && window.module && window.process && window.process.type === "renderer");
  }
  function hasGlobalProcessEventEmitter() {
    return typeof process === "object" && process !== null && typeof process.on === "function";
  }
  function handlerExec(list) {
    return function(arg) {
      for (var i = 0; i < list.length; i++) {
        var ret = list[i](arg);
        if (ret) {
          return ret;
        }
      }
      return null;
    };
  }
  var retrieveFile = handlerExec(retrieveFileHandlers);
  retrieveFileHandlers.push(function(path2) {
    path2 = path2.trim();
    if (/^file:/.test(path2)) {
      path2 = path2.replace(/file:\/\/\/(\w:)?/, function(protocol, drive) {
        return drive ? "" : "/";
      });
    }
    if (path2 in fileContentsCache) {
      return fileContentsCache[path2];
    }
    var contents = "";
    try {
      if (!fs) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", path2, false);
        xhr.send(null);
        if (xhr.readyState === 4 && xhr.status === 200) {
          contents = xhr.responseText;
        }
      } else if (fs.existsSync(path2)) {
        contents = fs.readFileSync(path2, "utf8");
      }
    } catch (er) {
    }
    return fileContentsCache[path2] = contents;
  });
  function supportRelativeURL(file, url) {
    if (!file)
      return url;
    var dir = path.dirname(file);
    var match = /^\w+:\/\/[^\/]*/.exec(dir);
    var protocol = match ? match[0] : "";
    var startPath = dir.slice(protocol.length);
    if (protocol && /^\/\w\:/.test(startPath)) {
      protocol += "/";
      return protocol + path.resolve(dir.slice(protocol.length), url).replace(/\\/g, "/");
    }
    return protocol + path.resolve(dir.slice(protocol.length), url);
  }
  function retrieveSourceMapURL(source) {
    var fileData;
    if (isInBrowser()) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", source, false);
        xhr.send(null);
        fileData = xhr.readyState === 4 ? xhr.responseText : null;
        var sourceMapHeader = xhr.getResponseHeader("SourceMap") || xhr.getResponseHeader("X-SourceMap");
        if (sourceMapHeader) {
          return sourceMapHeader;
        }
      } catch (e) {
      }
    }
    fileData = retrieveFile(source);
    var re = /(?:\/\/[@#][\s]*sourceMappingURL=([^\s'"]+)[\s]*$)|(?:\/\*[@#][\s]*sourceMappingURL=([^\s*'"]+)[\s]*(?:\*\/)[\s]*$)/mg;
    var lastMatch, match;
    while (match = re.exec(fileData))
      lastMatch = match;
    if (!lastMatch)
      return null;
    return lastMatch[1];
  }
  var retrieveSourceMap = handlerExec(retrieveMapHandlers);
  retrieveMapHandlers.push(function(source) {
    var sourceMappingURL = retrieveSourceMapURL(source);
    if (!sourceMappingURL)
      return null;
    var sourceMapData;
    if (reSourceMap.test(sourceMappingURL)) {
      var rawData = sourceMappingURL.slice(sourceMappingURL.indexOf(",") + 1);
      sourceMapData = bufferFrom(rawData, "base64").toString();
      sourceMappingURL = source;
    } else {
      sourceMappingURL = supportRelativeURL(source, sourceMappingURL);
      sourceMapData = retrieveFile(sourceMappingURL);
    }
    if (!sourceMapData) {
      return null;
    }
    return {
      url: sourceMappingURL,
      map: sourceMapData
    };
  });
  function mapSourcePosition(position) {
    var sourceMap = sourceMapCache[position.source];
    if (!sourceMap) {
      var urlAndMap = retrieveSourceMap(position.source);
      if (urlAndMap) {
        sourceMap = sourceMapCache[position.source] = {
          url: urlAndMap.url,
          map: new SourceMapConsumer(urlAndMap.map)
        };
        if (sourceMap.map.sourcesContent) {
          sourceMap.map.sources.forEach(function(source, i) {
            var contents = sourceMap.map.sourcesContent[i];
            if (contents) {
              var url = supportRelativeURL(sourceMap.url, source);
              fileContentsCache[url] = contents;
            }
          });
        }
      } else {
        sourceMap = sourceMapCache[position.source] = {
          url: null,
          map: null
        };
      }
    }
    if (sourceMap && sourceMap.map && typeof sourceMap.map.originalPositionFor === "function") {
      var originalPosition = sourceMap.map.originalPositionFor(position);
      if (originalPosition.source !== null) {
        originalPosition.source = supportRelativeURL(sourceMap.url, originalPosition.source);
        return originalPosition;
      }
    }
    return position;
  }
  function mapEvalOrigin(origin) {
    var match = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(origin);
    if (match) {
      var position = mapSourcePosition({
        source: match[2],
        line: +match[3],
        column: match[4] - 1
      });
      return "eval at " + match[1] + " (" + position.source + ":" + position.line + ":" + (position.column + 1) + ")";
    }
    match = /^eval at ([^(]+) \((.+)\)$/.exec(origin);
    if (match) {
      return "eval at " + match[1] + " (" + mapEvalOrigin(match[2]) + ")";
    }
    return origin;
  }
  function CallSiteToString() {
    var fileName;
    var fileLocation = "";
    if (this.isNative()) {
      fileLocation = "native";
    } else {
      fileName = this.getScriptNameOrSourceURL();
      if (!fileName && this.isEval()) {
        fileLocation = this.getEvalOrigin();
        fileLocation += ", ";
      }
      if (fileName) {
        fileLocation += fileName;
      } else {
        fileLocation += "<anonymous>";
      }
      var lineNumber = this.getLineNumber();
      if (lineNumber != null) {
        fileLocation += ":" + lineNumber;
        var columnNumber = this.getColumnNumber();
        if (columnNumber) {
          fileLocation += ":" + columnNumber;
        }
      }
    }
    var line = "";
    var functionName = this.getFunctionName();
    var addSuffix = true;
    var isConstructor = this.isConstructor();
    var isMethodCall = !(this.isToplevel() || isConstructor);
    if (isMethodCall) {
      var typeName = this.getTypeName();
      if (typeName === "[object Object]") {
        typeName = "null";
      }
      var methodName = this.getMethodName();
      if (functionName) {
        if (typeName && functionName.indexOf(typeName) != 0) {
          line += typeName + ".";
        }
        line += functionName;
        if (methodName && functionName.indexOf("." + methodName) != functionName.length - methodName.length - 1) {
          line += " [as " + methodName + "]";
        }
      } else {
        line += typeName + "." + (methodName || "<anonymous>");
      }
    } else if (isConstructor) {
      line += "new " + (functionName || "<anonymous>");
    } else if (functionName) {
      line += functionName;
    } else {
      line += fileLocation;
      addSuffix = false;
    }
    if (addSuffix) {
      line += " (" + fileLocation + ")";
    }
    return line;
  }
  function cloneCallSite(frame) {
    var object = {};
    Object.getOwnPropertyNames(Object.getPrototypeOf(frame)).forEach(function(name) {
      object[name] = /^(?:is|get)/.test(name) ? function() {
        return frame[name].call(frame);
      } : frame[name];
    });
    object.toString = CallSiteToString;
    return object;
  }
  function wrapCallSite(frame, state) {
    if (state === void 0) {
      state = {nextPosition: null, curPosition: null};
    }
    if (frame.isNative()) {
      state.curPosition = null;
      return frame;
    }
    var source = frame.getFileName() || frame.getScriptNameOrSourceURL();
    if (source) {
      var line = frame.getLineNumber();
      var column = frame.getColumnNumber() - 1;
      var noHeader = /^v(10\.1[6-9]|10\.[2-9][0-9]|10\.[0-9]{3,}|1[2-9]\d*|[2-9]\d|\d{3,}|11\.11)/;
      var headerLength = noHeader.test(process.version) ? 0 : 62;
      if (line === 1 && column > headerLength && !isInBrowser() && !frame.isEval()) {
        column -= headerLength;
      }
      var position = mapSourcePosition({
        source,
        line,
        column
      });
      state.curPosition = position;
      frame = cloneCallSite(frame);
      var originalFunctionName = frame.getFunctionName;
      frame.getFunctionName = function() {
        if (state.nextPosition == null) {
          return originalFunctionName();
        }
        return state.nextPosition.name || originalFunctionName();
      };
      frame.getFileName = function() {
        return position.source;
      };
      frame.getLineNumber = function() {
        return position.line;
      };
      frame.getColumnNumber = function() {
        return position.column + 1;
      };
      frame.getScriptNameOrSourceURL = function() {
        return position.source;
      };
      return frame;
    }
    var origin = frame.isEval() && frame.getEvalOrigin();
    if (origin) {
      origin = mapEvalOrigin(origin);
      frame = cloneCallSite(frame);
      frame.getEvalOrigin = function() {
        return origin;
      };
      return frame;
    }
    return frame;
  }
  function prepareStackTrace(error, stack) {
    if (emptyCacheBetweenOperations) {
      fileContentsCache = {};
      sourceMapCache = {};
    }
    var name = error.name || "Error";
    var message = error.message || "";
    var errorString = name + ": " + message;
    var state = {nextPosition: null, curPosition: null};
    var processedStack = [];
    for (var i = stack.length - 1; i >= 0; i--) {
      processedStack.push("\n    at " + wrapCallSite(stack[i], state));
      state.nextPosition = state.curPosition;
    }
    state.curPosition = state.nextPosition = null;
    return errorString + processedStack.reverse().join("");
  }
  function getErrorSource(error) {
    var match = /\n    at [^(]+ \((.*):(\d+):(\d+)\)/.exec(error.stack);
    if (match) {
      var source = match[1];
      var line = +match[2];
      var column = +match[3];
      var contents = fileContentsCache[source];
      if (!contents && fs && fs.existsSync(source)) {
        try {
          contents = fs.readFileSync(source, "utf8");
        } catch (er) {
          contents = "";
        }
      }
      if (contents) {
        var code = contents.split(/(?:\r\n|\r|\n)/)[line - 1];
        if (code) {
          return source + ":" + line + "\n" + code + "\n" + new Array(column).join(" ") + "^";
        }
      }
    }
    return null;
  }
  function printErrorAndExit(error) {
    var source = getErrorSource(error);
    if (process.stderr._handle && process.stderr._handle.setBlocking) {
      process.stderr._handle.setBlocking(true);
    }
    if (source) {
      console.error();
      console.error(source);
    }
    console.error(error.stack);
    process.exit(1);
  }
  function shimEmitUncaughtException() {
    var origEmit = process.emit;
    process.emit = function(type) {
      if (type === "uncaughtException") {
        var hasStack = arguments[1] && arguments[1].stack;
        var hasListeners = this.listeners(type).length > 0;
        if (hasStack && !hasListeners) {
          return printErrorAndExit(arguments[1]);
        }
      }
      return origEmit.apply(this, arguments);
    };
  }
  var originalRetrieveFileHandlers = retrieveFileHandlers.slice(0);
  var originalRetrieveMapHandlers = retrieveMapHandlers.slice(0);
  exports2.wrapCallSite = wrapCallSite;
  exports2.getErrorSource = getErrorSource;
  exports2.mapSourcePosition = mapSourcePosition;
  exports2.retrieveSourceMap = retrieveSourceMap;
  exports2.install = function(options) {
    options = options || {};
    if (options.environment) {
      environment = options.environment;
      if (["node", "browser", "auto"].indexOf(environment) === -1) {
        throw new Error("environment " + environment + " was unknown. Available options are {auto, browser, node}");
      }
    }
    if (options.retrieveFile) {
      if (options.overrideRetrieveFile) {
        retrieveFileHandlers.length = 0;
      }
      retrieveFileHandlers.unshift(options.retrieveFile);
    }
    if (options.retrieveSourceMap) {
      if (options.overrideRetrieveSourceMap) {
        retrieveMapHandlers.length = 0;
      }
      retrieveMapHandlers.unshift(options.retrieveSourceMap);
    }
    if (options.hookRequire && !isInBrowser()) {
      var Module = dynamicRequire(module2, "module");
      var $compile = Module.prototype._compile;
      if (!$compile.__sourceMapSupport) {
        Module.prototype._compile = function(content, filename) {
          fileContentsCache[filename] = content;
          sourceMapCache[filename] = void 0;
          return $compile.call(this, content, filename);
        };
        Module.prototype._compile.__sourceMapSupport = true;
      }
    }
    if (!emptyCacheBetweenOperations) {
      emptyCacheBetweenOperations = "emptyCacheBetweenOperations" in options ? options.emptyCacheBetweenOperations : false;
    }
    if (!errorFormatterInstalled) {
      errorFormatterInstalled = true;
      Error.prepareStackTrace = prepareStackTrace;
    }
    if (!uncaughtShimInstalled) {
      var installHandler = "handleUncaughtExceptions" in options ? options.handleUncaughtExceptions : true;
      try {
        var worker_threads = dynamicRequire(module2, "worker_threads");
        if (worker_threads.isMainThread === false) {
          installHandler = false;
        }
      } catch (e) {
      }
      if (installHandler && hasGlobalProcessEventEmitter()) {
        uncaughtShimInstalled = true;
        shimEmitUncaughtException();
      }
    }
  };
  exports2.resetRetrieveHandlers = function() {
    retrieveFileHandlers.length = 0;
    retrieveMapHandlers.length = 0;
    retrieveFileHandlers = originalRetrieveFileHandlers.slice(0);
    retrieveMapHandlers = originalRetrieveMapHandlers.slice(0);
    retrieveSourceMap = handlerExec(retrieveMapHandlers);
    retrieveFile = handlerExec(retrieveFileHandlers);
  };
});

// node_modules/dynamodb-toolbox/dist/lib/utils.js
var require_utils = __commonJS((exports2) => {
  "use strict";
  /**
   * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
   * @author Jeremy Daly <jeremy@jeremydaly.com>
   * @license MIT
   */
  Object.defineProperty(exports2, "__esModule", {value: true});
  exports2.transformAttr = exports2.conditonError = exports2.keyTypeError = exports2.typeError = exports2.error = exports2.isEmpty = exports2.hasValue = exports2.toBool = exports2.validKeyTypes = exports2.validTypes = void 0;
  exports2.validTypes = ["string", "boolean", "number", "list", "map", "binary", "set"];
  exports2.validKeyTypes = ["string", "number", "binary"];
  var toBool = (val) => typeof val === "boolean" ? val : ["false", "0", "no"].includes(String(val).toLowerCase()) ? false : Boolean(val);
  exports2.toBool = toBool;
  var hasValue = (val) => val !== void 0 && val !== null;
  exports2.hasValue = hasValue;
  var isEmpty = (val) => val === void 0 || typeof val === "object" && Object.keys(val).length === 0;
  exports2.isEmpty = isEmpty;
  var error = (err) => {
    throw new Error(err);
  };
  exports2.error = error;
  var typeError = (field) => {
    exports2.error(`Invalid or missing type for '${field}'. Valid types are '${exports2.validTypes.slice(0, -1).join(`', '`)}', and '${exports2.validTypes.slice(-1)}'.`);
  };
  exports2.typeError = typeError;
  var keyTypeError = (field) => {
    exports2.error(`Invalid or missing type for '${field}'. Valid types for partitionKey and sortKey are 'string','number' and 'binary'`);
  };
  exports2.keyTypeError = keyTypeError;
  var conditonError = (op) => exports2.error(`You can only supply one sortKey condition per query. Already using '${op}'`);
  exports2.conditonError = conditonError;
  var transformAttr = (mapping, value, data) => {
    value = mapping.transform ? mapping.transform(value, data) : value;
    return mapping.prefix || mapping.suffix ? `${mapping.prefix || ""}${value}${mapping.suffix || ""}` : value;
  };
  exports2.transformAttr = transformAttr;
});

// node_modules/dynamodb-toolbox/dist/lib/parseMapping.js
var require_parseMapping = __commonJS((exports2) => {
  "use strict";
  /**
   * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
   * @author Jeremy Daly <jeremy@jeremydaly.com>
   * @license MIT
   */
  var __rest = exports2 && exports2.__rest || function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
  Object.defineProperty(exports2, "__esModule", {value: true});
  var utils_1 = require_utils();
  exports2.default = (field, config, track) => {
    Object.keys(config).forEach((prop) => {
      switch (prop) {
        case "type":
        case "default":
          break;
        case "dependsOn":
          if (typeof config[prop] !== "string" && !Array.isArray(config[prop]))
            utils_1.error(`'dependsOn' must be the string name of an attribute or alias`);
          break;
        case "transform":
          if (typeof config[prop] !== "function")
            utils_1.error(`'${prop}' must be a function`);
          break;
        case "coerce":
        case "onUpdate":
        case "hidden":
        case "save":
          if (typeof config[prop] !== "boolean")
            utils_1.error(`'${prop}' must be a boolean`);
          break;
        case "required":
          if (typeof config[prop] !== "boolean" && config[prop] !== "always")
            utils_1.error(`'required' must be a boolean or set to 'always'`);
          break;
        case "alias":
        case "map":
          if (typeof config[prop] !== "string" || track.fields.includes((config[prop] || "").trim()) || (config[prop] || "").trim().length === 0)
            utils_1.error(`'${prop}' must be a unique string`);
          break;
        case "setType":
          if (config.type !== "set")
            utils_1.error(`'setType' is only valid for type 'set'`);
          if (!["string", "number", "binary"].includes(config[prop] || ""))
            utils_1.error(`Invalid 'setType', must be 'string', 'number', or 'binary'`);
          break;
        case "delimiter":
          if (typeof config[prop] !== "string" || (config[prop] || "").trim().length === 0)
            utils_1.error(`'delimiter' must be a 'string'`);
          config[prop] = (config[prop] || "").trim();
          break;
        case "prefix":
        case "suffix":
          if (config.type && config.type !== "string")
            utils_1.error(`'${prop}' can only be used on 'string' types`);
          if (typeof config[prop] !== "string" || (config[prop] || "").trim().length === 0)
            utils_1.error(`'${prop}' must be a 'string'`);
          break;
        case "partitionKey":
        case "sortKey":
          if (config.map || config.alias)
            utils_1.error(`Attributes with a ${prop} cannot have a 'map' or 'alias' associated`);
          if (typeof config[prop] === "boolean" || typeof config[prop] === "string" || Array.isArray(config[prop])) {
            const indexes = Array.isArray(config[prop]) ? config[prop] : [config[prop]];
            for (let i in indexes) {
              if (typeof indexes[i] === "boolean") {
                if (track.keys[prop])
                  utils_1.error(`'${track.keys[prop]}' has already been declared as the ${prop}`);
                if (indexes[i])
                  track.keys[prop] = field;
                if (track.keys.partitionKey && track.keys.partitionKey === track.keys.sortKey)
                  utils_1.error(`'${field}' attribute cannot be both the partitionKey and sortKey`);
              } else if (typeof indexes[i] === "string") {
                const index = indexes[i];
                if (!track.keys[index])
                  track.keys[index] = {};
                if (track.keys[index][prop]) {
                  utils_1.error(`'${track.keys[index][prop]}' has already been declared as the ${prop} for the ${index} index`);
                }
                track.keys[index][prop] = field;
                if (track.keys[index].partitionKey === track.keys[index].sortKey)
                  utils_1.error(`'${field}' attribute cannot be both the partitionKey and sortKey for the ${index} index`);
              } else {
                utils_1.error(`Index assignments for '${field}' must be string or boolean values`);
              }
            }
          } else {
            utils_1.error(`'${prop}' must be a boolean, string, or array`);
          }
          break;
        default:
          utils_1.error(`'${prop}' is not a valid property type`);
      }
    });
    if (config.alias && config.map)
      utils_1.error(`'${field}' cannot contain both an alias and a map`);
    if (!config.type)
      config.type = "string";
    if (["string", "boolean", "number"].includes(config.type) && typeof config.coerce === "undefined")
      config.coerce = true;
    if (config.default !== void 0)
      track.defaults[field] = config.default;
    if (config.required === true)
      track.required[config.map || field] = false;
    if (config.required === "always")
      track.required[config.map || field] = true;
    const {map, alias} = config, _config = __rest(config, ["map", "alias"]);
    return Object.assign({
      [field]: config
    }, alias ? {
      [alias]: Object.assign({}, _config, {map: field})
    } : {}, map ? {
      [map]: Object.assign({}, _config, {alias: field})
    } : {});
  };
});

// node_modules/dynamodb-toolbox/dist/lib/parseCompositeKey.js
var require_parseCompositeKey = __commonJS((exports2) => {
  "use strict";
  /**
   * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
   * @author Jeremy Daly <jeremy@jeremydaly.com>
   * @license MIT
   */
  var __importDefault = exports2 && exports2.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports2, "__esModule", {value: true});
  var utils_1 = require_utils();
  var parseMapping_1 = __importDefault(require_parseMapping());
  exports2.default = (field, config, track, schema) => {
    if (config.length >= 2 && config.length <= 3) {
      let link = schema[config[0]] ? config[0] : utils_1.error(`'${field}' must reference another field`);
      let pos = parseInt(config[1].toString()) === config[1] ? config[1] : utils_1.error(`'${field}' position value must be numeric`);
      let sub_config = !config[2] ? {type: "string"} : ["string", "number", "boolean"].includes(config[2].toString()) ? {type: config[2]} : typeof config[2] === "object" && !Array.isArray(config[2]) ? config[2] : utils_1.error(`'${field}' type must be 'string', 'number', 'boolean' or a configuration object`);
      if (!track.linked[link])
        track.linked[link] = [];
      track.linked[link][pos] = field;
      return Object.assign({
        [field]: Object.assign({save: true}, parseMapping_1.default(field, sub_config, track)[field], {link, pos})
      }, sub_config.alias ? {
        [sub_config.alias]: Object.assign({}, sub_config, {map: field})
      } : {});
    } else {
      utils_1.error(`Composite key configurations must have 2 or 3 items`);
    }
  };
});

// node_modules/dynamodb-toolbox/dist/lib/parseEntityAttributes.js
var require_parseEntityAttributes = __commonJS((exports2) => {
  "use strict";
  /**
   * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
   * @author Jeremy Daly <jeremy@jeremydaly.com>
   * @license MIT
   */
  var __importDefault = exports2 && exports2.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports2, "__esModule", {value: true});
  var parseMapping_1 = __importDefault(require_parseMapping());
  var parseCompositeKey_1 = __importDefault(require_parseCompositeKey());
  var utils_1 = require_utils();
  exports2.default = (attributes, track) => {
    attributes = Object.keys(attributes).reduce((acc, field) => {
      if (typeof attributes[field] === "string") {
        if (!utils_1.validTypes.includes(attributes[field].toString())) {
          utils_1.typeError(field);
        }
        return Object.assign(acc, parseMapping_1.default(field, {type: attributes[field]}, track));
      } else if (Array.isArray(attributes[field])) {
        return Object.assign(acc, parseCompositeKey_1.default(field, attributes[field], track, attributes));
      } else {
        const fieldVal = attributes[field];
        fieldVal.type = !fieldVal.type ? "string" : fieldVal.type;
        if (!utils_1.validTypes.includes(fieldVal.type)) {
          utils_1.typeError(field);
        }
        return Object.assign(acc, parseMapping_1.default(field, fieldVal, track));
      }
    }, {});
    if (!track.keys.partitionKey)
      utils_1.error("Entity requires a partitionKey attribute");
    return {
      keys: track.keys,
      attributes
    };
  };
});

// node_modules/dynamodb-toolbox/dist/lib/parseEntity.js
var require_parseEntity = __commonJS((exports2) => {
  "use strict";
  /**
   * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
   * @author Jeremy Daly <jeremy@jeremydaly.com>
   * @license MIT
   */
  var __rest = exports2 && exports2.__rest || function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
  var __importDefault = exports2 && exports2.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports2, "__esModule", {value: true});
  exports2.parseEntity = void 0;
  var parseEntityAttributes_1 = __importDefault(require_parseEntityAttributes());
  var utils_1 = require_utils();
  function parseEntity(entity) {
    let {name, timestamps, created, createdAlias, modified, modifiedAlias, typeAlias, attributes, autoExecute, autoParse, table: table2} = entity, args = __rest(entity, ["name", "timestamps", "created", "createdAlias", "modified", "modifiedAlias", "typeAlias", "attributes", "autoExecute", "autoParse", "table"]);
    if (Object.keys(args).length > 0)
      utils_1.error(`Invalid Entity configuration options: ${Object.keys(args).join(", ")}`);
    name = typeof name === "string" && name.trim().length > 0 ? name.trim() : utils_1.error(`'name' must be defined`);
    timestamps = typeof timestamps === "boolean" ? timestamps : true;
    created = typeof created === "string" && created.trim().length > 0 ? created.trim() : "_ct";
    createdAlias = typeof createdAlias === "string" && createdAlias.trim().length > 0 ? createdAlias.trim() : "created";
    modified = typeof modified === "string" && modified.trim().length > 0 ? modified.trim() : "_md";
    modifiedAlias = typeof modifiedAlias === "string" && modifiedAlias.trim().length > 0 ? modifiedAlias.trim() : "modified";
    typeAlias = typeof typeAlias === "string" && typeAlias.trim().length > 0 ? typeAlias.trim() : "entity";
    attributes = typeof attributes === "object" && !Array.isArray(attributes) ? attributes : utils_1.error(`Please provide a valid 'attributes' object`);
    if (timestamps) {
      attributes[created] = {type: "string", alias: createdAlias, default: () => new Date().toISOString()};
      attributes[modified] = {type: "string", alias: modifiedAlias, default: () => new Date().toISOString(), onUpdate: true};
    }
    let track = {
      fields: Object.keys(attributes),
      defaults: {},
      required: {},
      linked: {},
      keys: {}
    };
    return Object.assign({
      name,
      schema: parseEntityAttributes_1.default(attributes, track),
      defaults: track.defaults,
      required: track.required,
      linked: track.linked,
      autoExecute,
      autoParse,
      _etAlias: typeAlias
    }, table2 ? {table: table2} : {});
  }
  exports2.parseEntity = parseEntity;
  exports2.default = parseEntity;
});

// node_modules/dynamodb-toolbox/dist/lib/validateTypes.js
var require_validateTypes = __commonJS((exports2) => {
  "use strict";
  /**
   * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
   * @author Jeremy Daly <jeremy@jeremydaly.com>
   * @license MIT
   */
  Object.defineProperty(exports2, "__esModule", {value: true});
  var utils_1 = require_utils();
  exports2.default = (DocumentClient2) => (mapping, field, value) => {
    if (!utils_1.hasValue(value))
      return value;
    switch (mapping.type) {
      case "string":
        return typeof value === "string" || mapping.coerce ? String(value) : utils_1.error(`'${field}' must be of type string`);
      case "boolean":
        return typeof value === "boolean" || mapping.coerce ? utils_1.toBool(value) : utils_1.error(`'${field}' must be of type boolean`);
      case "number":
        return typeof value === "number" || mapping.coerce ? String(parseInt(value)) === String(value) ? parseInt(value) : String(parseFloat(value)) === String(value) ? parseFloat(value) : utils_1.error(`Could not convert '${value}' to a number for '${field}'`) : utils_1.error(`'${field}' must be of type number`);
      case "list":
        return Array.isArray(value) ? value : mapping.coerce ? String(value).split(",").map((x) => x.trim()) : utils_1.error(`'${field}' must be a list (array)`);
      case "map":
        return typeof value === "object" && !Array.isArray(value) ? value : utils_1.error(`'${field}' must be a map (object)`);
      case "set":
        if (Array.isArray(value)) {
          if (!DocumentClient2)
            utils_1.error("DocumentClient required for this operation");
          let set = DocumentClient2.createSet(value, {validate: true});
          return !mapping.setType || mapping.setType === set.type.toLowerCase() ? set : utils_1.error(`'${field}' must be a valid set (array) containing only ${mapping.setType} types`);
        } else if (mapping.coerce) {
          if (!DocumentClient2)
            utils_1.error("DocumentClient required for this operation");
          let set = DocumentClient2.createSet(String(value).split(",").map((x) => x.trim()));
          return !mapping.setType || mapping.setType === set.type.toLowerCase() ? set : utils_1.error(`'${field}' must be a valid set (array) of type ${mapping.setType}`);
        } else {
          return utils_1.error(`'${field}' must be a valid set (array)`);
        }
      default:
        return value;
    }
  };
});

// node_modules/dynamodb-toolbox/dist/lib/normalizeData.js
var require_normalizeData = __commonJS((exports2) => {
  "use strict";
  /**
   * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
   * @author Jeremy Daly <jeremy@jeremydaly.com>
   * @license MIT
   */
  var __importDefault = exports2 && exports2.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports2, "__esModule", {value: true});
  var validateTypes_1 = __importDefault(require_validateTypes());
  var utils_1 = require_utils();
  exports2.default = (DocumentClient2) => (schema, linked, data, filter = false) => {
    const validateType = validateTypes_1.default(DocumentClient2);
    const dependsOn = (map, attr) => {
      if (schema[attr].dependsOn) {
        (Array.isArray(schema[attr].dependsOn) ? schema[attr].dependsOn : [schema[attr].dependsOn]).forEach((dependent) => {
          if (schema[dependent]) {
            if (typeof map[dependent] === "function") {
              map = dependsOn(map, dependent);
            }
          } else {
            utils_1.error(`'${dependent}' is not a valid attribute or alias name`);
          }
        });
        map[attr] = map[attr](map);
        return map;
      } else {
        try {
          map[attr] = map[attr](map);
          if (schema[attr].alias)
            map[schema[attr].alias] = map[attr];
          if (schema[attr].map)
            map[schema[attr].map] = map[attr];
        } catch (e) {
        }
        return map;
      }
    };
    let dataMap = Object.keys(data).reduce((acc, field) => {
      return Object.assign(acc, schema[field] ? {
        data: Object.assign(Object.assign({}, acc.data), {[schema[field].map || field]: data[field]}),
        aliases: Object.assign(Object.assign({}, acc.aliases), {[schema[field].alias || field]: data[field]})
      } : filter ? {} : field === "$remove" ? {data: Object.assign(Object.assign({}, acc.data), {$remove: data[field]})} : utils_1.error(`Field '${field}' does not have a mapping or alias`));
    }, {data: {}, aliases: {}});
    let defaultMap = Object.assign(Object.assign({}, dataMap.data), dataMap.aliases);
    const defaults = Object.keys(defaultMap).reduce((acc, attr) => {
      if (typeof defaultMap[attr] === "function") {
        let map = dependsOn(defaultMap, attr);
        defaultMap = map;
      }
      return Object.assign(acc, {[attr]: defaultMap[attr]});
    }, {});
    let _data = Object.keys(dataMap.data).reduce((acc, field) => {
      return Object.assign(acc, {
        [field]: defaults[field]
      });
    }, {});
    let composites = Object.keys(linked).reduce((acc, attr) => {
      const field = schema[attr] && schema[attr].map || attr;
      if (_data[field] !== void 0)
        return acc;
      let values = linked[attr].map((f) => {
        if (_data[f] === void 0) {
          return null;
        }
        return utils_1.transformAttr(schema[f], validateType(schema[f], f, _data[f]), _data);
      }).filter((x) => x !== null);
      if (values.length === linked[attr].length) {
        return Object.assign(acc, {
          [field]: values.join(schema[attr].delimiter || "#")
        });
      } else {
        return acc;
      }
    }, {});
    return Object.assign(composites, _data);
  };
});

// node_modules/dynamodb-toolbox/dist/lib/formatItem.js
var require_formatItem = __commonJS((exports2) => {
  "use strict";
  /**
   * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
   * @author Jeremy Daly <jeremy@jeremydaly.com>
   * @license MIT
   */
  var __importDefault = exports2 && exports2.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports2, "__esModule", {value: true});
  var validateTypes_1 = __importDefault(require_validateTypes());
  exports2.default = (DocumentClient2) => (attributes, linked, item, include = []) => {
    const validateType = validateTypes_1.default(DocumentClient2);
    return Object.keys(item).reduce((acc, field) => {
      const link = linked[field] || attributes[field] && attributes[field].alias && linked[attributes[field].alias];
      if (link) {
        Object.assign(acc, link.reduce((acc2, f, i) => {
          if (attributes[f].save || attributes[f].hidden || include.length > 0 && !include.includes(f))
            return acc2;
          return Object.assign(acc2, {
            [attributes[f].alias || f]: validateType(attributes[f], f, item[field].replace(new RegExp(`^${escapeRegExp(attributes[field].prefix)}`), "").replace(new RegExp(`${escapeRegExp(attributes[field].suffix)}$`), "").split(attributes[field].delimiter || "#")[i])
          });
        }, {}));
      }
      if (attributes[field] && attributes[field].hidden || include.length > 0 && !include.includes(field))
        return acc;
      if (attributes[field] && attributes[field].type === "set" && Array.isArray(item[field].values)) {
        item[field] = item[field].values;
      }
      return Object.assign(acc, {
        [attributes[field] && attributes[field].alias || field]: attributes[field] && (attributes[field].prefix || attributes[field].suffix) ? item[field].replace(new RegExp(`^${escapeRegExp(attributes[field].prefix)}`), "").replace(new RegExp(`${escapeRegExp(attributes[field].suffix)}$`), "") : item[field]
      });
    }, {});
  };
  function escapeRegExp(text) {
    return text ? text.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&") : "";
  }
});

// node_modules/dynamodb-toolbox/dist/lib/getKey.js
var require_getKey = __commonJS((exports2) => {
  "use strict";
  /**
   * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
   * @author Jeremy Daly <jeremy@jeremydaly.com>
   * @license MIT
   */
  var __importDefault = exports2 && exports2.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports2, "__esModule", {value: true});
  var validateTypes_1 = __importDefault(require_validateTypes());
  var utils_1 = require_utils();
  exports2.default = (DocumentClient2) => (data, schema, partitionKey, sortKey) => {
    partitionKey = schema[partitionKey].map || partitionKey;
    sortKey = schema[sortKey] && schema[sortKey].map || sortKey || null;
    let validateType = validateTypes_1.default(DocumentClient2);
    let pk = data[partitionKey];
    if (pk === void 0 || pk === null || pk === "") {
      utils_1.error(`'${partitionKey}'${schema[partitionKey].alias ? ` or '${schema[partitionKey].alias}'` : ""} is required`);
    }
    const sk = data[sortKey];
    if (sortKey && (sk === void 0 || sk === null || sk === "")) {
      utils_1.error(`'${sortKey}'${schema[sortKey].alias ? ` or '${schema[sortKey].alias}'` : ""} is required`);
    }
    return Object.assign({[partitionKey]: utils_1.transformAttr(schema[partitionKey], validateType(schema[partitionKey], partitionKey, pk), data)}, sortKey !== null ? {[sortKey]: utils_1.transformAttr(schema[sortKey], validateType(schema[sortKey], sortKey, sk), data)} : {});
  };
});

// node_modules/dynamodb-toolbox/dist/lib/checkAttribute.js
var require_checkAttribute = __commonJS((exports2) => {
  "use strict";
  /**
   * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
   * @author Jeremy Daly <jeremy@jeremydaly.com>
   * @license MIT
   */
  Object.defineProperty(exports2, "__esModule", {value: true});
  var utils_1 = require_utils();
  exports2.default = (attr, attrs) => {
    const path = attr.split(".");
    const list = path[0].split("[");
    if (list[0] in attrs) {
      path[0] = (attrs[list[0]].map ? attrs[list[0]].map : list[0]) + (list.length > 1 ? `[${list.slice(1).join("[")}` : "");
      return path.join(".");
    } else {
      return utils_1.error(`'${attr}' is not a valid attribute.`);
    }
  };
});

// node_modules/dynamodb-toolbox/dist/lib/expressionBuilder.js
var require_expressionBuilder = __commonJS((exports2) => {
  "use strict";
  /**
   * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
   * @author Jeremy Daly <jeremy@jeremydaly.com>
   * @license MIT
   */
  var __rest = exports2 && exports2.__rest || function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
  var __importDefault = exports2 && exports2.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports2, "__esModule", {value: true});
  var utils_1 = require_utils();
  var checkAttribute_1 = __importDefault(require_checkAttribute());
  var buildExpression = (exp, table2, entity, group = 0, level = 0) => {
    const clauses = Array.isArray(exp) ? exp : [exp];
    let expression = "";
    let names = {};
    let values = {};
    let logic;
    clauses.forEach((x, id) => {
      if (Array.isArray(clauses[id])) {
        let sub = buildExpression(clauses[id], table2, entity, group, level);
        logic = logic ? logic : sub.logic;
        expression += `${id > 0 ? ` ${sub.logic} ` : ""}(${sub.expression})`;
        names = Object.assign(names, sub.names);
        values = Object.assign(values, sub.values);
        group = sub.group;
      } else {
        const exp2 = clauses[id];
        group++;
        if (entity && !exp2.entity)
          exp2.entity = entity;
        const clause = parseClause(exp2, group, table2);
        expression += `${id > 0 ? ` ${clause.logic} ` : ""}${clause.clause}`;
        names = Object.assign(names, clause.names);
        values = Object.assign(values, clause.values);
        logic = logic ? logic : clause.logic;
      }
    });
    return {
      logic,
      expression,
      names,
      values,
      group
    };
  };
  exports2.default = buildExpression;
  var conditionError = (op) => utils_1.error(`You can only supply one filter condition per query. Already using '${op}'`);
  var parseClause = (_clause, grp, table2) => {
    let clause = "";
    const names = {};
    const values = {};
    const {
      attr,
      size,
      negate,
      or,
      eq,
      ne,
      in: _in,
      lt,
      lte,
      gt,
      gte,
      between,
      exists,
      contains,
      beginsWith,
      type,
      entity
    } = _clause, args = __rest(_clause, ["attr", "size", "negate", "or", "eq", "ne", "in", "lt", "lte", "gt", "gte", "between", "exists", "contains", "beginsWith", "type", "entity"]);
    if (Object.keys(args).length > 0)
      utils_1.error(`Invalid expression options: ${Object.keys(args).join(", ")}`);
    if (entity !== void 0 && (typeof entity !== "string" || (!table2[entity] || !table2[entity].schema || !table2[entity].schema.attributes)))
      utils_1.error(`'entity' value of '${entity}' must be a string and a valid table Entity name`);
    names[`#attr${grp}`] = typeof attr === "string" ? checkAttribute_1.default(attr, entity ? table2[entity].schema.attributes : table2.Table.attributes) : typeof size === "string" ? checkAttribute_1.default(size, entity ? table2[entity].schema.attributes : table2.Table.attributes) : utils_1.error(`A string for 'attr' or 'size' is required for condition expressions`);
    let operator, value, f;
    if (eq !== void 0) {
      value = eq;
      f = "eq";
      operator = "=";
    }
    if (ne !== void 0) {
      value = value ? conditionError(f) : ne;
      f = "ne";
      operator = "<>";
    }
    if (_in) {
      value = value ? conditionError(f) : _in;
      f = "in";
      operator = "IN";
    }
    if (lt !== void 0) {
      value = value ? conditionError(f) : lt;
      f = "lt";
      operator = "<";
    }
    if (lte !== void 0) {
      value = value ? conditionError(f) : lte;
      f = "lte";
      operator = "<=";
    }
    if (gt !== void 0) {
      value = value ? conditionError(f) : gt;
      f = "gt";
      operator = ">";
    }
    if (gte !== void 0) {
      value = value ? conditionError(f) : gte;
      f = "gte";
      operator = ">=";
    }
    if (between) {
      value = value ? conditionError(f) : between;
      f = "between";
      operator = "BETWEEN";
    }
    if (exists !== void 0) {
      value = value ? conditionError(f) : exists;
      f = "exists";
      operator = "EXISTS";
    }
    if (contains) {
      value = value ? conditionError(f) : contains;
      f = "contains";
      operator = "CONTAINS";
    }
    if (beginsWith) {
      value = value ? conditionError(f) : beginsWith;
      f = "beginsWith";
      operator = "BEGINS_WITH";
    }
    if (type) {
      value = value ? conditionError(f) : type;
      f = "type";
      operator = "ATTRIBUTE_TYPE";
    }
    if (operator) {
      if (operator === "BETWEEN") {
        if (Array.isArray(value) && value.length === 2) {
          values[`:attr${grp}_0`] = value[0];
          values[`:attr${grp}_1`] = value[1];
          clause = `${size ? `size(#attr${grp})` : `#attr${grp}`} between :attr${grp}_0 and :attr${grp}_1`;
        } else {
          utils_1.error(`'between' conditions require an array with two values.`);
        }
      } else if (operator === "IN") {
        if (!attr)
          utils_1.error(`'in' conditions require an 'attr'.`);
        if (Array.isArray(value)) {
          clause = `#attr${grp} IN (${value.map((x, i) => {
            values[`:attr${grp}_${i}`] = x;
            return `:attr${grp}_${i}`;
          }).join(",")})`;
        } else {
          utils_1.error(`'in' conditions require an array.`);
        }
      } else if (operator === "EXISTS") {
        if (!attr)
          utils_1.error(`'exists' conditions require an 'attr'.`);
        clause = value ? `attribute_exists(#attr${grp})` : `attribute_not_exists(#attr${grp})`;
      } else {
        values[`:attr${grp}`] = value;
        if (operator === "BEGINS_WITH") {
          if (!attr)
            utils_1.error(`'beginsWith' conditions require an 'attr'.`);
          clause = `begins_with(#attr${grp},:attr${grp})`;
        } else if (operator === "CONTAINS") {
          if (!attr)
            utils_1.error(`'contains' conditions require an 'attr'.`);
          clause = `contains(#attr${grp},:attr${grp})`;
        } else if (operator === "ATTRIBUTE_TYPE") {
          if (!attr)
            utils_1.error(`'type' conditions require an 'attr'.`);
          clause = `attribute_type(#attr${grp},:attr${grp})`;
        } else {
          clause = `${size ? `size(#attr${grp})` : `#attr${grp}`} ${operator} :attr${grp}`;
        }
      }
      if (negate) {
        clause = `(NOT ${clause})`;
      }
    } else {
      utils_1.error("A condition is required");
    }
    return {
      logic: or ? "OR" : "AND",
      clause,
      names,
      values
    };
  };
});

// node_modules/dynamodb-toolbox/dist/lib/projectionBuilder.js
var require_projectionBuilder = __commonJS((exports2) => {
  "use strict";
  /**
   * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
   * @author Jeremy Daly <jeremy@jeremydaly.com>
   * @license MIT
   */
  var __importDefault = exports2 && exports2.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports2, "__esModule", {value: true});
  var utils_1 = require_utils();
  var checkAttribute_1 = __importDefault(require_checkAttribute());
  exports2.default = (attributes, table2, entity, type = false) => {
    let index = 0;
    const attrs = Array.isArray(attributes) ? attributes : typeof attributes === "string" ? attributes.split(",").map((x) => x.trim()) : [attributes];
    if (!table2 || !table2.Table || Object.keys(table2.Table.attributes).length == 0) {
      utils_1.error(`Tables must be valid and contain attributes`);
    }
    if (type && table2.Table.entityField)
      attrs.push(table2.Table.entityField);
    let names = {};
    let tableAttrs = [];
    let entities = {};
    for (const attribute of attrs) {
      if (typeof attribute === "string") {
        const attr = checkAttribute_1.default(attribute, entity ? table2[entity].schema.attributes : table2.Table.attributes);
        if (!Object.values(names).includes(attr)) {
          names[`#proj${++index}`] = attr;
          tableAttrs.push(attribute);
        }
      } else if (typeof attribute === "object") {
        for (const entity2 in attribute) {
          if (table2[entity2]) {
            if (!entities[entity2])
              entities[entity2] = [];
            const ent_attrs = Array.isArray(attribute[entity2]) ? attribute[entity2] : typeof attribute[entity2] === "string" ? String(attribute[entity2]).split(",").map((x) => x.trim()) : utils_1.error(`Only arrays or strings are supported`);
            for (const ent_attribute of ent_attrs) {
              if (typeof ent_attribute != "string")
                utils_1.error(`Entity projections must be string values`);
              const attr = checkAttribute_1.default(ent_attribute, table2[entity2].schema.attributes);
              if (!Object.values(names).includes(attr)) {
                names[`#proj${++index}`] = attr;
              }
              entities[entity2].push(attr);
            }
          } else {
            utils_1.error(`'${entity2}' is not a valid entity on this table`);
          }
        }
      } else {
        utils_1.error(`'${typeof attribute}' is an invalid type. Projections require strings or arrays`);
      }
    }
    return {
      names,
      projections: Object.keys(names).join(","),
      entities: Object.keys(entities).reduce((acc, ent) => {
        return Object.assign(acc, {[ent]: [...new Set([...entities[ent], ...tableAttrs])]});
      }, {}),
      tableAttrs
    };
  };
});

// node_modules/dynamodb-toolbox/dist/classes/Entity.js
var require_Entity = __commonJS((exports2) => {
  "use strict";
  /**
   * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
   * @author Jeremy Daly <jeremy@jeremydaly.com>
   * @license MIT
   */
  var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __rest = exports2 && exports2.__rest || function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
  var __importDefault = exports2 && exports2.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports2, "__esModule", {value: true});
  var parseEntity_1 = __importDefault(require_parseEntity());
  var validateTypes_1 = __importDefault(require_validateTypes());
  var normalizeData_1 = __importDefault(require_normalizeData());
  var formatItem_1 = __importDefault(require_formatItem());
  var getKey_1 = __importDefault(require_getKey());
  var expressionBuilder_1 = __importDefault(require_expressionBuilder());
  var projectionBuilder_1 = __importDefault(require_projectionBuilder());
  var utils_1 = require_utils();
  var Entity2 = class {
    constructor(entity) {
      if (typeof entity !== "object" || Array.isArray(entity))
        utils_1.error("Please provide a valid entity definition");
      Object.assign(this, parseEntity_1.default(entity));
    }
    set table(table2) {
      if (table2.Table && table2.Table.attributes) {
        if (this._table) {
          utils_1.error(`This entity is already assigned a Table (${this._table.name})`);
        } else if (!table2.entities.includes(this.name)) {
          table2.addEntity(this);
        }
        this._table = table2;
        if (table2.Table.entityField) {
          this.schema.attributes[table2.Table.entityField] = {type: "string", alias: this._etAlias, default: this.name};
          this.defaults[table2.Table.entityField] = this.name;
          this.schema.attributes[this._etAlias] = {type: "string", map: table2.Table.entityField, default: this.name};
          this.defaults[this._etAlias] = this.name;
        }
      } else {
        utils_1.error("Invalid Table");
      }
    }
    get table() {
      if (this._table) {
        return this._table;
      } else {
        return utils_1.error(`The '${this.name}' entity must be attached to a Table to perform this operation`);
      }
    }
    get DocumentClient() {
      if (this.table.DocumentClient) {
        return this.table.DocumentClient;
      } else {
        return utils_1.error("DocumentClient required for this operation");
      }
    }
    set autoExecute(val) {
      this._execute = typeof val === "boolean" ? val : void 0;
    }
    get autoExecute() {
      return typeof this._execute === "boolean" ? this._execute : typeof this.table.autoExecute === "boolean" ? this.table.autoExecute : true;
    }
    set autoParse(val) {
      this._parse = typeof val === "boolean" ? val : void 0;
    }
    get autoParse() {
      return typeof this._parse === "boolean" ? this._parse : typeof this.table.autoParse === "boolean" ? this.table.autoParse : true;
    }
    get partitionKey() {
      return this.schema.keys.partitionKey ? this.attribute(this.schema.keys.partitionKey) : utils_1.error(`No partitionKey defined`);
    }
    get sortKey() {
      return this.schema.keys.sortKey ? this.attribute(this.schema.keys.sortKey) : null;
    }
    attribute(attr) {
      return this.schema.attributes[attr] && this.schema.attributes[attr].map ? this.schema.attributes[attr].map : this.schema.attributes[attr] ? attr : utils_1.error(`'${attr}' does not exist or is an invalid alias`);
    }
    parse(input, include = []) {
      include = include.map((attr) => {
        const _attr = attr.split(".")[0].split("[")[0];
        return this.schema.attributes[_attr] && this.schema.attributes[_attr].map || _attr;
      });
      const {schema, linked} = this;
      const data = input.Item || input.Items || input;
      if (Array.isArray(data)) {
        return data.map((item) => formatItem_1.default(this.DocumentClient)(schema.attributes, linked, item, include));
      } else {
        return formatItem_1.default(this.DocumentClient)(schema.attributes, linked, data, include);
      }
    }
    get(item = {}, options = {}, params = {}) {
      return __awaiter(this, void 0, void 0, function* () {
        const payload = this.getParams(item, options, params);
        if (options.execute || this.autoExecute && options.execute !== false) {
          const result = yield this.DocumentClient.get(payload).promise();
          if (options.parse || this.autoParse && options.parse !== false) {
            return Object.assign(result, result.Item ? {Item: this.parse(result.Item, Array.isArray(options.include) ? options.include : [])} : null);
          } else {
            return result;
          }
        } else {
          return payload;
        }
      });
    }
    getBatch(item = {}) {
      return {
        Table: this.table,
        Key: this.getParams(item).Key
      };
    }
    getTransaction(item = {}, options = {}) {
      const {attributes} = options, args = __rest(options, ["attributes"]);
      if (Object.keys(args).length > 0)
        utils_1.error(`Invalid get transaction options: ${Object.keys(args).join(", ")}`);
      let payload = this.getParams(item, options);
      return {
        Entity: this,
        Get: payload
      };
    }
    getParams(item = {}, options = {}, params = {}) {
      const {schema, defaults, linked, _table} = this;
      const data = normalizeData_1.default(this.DocumentClient)(schema.attributes, linked, Object.assign({}, defaults, item), true);
      const {
        consistent,
        capacity,
        attributes
      } = options, _args = __rest(options, ["consistent", "capacity", "attributes"]);
      const args = Object.keys(_args).filter((x) => !["execute", "parse"].includes(x));
      if (args.length > 0)
        utils_1.error(`Invalid get options: ${args.join(", ")}`);
      if (consistent !== void 0 && typeof consistent !== "boolean")
        utils_1.error(`'consistent' requires a boolean`);
      if (capacity !== void 0 && (typeof capacity !== "string" || !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase())))
        utils_1.error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
      let ExpressionAttributeNames;
      let ProjectionExpression;
      if (attributes) {
        const {names, projections} = projectionBuilder_1.default(attributes, this.table, this.name);
        if (Object.keys(names).length > 0) {
          ExpressionAttributeNames = names;
          ProjectionExpression = projections;
        }
      }
      const payload = Object.assign({
        TableName: _table.name,
        Key: getKey_1.default(this.DocumentClient)(data, schema.attributes, schema.keys.partitionKey, schema.keys.sortKey)
      }, ExpressionAttributeNames ? {ExpressionAttributeNames} : null, ProjectionExpression ? {ProjectionExpression} : null, consistent ? {ConsistentRead: consistent} : null, capacity ? {ReturnConsumedCapacity: capacity.toUpperCase()} : null, typeof params === "object" ? params : {});
      return payload;
    }
    delete(item = {}, options = {}, params = {}) {
      return __awaiter(this, void 0, void 0, function* () {
        const payload = this.deleteParams(item, options, params);
        if (options.execute || this.autoExecute && options.execute !== false) {
          const result = yield this.DocumentClient.delete(payload).promise();
          if (options.parse || this.autoParse && options.parse !== false) {
            return Object.assign(result, result.Attributes ? {Attributes: this.parse(result.Attributes, Array.isArray(options.include) ? options.include : [])} : null);
          } else {
            return result;
          }
        } else {
          return payload;
        }
      });
    }
    deleteBatch(item = {}) {
      const payload = this.deleteParams(item);
      return {[payload.TableName]: {DeleteRequest: {Key: payload.Key}}};
    }
    deleteTransaction(item = {}, options = {}) {
      const {
        conditions,
        returnValues
      } = options, args = __rest(options, ["conditions", "returnValues"]);
      if (Object.keys(args).length > 0)
        utils_1.error(`Invalid delete transaction options: ${Object.keys(args).join(", ")}`);
      let payload = this.deleteParams(item, options);
      if ("ReturnValues" in payload) {
        let {ReturnValues} = payload, _payload = __rest(payload, ["ReturnValues"]);
        payload = Object.assign({}, _payload, {ReturnValuesOnConditionCheckFailure: ReturnValues});
      }
      return {Delete: payload};
    }
    deleteParams(item = {}, options = {}, params = {}) {
      const {schema, defaults, linked, _table} = this;
      const data = normalizeData_1.default(this.DocumentClient)(schema.attributes, linked, Object.assign({}, defaults, item), true);
      const {
        conditions,
        capacity,
        metrics,
        returnValues
      } = options, _args = __rest(options, ["conditions", "capacity", "metrics", "returnValues"]);
      const args = Object.keys(_args).filter((x) => !["execute", "parse"].includes(x));
      if (args.length > 0)
        utils_1.error(`Invalid delete options: ${args.join(", ")}`);
      if (metrics !== void 0 && (typeof metrics !== "string" || !["NONE", "SIZE"].includes(metrics.toUpperCase())))
        utils_1.error(`'metrics' must be one of 'NONE' OR 'SIZE'`);
      if (capacity !== void 0 && (typeof capacity !== "string" || !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase())))
        utils_1.error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
      if (returnValues !== void 0 && (typeof returnValues !== "string" || !["NONE", "ALL_OLD"].includes(returnValues.toUpperCase())))
        utils_1.error(`'returnValues' must be one of 'NONE' OR 'ALL_OLD'`);
      let ExpressionAttributeNames;
      let ExpressionAttributeValues;
      let ConditionExpression;
      if (conditions) {
        const {expression, names, values} = expressionBuilder_1.default(conditions, this.table, this.name);
        if (Object.keys(names).length > 0) {
          ExpressionAttributeNames = names;
          ExpressionAttributeValues = values;
          ConditionExpression = expression;
        }
      }
      const payload = Object.assign({
        TableName: _table.name,
        Key: getKey_1.default(this.DocumentClient)(data, schema.attributes, schema.keys.partitionKey, schema.keys.sortKey)
      }, ExpressionAttributeNames ? {ExpressionAttributeNames} : null, !utils_1.isEmpty(ExpressionAttributeValues) ? {ExpressionAttributeValues} : null, ConditionExpression ? {ConditionExpression} : null, capacity ? {ReturnConsumedCapacity: capacity.toUpperCase()} : null, metrics ? {ReturnItemCollectionMetrics: metrics.toUpperCase()} : null, returnValues ? {ReturnValues: returnValues.toUpperCase()} : null, typeof params === "object" ? params : {});
      return payload;
    }
    update(item = {}, options = {}, params = {}) {
      return __awaiter(this, void 0, void 0, function* () {
        const payload = this.updateParams(item, options, params);
        if (options.execute || this.autoExecute && options.execute !== false) {
          const result = yield this.DocumentClient.update(payload).promise();
          if (options.parse || this.autoParse && options.parse !== false) {
            return Object.assign(result, result.Attributes ? {Attributes: this.parse(result.Attributes, Array.isArray(options.include) ? options.include : [])} : null);
          } else {
            return result;
          }
        } else {
          return payload;
        }
      });
    }
    updateTransaction(item = {}, options = {}) {
      const {
        conditions,
        returnValues
      } = options, args = __rest(options, ["conditions", "returnValues"]);
      if (Object.keys(args).length > 0)
        utils_1.error(`Invalid update transaction options: ${Object.keys(args).join(", ")}`);
      let payload = this.updateParams(item, options);
      if ("ReturnValues" in payload) {
        let {ReturnValues} = payload, _payload = __rest(payload, ["ReturnValues"]);
        payload = Object.assign({}, _payload, {ReturnValuesOnConditionCheckFailure: ReturnValues});
      }
      return {Update: payload};
    }
    updateParams(item = {}, options = {}, _a = {}) {
      var {SET = [], REMOVE = [], ADD = [], DELETE = [], ExpressionAttributeNames = {}, ExpressionAttributeValues = {}} = _a, params = __rest(_a, ["SET", "REMOVE", "ADD", "DELETE", "ExpressionAttributeNames", "ExpressionAttributeValues"]);
      if (!Array.isArray(SET))
        utils_1.error("SET must be an array");
      if (!Array.isArray(REMOVE))
        utils_1.error("REMOVE must be an array");
      if (!Array.isArray(ADD))
        utils_1.error("ADD must be an array");
      if (!Array.isArray(DELETE))
        utils_1.error("DELETE must be an array");
      if (typeof ExpressionAttributeNames !== "object" || Array.isArray(ExpressionAttributeNames))
        utils_1.error("ExpressionAttributeNames must be an object");
      if (typeof ExpressionAttributeValues !== "object" || Array.isArray(ExpressionAttributeValues))
        utils_1.error("ExpressionAttributeValues must be an object");
      const {schema, defaults, required, linked, _table} = this;
      const validateType = validateTypes_1.default(this.DocumentClient);
      const data = normalizeData_1.default(this.DocumentClient)(schema.attributes, linked, Object.assign({}, defaults, item));
      const {
        conditions,
        capacity,
        metrics,
        returnValues
      } = options, _args = __rest(options, ["conditions", "capacity", "metrics", "returnValues"]);
      const args = Object.keys(_args).filter((x) => !["execute", "parse"].includes(x));
      if (args.length > 0)
        utils_1.error(`Invalid update options: ${args.join(", ")}`);
      if (metrics !== void 0 && (typeof metrics !== "string" || !["NONE", "SIZE"].includes(metrics.toUpperCase())))
        utils_1.error(`'metrics' must be one of 'NONE' OR 'SIZE'`);
      if (capacity !== void 0 && (typeof capacity !== "string" || !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase())))
        utils_1.error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
      if (returnValues !== void 0 && (typeof returnValues !== "string" || !["NONE", "ALL_OLD", "UPDATED_OLD", "ALL_NEW", "UPDATED_NEW"].includes(returnValues.toUpperCase())))
        utils_1.error(`'returnValues' must be one of 'NONE', 'ALL_OLD', 'UPDATED_OLD', 'ALL_NEW', OR 'UPDATED_NEW'`);
      let ConditionExpression;
      if (conditions) {
        const {expression: expression2, names: names2, values: values2} = expressionBuilder_1.default(conditions, this.table, this.name);
        if (Object.keys(names2).length > 0) {
          ExpressionAttributeNames = Object.assign(ExpressionAttributeNames, names2);
          ExpressionAttributeValues = Object.assign(ExpressionAttributeValues, values2);
          ConditionExpression = expression2;
        }
      }
      Object.keys(required).forEach((field) => required[field] && (data[field] === void 0 || data[field] === null) && utils_1.error(`'${field}${this.schema.attributes[field].alias ? `/${this.schema.attributes[field].alias}` : ""}' is a required field`));
      const Key = getKey_1.default(this.DocumentClient)(data, schema.attributes, schema.keys.partitionKey, schema.keys.sortKey);
      const names = {};
      const values = {};
      Object.keys(data).forEach((field) => {
        const mapping = schema.attributes[field];
        if (field === "$remove") {
          const attrs = Array.isArray(data[field]) ? data[field] : [data[field]];
          for (const i in attrs) {
            if (!schema.attributes[attrs[i]])
              utils_1.error(`'${attrs[i]}' is not a valid attribute and cannot be removed`);
            if (schema.attributes[attrs[i]].partitionKey === true || schema.attributes[attrs[i]].sortKey === true)
              utils_1.error(`'${attrs[i]}' is the ${schema.attributes[attrs[i]].partitionKey === true ? "partitionKey" : "sortKey"} and cannot be removed`);
            const attr = schema.attributes[attrs[i]].map || attrs[i];
            REMOVE.push(`#${attr}`);
            names[`#${attr}`] = attr;
          }
        } else if (this._table._removeNulls === true && (data[field] === null || String(data[field]).trim() === "") && (!mapping.link || mapping.save)) {
          REMOVE.push(`#${field}`);
          names[`#${field}`] = field;
        } else if (mapping.partitionKey !== true && mapping.sortKey !== true && (mapping.save === void 0 || mapping.save === true) && (!mapping.link || mapping.link && mapping.save === true)) {
          if (["number", "set"].includes(mapping.type) && data[field].$add) {
            ADD.push(`#${field} :${field}`);
            values[`:${field}`] = validateType(mapping, field, data[field].$add);
            names[`#${field}`] = field;
          } else if (mapping.type === "set" && data[field].$delete) {
            DELETE.push(`#${field} :${field}`);
            values[`:${field}`] = validateType(mapping, field, data[field].$delete);
            names[`#${field}`] = field;
          } else if (mapping.type === "list" && Array.isArray(data[field].$remove)) {
            data[field].$remove.forEach((i) => {
              if (typeof i !== "number")
                utils_1.error(`Remove array for '${field}' must only contain numeric indexes`);
              REMOVE.push(`#${field}[${i}]`);
            });
            names[`#${field}`] = field;
          } else if (mapping.type === "list" && (data[field].$append || data[field].$prepend)) {
            if (data[field].$append) {
              SET.push(`#${field} = list_append(#${field},:${field})`);
              values[`:${field}`] = validateType(mapping, field, data[field].$append);
            } else {
              SET.push(`#${field} = list_append(:${field},#${field})`);
              values[`:${field}`] = validateType(mapping, field, data[field].$prepend);
            }
            names[`#${field}`] = field;
          } else if (mapping.type === "list" && !Array.isArray(data[field]) && typeof data[field] === "object") {
            Object.keys(data[field]).forEach((i) => {
              if (String(parseInt(i)) !== i)
                utils_1.error(`Properties must be numeric to update specific list items in '${field}'`);
              SET.push(`#${field}[${i}] = :${field}_${i}`);
              values[`:${field}_${i}`] = data[field][i];
            });
            names[`#${field}`] = field;
          } else if (mapping.type === "map" && data[field].$set) {
            Object.keys(data[field].$set).forEach((f) => {
              let props = f.split(".");
              let acc = [`#${field}`];
              props.forEach((prop, i) => {
                let id = `${field}_${props.slice(0, i + 1).join("_")}`;
                names[`#${id.replace(/\[(\d+)\]/, "")}`] = prop.replace(/\[(\d+)\]/, "");
                if (i === props.length - 1) {
                  let input = data[field].$set[f];
                  let path = `${acc.join(".")}.#${id}`;
                  let value = `${id.replace(/\[(\d+)\]/, "_$1")}`;
                  if (input === void 0) {
                    REMOVE.push(`${path}`);
                  } else if (input.$add) {
                    ADD.push(`${path} :${value}`);
                    values[`:${value}`] = input.$add;
                  } else if (input.$append) {
                    SET.push(`${path} = list_append(${path},:${value})`);
                    values[`:${value}`] = input.$append;
                  } else if (input.$prepend) {
                    SET.push(`${path} = list_append(:${value},${path})`);
                    values[`:${value}`] = input.$prepend;
                  } else if (input.$remove) {
                    input.$remove.forEach((i2) => {
                      if (typeof i2 !== "number")
                        utils_1.error(`Remove array for '${field}' must only contain numeric indexes`);
                      REMOVE.push(`${path}[${i2}]`);
                    });
                  } else {
                    SET.push(`${path} = :${value}`);
                    values[`:${value}`] = input;
                  }
                  if (input.$set) {
                    Object.keys(input.$set).forEach((i2) => {
                      if (String(parseInt(i2)) !== i2)
                        utils_1.error(`Properties must be numeric to update specific list items in '${field}'`);
                      SET.push(`${path}[${i2}] = :${value}_${i2}`);
                      values[`:${value}_${i2}`] = input.$set[i2];
                    });
                  }
                } else {
                  acc.push(`#${id.replace(/\[(\d+)\]/, "")}`);
                }
              });
            });
            names[`#${field}`] = field;
          } else {
            let value = utils_1.transformAttr(mapping, validateType(mapping, field, data[field]), data);
            if (value !== void 0) {
              SET.push(mapping.default !== void 0 && item[field] === void 0 && !mapping.onUpdate ? `#${field} = if_not_exists(#${field},:${field})` : `#${field} = :${field}`);
              names[`#${field}`] = field;
              values[`:${field}`] = value;
            }
          }
        }
      });
      const expression = ((SET.length > 0 ? "SET " + SET.join(", ") : "") + (REMOVE.length > 0 ? " REMOVE " + REMOVE.join(", ") : "") + (ADD.length > 0 ? " ADD " + ADD.join(", ") : "") + (DELETE.length > 0 ? " DELETE " + DELETE.join(", ") : "")).trim();
      ExpressionAttributeValues = Object.assign(values, ExpressionAttributeValues);
      const payload = Object.assign({
        TableName: _table.name,
        Key,
        UpdateExpression: expression,
        ExpressionAttributeNames: Object.assign(names, ExpressionAttributeNames)
      }, typeof params === "object" ? params : {}, !utils_1.isEmpty(ExpressionAttributeValues) ? {ExpressionAttributeValues} : {}, ConditionExpression ? {ConditionExpression} : {}, capacity ? {ReturnConsumedCapacity: capacity.toUpperCase()} : null, metrics ? {ReturnItemCollectionMetrics: metrics.toUpperCase()} : null, returnValues ? {ReturnValues: returnValues.toUpperCase()} : null);
      return payload;
    }
    put(item = {}, options = {}, params = {}) {
      return __awaiter(this, void 0, void 0, function* () {
        const payload = this.putParams(item, options, params);
        if (options.execute || this.autoExecute && options.execute !== false) {
          const result = yield this.DocumentClient.put(payload).promise();
          if (options.parse || this.autoParse && options.parse !== false) {
            return Object.assign(result, result.Attributes ? {Attributes: this.parse(result.Attributes, Array.isArray(options.include) ? options.include : [])} : null);
          } else {
            return result;
          }
        } else {
          return payload;
        }
      });
    }
    putBatch(item = {}) {
      const payload = this.putParams(item);
      return {[payload.TableName]: {PutRequest: {Item: payload.Item}}};
    }
    putTransaction(item = {}, options = {}) {
      const {
        conditions,
        returnValues
      } = options, args = __rest(options, ["conditions", "returnValues"]);
      if (Object.keys(args).length > 0)
        utils_1.error(`Invalid put transaction options: ${Object.keys(args).join(", ")}`);
      let payload = this.putParams(item, options);
      if ("ReturnValues" in payload) {
        let {ReturnValues} = payload, _payload = __rest(payload, ["ReturnValues"]);
        payload = Object.assign({}, _payload, {ReturnValuesOnConditionCheckFailure: ReturnValues});
      }
      return {Put: payload};
    }
    putParams(item = {}, options = {}, params = {}) {
      const {schema, defaults, required, linked, _table} = this;
      const validateType = validateTypes_1.default(this.DocumentClient);
      const data = normalizeData_1.default(this.DocumentClient)(schema.attributes, linked, Object.assign({}, defaults, item));
      const {
        conditions,
        capacity,
        metrics,
        returnValues
      } = options, _args = __rest(options, ["conditions", "capacity", "metrics", "returnValues"]);
      const args = Object.keys(_args).filter((x) => !["execute", "parse"].includes(x));
      if (args.length > 0)
        utils_1.error(`Invalid put options: ${args.join(", ")}`);
      if (metrics !== void 0 && (typeof metrics !== "string" || !["NONE", "SIZE"].includes(metrics.toUpperCase())))
        utils_1.error(`'metrics' must be one of 'NONE' OR 'SIZE'`);
      if (capacity !== void 0 && (typeof capacity !== "string" || !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase())))
        utils_1.error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
      if (returnValues !== void 0 && (typeof returnValues !== "string" || !["NONE", "ALL_OLD", "UPDATED_OLD", "ALL_NEW", "UPDATED_NEW"].includes(returnValues.toUpperCase())))
        utils_1.error(`'returnValues' must be one of 'NONE', 'ALL_OLD', 'UPDATED_OLD', 'ALL_NEW', or 'UPDATED_NEW'`);
      let ExpressionAttributeNames;
      let ExpressionAttributeValues;
      let ConditionExpression;
      if (conditions) {
        const {expression, names, values} = expressionBuilder_1.default(conditions, this.table, this.name);
        if (Object.keys(names).length > 0) {
          ExpressionAttributeNames = names;
          ExpressionAttributeValues = values;
          ConditionExpression = expression;
        }
      }
      Object.keys(required).forEach((field) => required[field] !== void 0 && !data[field] && utils_1.error(`'${field}${this.schema.attributes[field].alias ? `/${this.schema.attributes[field].alias}` : ""}' is a required field`));
      getKey_1.default(this.DocumentClient)(data, schema.attributes, schema.keys.partitionKey, schema.keys.sortKey);
      const payload = Object.assign({
        TableName: _table.name,
        Item: Object.keys(data).reduce((acc, field) => {
          let mapping = schema.attributes[field];
          let value = validateType(mapping, field, data[field]);
          return value !== void 0 && (mapping.save === void 0 || mapping.save === true) && (!mapping.link || mapping.link && mapping.save === true) && (!_table._removeNulls || _table._removeNulls && value !== null) ? Object.assign(acc, {
            [field]: utils_1.transformAttr(mapping, value, data)
          }) : acc;
        }, {})
      }, ExpressionAttributeNames ? {ExpressionAttributeNames} : null, !utils_1.isEmpty(ExpressionAttributeValues) ? {ExpressionAttributeValues} : null, ConditionExpression ? {ConditionExpression} : null, capacity ? {ReturnConsumedCapacity: capacity.toUpperCase()} : null, metrics ? {ReturnItemCollectionMetrics: metrics.toUpperCase()} : null, returnValues ? {ReturnValues: returnValues.toUpperCase()} : null, typeof params === "object" ? params : {});
      return payload;
    }
    conditionCheck(item = {}, options = {}) {
      const {
        conditions,
        returnValues
      } = options, args = __rest(options, ["conditions", "returnValues"]);
      if (Object.keys(args).length > 0)
        utils_1.error(`Invalid conditionCheck options: ${Object.keys(args).join(", ")}`);
      let payload = this.deleteParams(item, options);
      if (!("ConditionExpression" in payload))
        utils_1.error(`'conditions' are required in a conditionCheck`);
      if ("ReturnValues" in payload) {
        let {ReturnValues} = payload, _payload = __rest(payload, ["ReturnValues"]);
        payload = Object.assign({}, _payload, {ReturnValuesOnConditionCheckFailure: ReturnValues});
      }
      return {ConditionCheck: payload};
    }
    query(pk, options = {}, params = {}) {
      options.entity = this.name;
      return this.table.query(pk, options, params);
    }
    scan(options = {}, params = {}) {
      options.entity = this.name;
      return this.table.scan(options, params);
    }
  };
  exports2.default = Entity2;
});

// node_modules/dynamodb-toolbox/dist/lib/parseTableAttributes.js
var require_parseTableAttributes = __commonJS((exports2) => {
  "use strict";
  /**
   * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
   * @author Jeremy Daly <jeremy@jeremydaly.com>
   * @license MIT
   */
  Object.defineProperty(exports2, "__esModule", {value: true});
  var utils_1 = require_utils();
  exports2.default = (attrs, partitionKey, sortKey) => Object.keys(attrs).reduce((acc, field) => {
    if (typeof attrs[field] === "string") {
      if ([partitionKey, sortKey].includes(field) && !utils_1.validKeyTypes.includes(attrs[field].toString())) {
        utils_1.keyTypeError(field);
      }
      if (!utils_1.validTypes.includes(attrs[field].toString())) {
        utils_1.typeError(field);
      }
      return Object.assign(acc, parseAttributeConfig(field, {type: attrs[field]}));
    } else {
      const fieldVal = attrs[field];
      if ([partitionKey, sortKey].includes(field) && !utils_1.validKeyTypes.includes(fieldVal.type)) {
        utils_1.keyTypeError(field);
      }
      if (!utils_1.validTypes.includes(fieldVal.type)) {
        utils_1.typeError(field);
      }
      return Object.assign(acc, parseAttributeConfig(field, fieldVal));
    }
  }, {});
  var parseAttributeConfig = (field, config) => {
    Object.keys(config).forEach((prop) => {
      switch (prop) {
        case "type":
          break;
        case "setType":
          if (config.type !== "set")
            utils_1.error(`'setType' is only valid for type 'set'`);
          if (!["string", "number", "binary"].includes(config[prop]))
            utils_1.error(`Invalid 'setType', must be 'string', 'number', or 'binary'`);
          break;
        default:
          utils_1.error(`'${prop}' is not a valid property type`);
      }
    });
    return {
      [field]: Object.assign(Object.assign({}, config), {mappings: {}})
    };
  };
});

// node_modules/dynamodb-toolbox/dist/lib/parseTable.js
var require_parseTable = __commonJS((exports2) => {
  "use strict";
  /**
   * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
   * @author Jeremy Daly <jeremy@jeremydaly.com>
   * @license MIT
   */
  var __rest = exports2 && exports2.__rest || function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
  var __importDefault = exports2 && exports2.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports2, "__esModule", {value: true});
  exports2.parseTable = void 0;
  var parseTableAttributes_1 = __importDefault(require_parseTableAttributes());
  var utils_1 = require_utils();
  var parseTable = (table2) => {
    let {
      name,
      alias,
      partitionKey,
      sortKey,
      entityField,
      attributes,
      indexes,
      autoExecute,
      autoParse,
      removeNullAttributes,
      entities,
      DocumentClient: DocumentClient2
    } = table2, args = __rest(table2, ["name", "alias", "partitionKey", "sortKey", "entityField", "attributes", "indexes", "autoExecute", "autoParse", "removeNullAttributes", "entities", "DocumentClient"]);
    if (Object.keys(args).length > 0)
      utils_1.error(`Invalid Table configuration options: ${Object.keys(args).join(", ")}`);
    name = typeof name === "string" && name.trim().length > 0 ? name.trim() : utils_1.error(`'name' must be defined`);
    alias = typeof alias === "string" && alias.trim().length > 0 ? alias.trim() : alias ? utils_1.error(`'alias' must be a string value`) : null;
    partitionKey = typeof partitionKey === "string" && partitionKey.trim().length > 0 ? partitionKey.trim() : utils_1.error(`'partitionKey' must be defined`);
    sortKey = typeof sortKey === "string" && sortKey.trim().length > 0 ? sortKey.trim() : sortKey ? utils_1.error(`'sortKey' must be a string value`) : null;
    entityField = entityField === false ? false : typeof entityField === "string" && entityField.trim().length > 0 ? entityField.trim() : "_et";
    attributes = utils_1.hasValue(attributes) && typeof attributes === "object" && !Array.isArray(attributes) ? attributes : attributes ? utils_1.error(`Please provide a valid 'attributes' object`) : {};
    if (entityField)
      attributes[entityField] = "string";
    indexes = utils_1.hasValue(indexes) && typeof indexes === "object" && !Array.isArray(indexes) ? parseIndexes(indexes, partitionKey) : indexes ? utils_1.error(`Please provide a valid 'indexes' object`) : {};
    return Object.assign({
      name,
      alias,
      Table: {
        partitionKey,
        sortKey,
        entityField,
        attributes: parseTableAttributes_1.default(attributes, partitionKey, sortKey),
        indexes
      },
      autoExecute,
      autoParse,
      removeNullAttributes,
      _entities: []
    }, DocumentClient2 ? {DocumentClient: DocumentClient2} : {}, entities ? {entities} : {});
  };
  exports2.parseTable = parseTable;
  var parseIndexes = (indexes, pk) => Object.keys(indexes).reduce((acc, index) => {
    const _a = indexes[index], {partitionKey, sortKey} = _a, args = __rest(_a, ["partitionKey", "sortKey"]);
    if (Object.keys(args).length > 0)
      utils_1.error(`Invalid index options: ${Object.keys(args).join(", ")}`);
    if (partitionKey && typeof partitionKey !== "string")
      utils_1.error(`'partitionKey' for ${index} must be a string`);
    if (sortKey && typeof sortKey !== "string")
      utils_1.error(`'sortKey' for ${index} must be a string`);
    if (!sortKey && !partitionKey)
      utils_1.error(`A 'partitionKey', 'sortKey' or both, must be provided for ${index}`);
    const type = !partitionKey || partitionKey === pk ? "LSI" : "GSI";
    return Object.assign(acc, {
      [index]: Object.assign({}, partitionKey && type === "GSI" ? {partitionKey} : {}, sortKey ? {sortKey} : {}, {type})
    });
  }, {});
  exports2.default = exports2.parseTable;
});

// node_modules/dynamodb-toolbox/dist/classes/Table.js
var require_Table = __commonJS((exports2) => {
  "use strict";
  /**
   * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
   * @author Jeremy Daly <jeremy@jeremydaly.com>
   * @license MIT
   */
  var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __rest = exports2 && exports2.__rest || function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
  var __importDefault = exports2 && exports2.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports2, "__esModule", {value: true});
  var Entity_1 = __importDefault(require_Entity());
  var parseTable_1 = require_parseTable();
  var expressionBuilder_1 = __importDefault(require_expressionBuilder());
  var validateTypes_1 = __importDefault(require_validateTypes());
  var projectionBuilder_1 = __importDefault(require_projectionBuilder());
  var utils_1 = require_utils();
  var Table2 = class {
    constructor(table2) {
      this._execute = true;
      this._parse = true;
      this._removeNulls = true;
      this._entities = [];
      if (typeof table2 !== "object" || Array.isArray(table2))
        utils_1.error("Please provide a valid table definition");
      Object.assign(this, parseTable_1.parseTable(table2));
    }
    set autoExecute(val) {
      this._execute = typeof val === "boolean" ? val : true;
    }
    get autoExecute() {
      return this._execute;
    }
    set autoParse(val) {
      this._parse = typeof val === "boolean" ? val : true;
    }
    get autoParse() {
      return this._parse;
    }
    set removeNullAttributes(val) {
      this._removeNulls = typeof val === "boolean" ? val : true;
    }
    get removeNullAttributes() {
      return this._removeNulls;
    }
    get DocumentClient() {
      return this._docClient;
    }
    set DocumentClient(docClient) {
      if (docClient && docClient.get && docClient.put && docClient.delete && docClient.update) {
        if (docClient.options.convertEmptyValues !== false)
          docClient.options.convertEmptyValues = true;
        this._docClient = docClient;
      } else {
        utils_1.error("Invalid DocumentClient");
      }
    }
    addEntity(entity) {
      let entities = Array.isArray(entity) ? entity : [entity];
      for (let i in entities) {
        let entity2 = entities[i];
        if (entity2 instanceof Entity_1.default) {
          if (this._entities && this._entities.includes(entity2.name)) {
            utils_1.error(`Entity name '${entity2.name}' already exists`);
          }
          const reservedWords = Object.getOwnPropertyNames(this).concat(Object.getOwnPropertyNames(Object.getPrototypeOf(this)));
          if (reservedWords.includes(entity2.name)) {
            utils_1.error(`'${entity2.name}' is a reserved word and cannot be used to name an Entity`);
          }
          if (!this.Table.sortKey && entity2.schema.keys.sortKey) {
            utils_1.error(`${entity2.name} entity contains a sortKey, but the Table does not`);
          } else if (this.Table.sortKey && !entity2.schema.keys.sortKey) {
            utils_1.error(`${entity2.name} entity does not have a sortKey defined`);
          }
          for (const key in entity2.schema.keys) {
            const attr = entity2.schema.keys[key];
            switch (key) {
              case "partitionKey":
              case "sortKey":
                if (attr !== this.Table[key] && this.Table[key]) {
                  if (!entity2.schema.attributes[this.Table[key]]) {
                    entity2.schema.attributes[this.Table[key]] = Object.assign({}, entity2.schema.attributes[attr], {alias: attr});
                    entity2.schema.attributes[attr].map = this.Table[key];
                  } else {
                    utils_1.error(`The Table's ${key} name (${this.Table[key]}) conflicts with an Entity attribute name`);
                  }
                }
                break;
              default:
                if (!this.Table.indexes[key])
                  utils_1.error(`'${key}' is not a valid secondary index name`);
                for (const keyType in attr) {
                  if (!this.Table.indexes[key][keyType])
                    utils_1.error(`${entity2.name} contains a ${keyType}, but it is not used by ${key}`);
                  if (attr[keyType] !== this.Table.indexes[key][keyType]) {
                    if (!entity2.schema.attributes[this.Table.indexes[key][keyType]]) {
                      if (entity2.schema.attributes[attr[keyType]].map && entity2.schema.attributes[attr[keyType]].map !== this.Table.indexes[key][keyType])
                        utils_1.error(`${key}'s ${keyType} cannot map to the '${attr[keyType]}' alias because it is already mapped to another table attribute`);
                      entity2.schema.attributes[this.Table.indexes[key][keyType]] = Object.assign({}, entity2.schema.attributes[attr[keyType]], {alias: attr[keyType]});
                      entity2.schema.attributes[attr[keyType]].map = this.Table.indexes[key][keyType];
                    } else {
                      const config = entity2.schema.attributes[this.Table.indexes[key][keyType]];
                      if (!config.partitionKey && !config.sortKey || config.partitionKey && !config.partitionKey.includes(key) || config.sortKey && !config.sortKey.includes(key)) {
                        utils_1.error(`${key}'s ${keyType} name (${this.Table.indexes[key][keyType]}) conflicts with another Entity attribute name`);
                      }
                    }
                  }
                }
                if (this.Table.indexes[key].partitionKey && this.Table.indexes[key].sortKey && (!entity2.schema.attributes[this.Table.indexes[key].partitionKey] || !entity2.schema.attributes[this.Table.indexes[key].sortKey])) {
                  utils_1.error(`${key} requires mappings for both the partitionKey and the sortKey`);
                }
                break;
            }
          }
          for (let attr in entity2.schema.attributes) {
            if (this.Table.entityField && (attr === this.Table.entityField || attr === entity2._etAlias)) {
              utils_1.error(`Attribute or alias '${attr}' conflicts with the table's 'entityField' mapping or entity alias`);
            } else if (this.Table.attributes[attr]) {
              if (this.Table.attributes[attr].type && this.Table.attributes[attr].type !== entity2.schema.attributes[attr].type)
                utils_1.error(`${entity2.name} attribute type for '${attr}' (${entity2.schema.attributes[attr].type}) does not match table's type (${this.Table.attributes[attr].type})`);
              this.Table.attributes[attr].mappings[entity2.name] = Object.assign({
                [entity2.schema.attributes[attr].alias || attr]: entity2.schema.attributes[attr].type
              }, entity2.schema.attributes[attr].type === "set" ? {_setType: entity2.schema.attributes[attr].setType} : {});
            } else if (!entity2.schema.attributes[attr].map) {
              this.Table.attributes[attr] = Object.assign({
                mappings: {
                  [entity2.name]: Object.assign({
                    [entity2.schema.attributes[attr].alias || attr]: entity2.schema.attributes[attr].type
                  }, entity2.schema.attributes[attr].type === "set" ? {_setType: entity2.schema.attributes[attr].setType} : {})
                }
              }, entity2.schema.attributes[attr].partitionKey || entity2.schema.attributes[attr].sortKey ? {type: entity2.schema.attributes[attr].type} : null);
            }
          }
          this._entities.push(entity2.name);
          this[entity2.name] = entity2;
          entity2.table = this;
        } else {
          utils_1.error("Invalid Entity");
        }
      }
    }
    set entities(entity) {
      this.addEntity(entity);
    }
    get entities() {
      return this._entities;
    }
    query(pk, options = {}, params = {}) {
      return __awaiter(this, void 0, void 0, function* () {
        const {payload, EntityProjections, TableProjections} = this.queryParams(pk, options, params, true);
        if (options.execute || this.autoExecute && options.execute !== false) {
          const result = yield this.DocumentClient.query(payload).promise();
          if (options.parse || this.autoParse && options.parse !== false) {
            return Object.assign(result, {
              Items: result.Items && result.Items.map((item) => {
                if (this[item[String(this.Table.entityField)]]) {
                  return this[item[String(this.Table.entityField)]].parse(item, EntityProjections[item[String(this.Table.entityField)]] ? EntityProjections[item[String(this.Table.entityField)]] : TableProjections ? TableProjections : []);
                } else {
                  return item;
                }
              })
            }, result.LastEvaluatedKey ? {
              next: () => {
                return this.query(pk, Object.assign(options, {startKey: result.LastEvaluatedKey}), params);
              }
            } : null);
          } else {
            return result;
          }
        } else {
          return payload;
        }
      });
    }
    queryParams(pk, options = {}, params = {}, projections = false) {
      const {
        index,
        limit,
        reverse,
        consistent,
        capacity,
        select,
        eq,
        lt,
        lte,
        gt,
        gte,
        between,
        beginsWith,
        filters,
        attributes,
        startKey,
        entity
      } = options, _args = __rest(options, ["index", "limit", "reverse", "consistent", "capacity", "select", "eq", "lt", "lte", "gt", "gte", "between", "beginsWith", "filters", "attributes", "startKey", "entity"]);
      const args = Object.keys(_args).filter((x) => !["execute", "parse"].includes(x));
      if (args.length > 0)
        utils_1.error(`Invalid query options: ${args.join(", ")}`);
      if (typeof pk !== "string" && typeof pk !== "number" || typeof pk === "string" && pk.trim().length === 0)
        utils_1.error(`Query requires a string, number or binary 'partitionKey' as its first parameter`);
      if (index !== void 0 && !this.Table.indexes[index])
        utils_1.error(`'${index}' is not a valid index name`);
      if (limit !== void 0 && (!Number.isInteger(limit) || limit < 0))
        utils_1.error(`'limit' must be a positive integer`);
      if (reverse !== void 0 && typeof reverse !== "boolean")
        utils_1.error(`'reverse' requires a boolean`);
      if (consistent !== void 0 && typeof consistent !== "boolean")
        utils_1.error(`'consistent' requires a boolean`);
      if (select !== void 0 && (typeof select !== "string" || !["ALL_ATTRIBUTES", "ALL_PROJECTED_ATTRIBUTES", "SPECIFIC_ATTRIBUTES", "COUNT"].includes(select.toUpperCase())))
        utils_1.error(`'select' must be one of 'ALL_ATTRIBUTES', 'ALL_PROJECTED_ATTRIBUTES', 'SPECIFIC_ATTRIBUTES', OR 'COUNT'`);
      if (entity !== void 0 && (typeof entity !== "string" || !(entity in this)))
        utils_1.error(`'entity' must be a string and a valid table Entity name`);
      if (capacity !== void 0 && (typeof capacity !== "string" || !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase())))
        utils_1.error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
      if (startKey && (typeof startKey !== "object" || Array.isArray(startKey)))
        utils_1.error(`'startKey' requires a valid object`);
      let ExpressionAttributeNames = {"#pk": index && this.Table.indexes[index].partitionKey || this.Table.partitionKey};
      let ExpressionAttributeValues = {":pk": pk};
      let KeyConditionExpression = "#pk = :pk";
      let FilterExpression;
      let ProjectionExpression;
      let EntityProjections = {};
      let TableProjections;
      let operator, value, f = "";
      if (eq) {
        value = eq;
        f = "eq";
        operator = "=";
      }
      if (lt) {
        value = value ? utils_1.conditonError(f) : lt;
        f = "lt";
        operator = "<";
      }
      if (lte) {
        value = value ? utils_1.conditonError(f) : lte;
        f = "lte";
        operator = "<=";
      }
      if (gt) {
        value = value ? utils_1.conditonError(f) : gt;
        f = "gt";
        operator = ">";
      }
      if (gte) {
        value = value ? utils_1.conditonError(f) : gte;
        f = "gte";
        operator = ">=";
      }
      if (beginsWith) {
        value = value ? utils_1.conditonError(f) : beginsWith;
        f = "beginsWith";
        operator = "BEGINS_WITH";
      }
      if (between) {
        value = value ? utils_1.conditonError(f) : between;
        f = "between";
        operator = "BETWEEN";
      }
      if (operator) {
        const sk = index ? this.Table.indexes[index].sortKey ? this.Table.attributes[this.Table.indexes[index].sortKey] || {type: "string"} : utils_1.error(`Conditional expressions require the index to have a sortKey`) : this.Table.sortKey ? this.Table.attributes[this.Table.sortKey] : utils_1.error(`Conditional expressions require the table to have a sortKey`);
        const validateType = validateTypes_1.default(this.DocumentClient);
        ExpressionAttributeNames["#sk"] = index && this.Table.indexes[index].sortKey || this.Table.sortKey;
        if (operator === "BETWEEN") {
          if (!Array.isArray(value) || value.length !== 2)
            utils_1.error(`'between' conditions requires an array with two values.`);
          ExpressionAttributeValues[":sk0"] = validateType(sk, f + "[0]", value[0]);
          ExpressionAttributeValues[":sk1"] = validateType(sk, f + "[1]", value[1]);
          KeyConditionExpression += " and #sk between :sk0 and :sk1";
        } else {
          ExpressionAttributeValues[":sk"] = validateType(sk, f, value);
          if (operator === "BEGINS_WITH") {
            KeyConditionExpression += " and begins_with(#sk,:sk)";
          } else {
            KeyConditionExpression += ` and #sk ${operator} :sk`;
          }
        }
      }
      if (filters) {
        const {expression, names, values} = expressionBuilder_1.default(filters, this, entity);
        if (Object.keys(names).length > 0) {
          ExpressionAttributeNames = Object.assign(ExpressionAttributeNames, names);
          ExpressionAttributeValues = Object.assign(ExpressionAttributeValues, values);
          FilterExpression = expression;
        }
      }
      if (attributes) {
        const {names, projections: projections2, entities, tableAttrs} = projectionBuilder_1.default(attributes, this, entity, true);
        if (Object.keys(names).length > 0) {
          ExpressionAttributeNames = Object.assign(ExpressionAttributeNames, names);
          ProjectionExpression = projections2;
          EntityProjections = entities;
          TableProjections = tableAttrs;
        }
      }
      const payload = Object.assign({
        TableName: this.name,
        KeyConditionExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues
      }, FilterExpression ? {FilterExpression} : null, ProjectionExpression ? {ProjectionExpression} : null, index ? {IndexName: index} : null, limit ? {Limit: String(limit)} : null, reverse ? {ScanIndexForward: !reverse} : null, consistent ? {ConsistentRead: consistent} : null, capacity ? {ReturnConsumedCapacity: capacity.toUpperCase()} : null, select ? {Select: select.toUpperCase()} : null, startKey ? {ExclusiveStartKey: startKey} : null, typeof params === "object" ? params : null);
      return projections ? {payload, EntityProjections, TableProjections} : payload;
    }
    scan(options = {}, params = {}) {
      return __awaiter(this, void 0, void 0, function* () {
        const {payload, EntityProjections, TableProjections} = this.scanParams(options, params, true);
        if (options.execute || this.autoExecute && options.execute !== false) {
          const result = yield this.DocumentClient.scan(payload).promise();
          if (options.parse || this.autoParse && options.parse !== false) {
            return Object.assign(result, {
              Items: result.Items && result.Items.map((item) => {
                if (this[item[String(this.Table.entityField)]]) {
                  return this[item[String(this.Table.entityField)]].parse(item, EntityProjections[item[String(this.Table.entityField)]] ? EntityProjections[item[String(this.Table.entityField)]] : TableProjections ? TableProjections : []);
                } else {
                  return item;
                }
              })
            }, result.LastEvaluatedKey ? {
              next: () => {
                return this.scan(Object.assign(options, {startKey: result.LastEvaluatedKey}), params);
              }
            } : null);
          } else {
            return result;
          }
        } else {
          return payload;
        }
      });
    }
    scanParams(options = {}, params = {}, meta = false) {
      const {
        index,
        limit,
        consistent,
        capacity,
        select,
        filters,
        attributes,
        segments,
        segment,
        startKey,
        entity
      } = options, _args = __rest(options, ["index", "limit", "consistent", "capacity", "select", "filters", "attributes", "segments", "segment", "startKey", "entity"]);
      const args = Object.keys(_args).filter((x) => !["execute", "parse"].includes(x));
      if (args.length > 0)
        utils_1.error(`Invalid scan options: ${args.join(", ")}`);
      if (index !== void 0 && !this.Table.indexes[index])
        utils_1.error(`'${index}' is not a valid index name`);
      if (limit !== void 0 && (!Number.isInteger(limit) || limit < 0))
        utils_1.error(`'limit' must be a positive integer`);
      if (consistent !== void 0 && typeof consistent !== "boolean")
        utils_1.error(`'consistent' requires a boolean`);
      if (select !== void 0 && (typeof select !== "string" || !["ALL_ATTRIBUTES", "ALL_PROJECTED_ATTRIBUTES", "SPECIFIC_ATTRIBUTES", "COUNT"].includes(select.toUpperCase())))
        utils_1.error(`'select' must be one of 'ALL_ATTRIBUTES', 'ALL_PROJECTED_ATTRIBUTES', 'SPECIFIC_ATTRIBUTES', OR 'COUNT'`);
      if (entity !== void 0 && (typeof entity !== "string" || !(entity in this)))
        utils_1.error(`'entity' must be a string and a valid table Entity name`);
      if (capacity !== void 0 && (typeof capacity !== "string" || !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase())))
        utils_1.error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
      if (startKey && (typeof startKey !== "object" || Array.isArray(startKey)))
        utils_1.error(`'startKey' requires a valid object`);
      if (segments !== void 0 && (!Number.isInteger(segments) || segments < 1))
        utils_1.error(`'segments' must be an integer greater than 1`);
      if (segment !== void 0 && (!Number.isInteger(segment) || segment < 0 || segment >= segments))
        utils_1.error(`'segment' must be an integer greater than or equal to 0 and less than the total number of segments`);
      if (segments !== void 0 && segment === void 0 || segments === void 0 && segment !== void 0)
        utils_1.error(`Both 'segments' and 'segment' must be provided`);
      let ExpressionAttributeNames = {};
      let ExpressionAttributeValues = {};
      let FilterExpression;
      let ProjectionExpression;
      let EntityProjections = {};
      let TableProjections;
      if (filters) {
        const {expression, names, values} = expressionBuilder_1.default(filters, this, entity);
        if (Object.keys(names).length > 0) {
          ExpressionAttributeNames = Object.assign(ExpressionAttributeNames, names);
          ExpressionAttributeValues = Object.assign(ExpressionAttributeValues, values);
          FilterExpression = expression;
        }
      }
      if (attributes) {
        const {names, projections, entities, tableAttrs} = projectionBuilder_1.default(attributes, this, entity, true);
        if (Object.keys(names).length > 0) {
          ExpressionAttributeNames = Object.assign(ExpressionAttributeNames, names);
          ProjectionExpression = projections;
          EntityProjections = entities;
          TableProjections = tableAttrs;
        }
      }
      const payload = Object.assign({
        TableName: this.name
      }, Object.keys(ExpressionAttributeNames).length ? {ExpressionAttributeNames} : null, Object.keys(ExpressionAttributeValues).length ? {ExpressionAttributeValues} : null, FilterExpression ? {FilterExpression} : null, ProjectionExpression ? {ProjectionExpression} : null, index ? {IndexName: index} : null, segments ? {TotalSegments: segments} : null, Number.isInteger(segment) ? {Segment: segment} : null, limit ? {Limit: String(limit)} : null, consistent ? {ConsistentRead: consistent} : null, capacity ? {ReturnConsumedCapacity: capacity.toUpperCase()} : null, select ? {Select: select.toUpperCase()} : null, startKey ? {ExclusiveStartKey: startKey} : null, typeof params === "object" ? params : null);
      return meta ? {payload, EntityProjections, TableProjections} : payload;
    }
    batchGet(items, options = {}, params = {}) {
      return __awaiter(this, void 0, void 0, function* () {
        const {
          payload,
          Tables,
          EntityProjections,
          TableProjections
        } = this.batchGetParams(items, options, params, true);
        if (options.execute || this.autoExecute && options.execute !== false) {
          const result = yield this.DocumentClient.batchGet(payload).promise();
          if (options.parse || this.autoParse && options.parse !== false) {
            return this.parseBatchGetResponse(result, Tables, EntityProjections, TableProjections, options);
          } else {
            return result;
          }
        } else {
          return payload;
        }
      });
    }
    parseBatchGetResponse(result, Tables, EntityProjections, TableProjections, options = {}) {
      return Object.assign(result, result.Responses ? {
        Responses: Object.keys(result.Responses).reduce((acc, table2) => {
          return Object.assign(acc, {
            [Tables[table2] && Tables[table2].alias || table2]: result.Responses[table2].map((item) => {
              if (Tables[table2] && Tables[table2][item[String(Tables[table2].Table.entityField)]]) {
                return Tables[table2][item[String(Tables[table2].Table.entityField)]].parse(item, EntityProjections[table2] && EntityProjections[table2][item[String(Tables[table2].Table.entityField)]] ? EntityProjections[table2][item[String(Tables[table2].Table.entityField)]] : TableProjections[table2] ? TableProjections[table2] : []);
              } else {
                return item;
              }
            })
          });
        }, {})
      } : null, result.UnprocessedKeys && Object.keys(result.UnprocessedKeys).length > 0 ? {
        next: () => __awaiter(this, void 0, void 0, function* () {
          const nextResult = yield this.DocumentClient.batchGet(Object.assign({RequestItems: result.UnprocessedKeys}, options.capacity ? {ReturnConsumedCapacity: options.capacity.toUpperCase()} : null)).promise();
          return this.parseBatchGetResponse(nextResult, Tables, EntityProjections, TableProjections, options);
        })
      } : {next: () => false});
    }
    batchGetParams(_items, options = {}, params = {}, meta = false) {
      let items = Array.isArray(_items) ? _items : [_items];
      if (items.length === 0)
        utils_1.error(`No items supplied`);
      const {capacity, consistent, attributes} = options, _args = __rest(options, ["capacity", "consistent", "attributes"]);
      const args = Object.keys(_args).filter((x) => !["execute", "parse"].includes(x));
      if (args.length > 0)
        utils_1.error(`Invalid batchGet options: ${args.join(", ")}`);
      if (capacity !== void 0 && (typeof capacity !== "string" || !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase())))
        utils_1.error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
      let RequestItems = {};
      let Tables = {};
      let TableAliases = {};
      let EntityProjections = {};
      let TableProjections = {};
      for (const i in items) {
        const item = items[i];
        if (item && item.Table && item.Table.Table && item.Key && typeof item.Key === "object" && !Array.isArray(item.Key)) {
          const table2 = item.Table.name;
          if (!RequestItems[table2]) {
            RequestItems[table2] = {Keys: []};
            Tables[table2] = item.Table;
            if (item.Table.alias)
              TableAliases[item.Table.alias] = table2;
          }
          RequestItems[table2].Keys.push(item.Key);
        } else {
          utils_1.error(`Item references must contain a valid Table object and Key`);
        }
      }
      if (consistent) {
        if (consistent === true) {
          for (const tbl in RequestItems)
            RequestItems[tbl].ConsistentRead = true;
        } else if (typeof consistent === "object" && !Array.isArray(consistent)) {
          for (const tbl in consistent) {
            const tbl_name = TableAliases[tbl] || tbl;
            if (RequestItems[tbl_name]) {
              if (typeof consistent[tbl] === "boolean") {
                RequestItems[tbl_name].ConsistentRead = consistent[tbl];
              } else {
                utils_1.error(`'consistent' values must be booleans (${tbl})`);
              }
            } else {
              utils_1.error(`There are no items for the table or table alias: ${tbl}`);
            }
          }
        } else {
          utils_1.error(`'consistent' must be a boolean or an map of table names`);
        }
      }
      if (attributes) {
        let attrs = attributes;
        if (Array.isArray(attributes)) {
          if (Object.keys(RequestItems).length === 1) {
            attrs = {[Object.keys(RequestItems)[0]]: attributes};
          } else {
            utils_1.error(`'attributes' must use a table map when requesting items from multiple tables`);
          }
        }
        for (const tbl in attrs) {
          const tbl_name = TableAliases[tbl] || tbl;
          if (Tables[tbl_name]) {
            const {names, projections, entities, tableAttrs} = projectionBuilder_1.default(attrs[tbl], Tables[tbl_name], null, true);
            RequestItems[tbl_name].ExpressionAttributeNames = names;
            RequestItems[tbl_name].ProjectionExpression = projections;
            EntityProjections[tbl_name] = entities;
            TableProjections[tbl_name] = tableAttrs;
          } else {
            utils_1.error(`There are no items for the table: ${tbl}`);
          }
        }
      }
      const payload = Object.assign({RequestItems}, capacity ? {ReturnConsumedCapacity: capacity.toUpperCase()} : null, typeof params === "object" ? params : null);
      return meta ? {
        payload,
        Tables,
        EntityProjections,
        TableProjections
      } : payload;
    }
    batchWrite(items, options = {}, params = {}) {
      return __awaiter(this, void 0, void 0, function* () {
        const payload = this.batchWriteParams(items, options, params);
        if (options.execute || this.autoExecute && options.execute !== false) {
          const result = yield this.DocumentClient.batchWrite(payload).promise();
          if (options.parse || this.autoParse && options.parse !== false) {
            return this.parseBatchWriteResponse(result, options);
          } else {
            return result;
          }
        } else {
          return payload;
        }
      });
    }
    parseBatchWriteResponse(result, options = {}) {
      return Object.assign(result, result.UnprocessedItems && Object.keys(result.UnprocessedItems).length > 0 ? {
        next: () => __awaiter(this, void 0, void 0, function* () {
          const nextResult = yield this.DocumentClient.batchWrite(Object.assign({RequestItems: result.UnprocessedItems}, options.capacity ? {ReturnConsumedCapacity: options.capacity.toUpperCase()} : null, options.metrics ? {ReturnItemCollectionMetrics: options.metrics.toUpperCase()} : null)).promise();
          return this.parseBatchWriteResponse(nextResult, options);
        })
      } : {next: () => false});
    }
    batchWriteParams(_items, options = {}, params = {}, meta = false) {
      let items = (Array.isArray(_items) ? _items : [_items]).filter((x) => x);
      if (items.length === 0)
        utils_1.error(`No items supplied`);
      const {capacity, metrics} = options, _args = __rest(options, ["capacity", "metrics"]);
      const args = Object.keys(_args).filter((x) => !["execute", "parse"].includes(x));
      if (args.length > 0)
        utils_1.error(`Invalid batchWrite options: ${args.join(", ")}`);
      if (capacity !== void 0 && (typeof capacity !== "string" || !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase())))
        utils_1.error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
      if (metrics !== void 0 && (typeof metrics !== "string" || !["NONE", "SIZE"].includes(metrics.toUpperCase())))
        utils_1.error(`'metrics' must be one of 'NONE' OR 'SIZE'`);
      const RequestItems = {};
      for (const i in items) {
        const item = items[i];
        const table2 = Object.keys(item)[0];
        if (!RequestItems[table2])
          RequestItems[table2] = [];
        RequestItems[table2].push(item[table2]);
      }
      const payload = Object.assign({RequestItems}, capacity ? {ReturnConsumedCapacity: capacity.toUpperCase()} : null, metrics ? {ReturnItemCollectionMetrics: metrics.toUpperCase()} : null, typeof params === "object" ? params : null);
      const Tables = {};
      return meta ? {payload, Tables} : payload;
    }
    transactGet(items = [], options = {}, params = {}) {
      return __awaiter(this, void 0, void 0, function* () {
        const {payload, Entities} = this.transactGetParams(items, options, true);
        if (options.execute || this.autoExecute && options.execute !== false) {
          const result = yield this.DocumentClient.transactGet(payload).promise();
          if (options.parse || this.autoParse && options.parse !== false) {
            return Object.assign(result, result.Responses ? {
              Responses: result.Responses.map((res, i) => {
                if (res.Item) {
                  return {Item: Entities[i].parse ? Entities[i].parse(res.Item) : res.Item};
                } else {
                  return {};
                }
              })
            } : null);
          } else {
            return result;
          }
        } else {
          return payload;
        }
      });
    }
    transactGetParams(_items, options = {}, meta = false) {
      let items = Array.isArray(_items) ? _items : _items ? [_items] : [];
      if (items.length === 0)
        utils_1.error(`No items supplied`);
      const {capacity} = options, _args = __rest(options, ["capacity"]);
      const args = Object.keys(_args).filter((x) => !["execute", "parse"].includes(x));
      if (args.length > 0)
        utils_1.error(`Invalid transactGet options: ${args.join(", ")}`);
      if (capacity !== void 0 && (typeof capacity !== "string" || !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase())))
        utils_1.error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
      let Entities = [];
      const payload = Object.assign({
        TransactItems: items.map((item) => {
          let {Entity: Entity2} = item, _item = __rest(item, ["Entity"]);
          Entities.push(Entity2);
          if (!("Get" in _item) || Object.keys(_item).length > 1)
            utils_1.error(`Invalid transaction item. Use the 'getTransaction' method on an entity.`);
          return _item;
        })
      }, capacity ? {ReturnConsumedCapacity: capacity.toUpperCase()} : null);
      return meta ? {Entities, payload} : payload;
    }
    transactWrite(items, options = {}, params = {}) {
      return __awaiter(this, void 0, void 0, function* () {
        const payload = this.transactWriteParams(items, options);
        if (options.execute || this.autoExecute && options.execute !== false) {
          const result = yield this.DocumentClient.transactWrite(payload).promise();
          if (options.parse || this.autoParse && options.parse !== false) {
            return result;
          } else {
            return result;
          }
        } else {
          return payload;
        }
      });
    }
    transactWriteParams(_items, options = {}) {
      let items = Array.isArray(_items) ? _items : _items ? [_items] : [];
      if (items.length === 0)
        utils_1.error(`No items supplied`);
      const {
        capacity,
        metrics,
        token
      } = options, _args = __rest(options, ["capacity", "metrics", "token"]);
      const args = Object.keys(_args).filter((x) => !["execute", "parse"].includes(x));
      if (args.length > 0)
        utils_1.error(`Invalid transactWrite options: ${args.join(", ")}`);
      if (capacity !== void 0 && (typeof capacity !== "string" || !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase())))
        utils_1.error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);
      if (metrics !== void 0 && (typeof metrics !== "string" || !["NONE", "SIZE"].includes(metrics.toUpperCase())))
        utils_1.error(`'metrics' must be one of 'NONE' OR 'SIZE'`);
      if (token !== void 0 && (typeof token !== "string" || token.trim().length === 0 || token.trim().length > 36))
        utils_1.error(`'token' must be a string up to 36 characters long `);
      const payload = Object.assign({
        TransactItems: items.map((item) => {
          if (!("ConditionCheck" in item) && !("Delete" in item) && !("Put" in item) && !("Update" in item) || Object.keys(item).length > 1)
            utils_1.error(`Invalid transaction item. Use the 'putTransaction', 'updateTransaction', 'deleteTransaction', or 'conditionCheck' methods on an entity.`);
          return item;
        })
      }, capacity ? {ReturnConsumedCapacity: capacity.toUpperCase()} : null, metrics ? {ReturnItemCollectionMetrics: metrics.toUpperCase()} : null, token ? {ClientRequestToken: token.trim()} : null);
      return payload;
    }
    parse(entity, input, include = []) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!this[entity])
          utils_1.error(`'${entity}' is not a valid Entity`);
        return this[entity].parse(input, include);
      });
    }
    get(entity, item = {}, options = {}, params = {}) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!this[entity])
          utils_1.error(`'${entity}' is not a valid Entity`);
        return this[entity].get(item, options, params);
      });
    }
    delete(entity, item = {}, options = {}, params = {}) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!this[entity])
          utils_1.error(`'${entity}' is not a valid Entity`);
        return this[entity].delete(item, options, params);
      });
    }
    update(entity, item = {}, options = {}, params = {}) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!this[entity])
          utils_1.error(`'${entity}' is not a valid Entity`);
        return this[entity].update(item, options, params);
      });
    }
    put(entity, item = {}, options = {}, params = {}) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!this[entity])
          utils_1.error(`'${entity}' is not a valid Entity`);
        return this[entity].put(item, options, params);
      });
    }
  };
  exports2.default = Table2;
});

// node_modules/dynamodb-toolbox/dist/index.js
var require_dist = __commonJS((exports2) => {
  "use strict";
  var __importDefault = exports2 && exports2.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports2, "__esModule", {value: true});
  exports2.Entity = exports2.Table = void 0;
  /**
   * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
   * @author Jeremy Daly <jeremy@jeremydaly.com>
   * @version 0.3.0
   * @license MIT
   */
  var Table_1 = __importDefault(require_Table());
  exports2.Table = Table_1.default;
  var Entity_1 = __importDefault(require_Entity());
  exports2.Entity = Entity_1.default;
});

// node_modules/ulid/dist/index.umd.js
var require_index_umd = __commonJS((exports2, module2) => {
  (function(global, factory) {
    typeof exports2 === "object" && typeof module2 !== "undefined" ? factory(exports2) : typeof define === "function" && define.amd ? define(["exports"], factory) : factory(global.ULID = {});
  })(exports2, function(exports3) {
    "use strict";
    function createError(message) {
      var err = new Error(message);
      err.source = "ulid";
      return err;
    }
    var ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
    var ENCODING_LEN = ENCODING.length;
    var TIME_MAX = Math.pow(2, 48) - 1;
    var TIME_LEN = 10;
    var RANDOM_LEN = 16;
    function replaceCharAt(str, index, char) {
      if (index > str.length - 1) {
        return str;
      }
      return str.substr(0, index) + char + str.substr(index + 1);
    }
    function incrementBase32(str) {
      var done = void 0;
      var index = str.length;
      var char = void 0;
      var charIndex = void 0;
      var maxCharIndex = ENCODING_LEN - 1;
      while (!done && index-- >= 0) {
        char = str[index];
        charIndex = ENCODING.indexOf(char);
        if (charIndex === -1) {
          throw createError("incorrectly encoded string");
        }
        if (charIndex === maxCharIndex) {
          str = replaceCharAt(str, index, ENCODING[0]);
          continue;
        }
        done = replaceCharAt(str, index, ENCODING[charIndex + 1]);
      }
      if (typeof done === "string") {
        return done;
      }
      throw createError("cannot increment this string");
    }
    function randomChar(prng) {
      var rand = Math.floor(prng() * ENCODING_LEN);
      if (rand === ENCODING_LEN) {
        rand = ENCODING_LEN - 1;
      }
      return ENCODING.charAt(rand);
    }
    function encodeTime(now, len) {
      if (isNaN(now)) {
        throw new Error(now + " must be a number");
      }
      if (now > TIME_MAX) {
        throw createError("cannot encode time greater than " + TIME_MAX);
      }
      if (now < 0) {
        throw createError("time must be positive");
      }
      if (Number.isInteger(now) === false) {
        throw createError("time must be an integer");
      }
      var mod = void 0;
      var str = "";
      for (; len > 0; len--) {
        mod = now % ENCODING_LEN;
        str = ENCODING.charAt(mod) + str;
        now = (now - mod) / ENCODING_LEN;
      }
      return str;
    }
    function encodeRandom(len, prng) {
      var str = "";
      for (; len > 0; len--) {
        str = randomChar(prng) + str;
      }
      return str;
    }
    function decodeTime(id) {
      if (id.length !== TIME_LEN + RANDOM_LEN) {
        throw createError("malformed ulid");
      }
      var time = id.substr(0, TIME_LEN).split("").reverse().reduce(function(carry, char, index) {
        var encodingIndex = ENCODING.indexOf(char);
        if (encodingIndex === -1) {
          throw createError("invalid character found: " + char);
        }
        return carry += encodingIndex * Math.pow(ENCODING_LEN, index);
      }, 0);
      if (time > TIME_MAX) {
        throw createError("malformed ulid, timestamp too large");
      }
      return time;
    }
    function detectPrng() {
      var allowInsecure = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
      var root = arguments[1];
      if (!root) {
        root = typeof window !== "undefined" ? window : null;
      }
      var browserCrypto = root && (root.crypto || root.msCrypto);
      if (browserCrypto) {
        return function() {
          var buffer = new Uint8Array(1);
          browserCrypto.getRandomValues(buffer);
          return buffer[0] / 255;
        };
      } else {
        try {
          var nodeCrypto = require("crypto");
          return function() {
            return nodeCrypto.randomBytes(1).readUInt8() / 255;
          };
        } catch (e) {
        }
      }
      if (allowInsecure) {
        try {
          console.error("secure crypto unusable, falling back to insecure Math.random()!");
        } catch (e) {
        }
        return function() {
          return Math.random();
        };
      }
      throw createError("secure crypto unusable, insecure Math.random not allowed");
    }
    function factory(currPrng) {
      if (!currPrng) {
        currPrng = detectPrng();
      }
      return function ulid3(seedTime) {
        if (isNaN(seedTime)) {
          seedTime = Date.now();
        }
        return encodeTime(seedTime, TIME_LEN) + encodeRandom(RANDOM_LEN, currPrng);
      };
    }
    function monotonicFactory(currPrng) {
      if (!currPrng) {
        currPrng = detectPrng();
      }
      var lastTime = 0;
      var lastRandom = void 0;
      return function ulid3(seedTime) {
        if (isNaN(seedTime)) {
          seedTime = Date.now();
        }
        if (seedTime <= lastTime) {
          var incrementedRandom = lastRandom = incrementBase32(lastRandom);
          return encodeTime(lastTime, TIME_LEN) + incrementedRandom;
        }
        lastTime = seedTime;
        var newRandom = lastRandom = encodeRandom(RANDOM_LEN, currPrng);
        return encodeTime(seedTime, TIME_LEN) + newRandom;
      };
    }
    var ulid2 = factory();
    exports3.replaceCharAt = replaceCharAt;
    exports3.incrementBase32 = incrementBase32;
    exports3.randomChar = randomChar;
    exports3.encodeTime = encodeTime;
    exports3.encodeRandom = encodeRandom;
    exports3.decodeTime = decodeTime;
    exports3.detectPrng = detectPrng;
    exports3.factory = factory;
    exports3.monotonicFactory = monotonicFactory;
    exports3.ulid = ulid2;
    Object.defineProperty(exports3, "__esModule", {value: true});
  });
});

// src/api/status/statusById.ts
__markAsModule(exports);
__export(exports, {
  handler: () => handler
});

// node_modules/source-map-support/register.js
require_source_map_support().install();

// src/data/entities/status.ts
var import_dynamodb_toolbox2 = __toModule(require_dist());

// src/data/table.ts
var import_aws_sdk = __toModule(require("aws-sdk"));
var import_dynamodb_toolbox = __toModule(require_dist());
var DocumentClient = new import_aws_sdk.DynamoDB.DocumentClient();
var table = new import_dynamodb_toolbox.Table({
  name: process.env.DYNAMODB_TABLE,
  partitionKey: "PK",
  sortKey: "SK",
  DocumentClient
});

// src/data/entities/status.ts
var StatusType;
(function(StatusType2) {
  StatusType2[StatusType2["OUT_OF_OFFICE"] = 0] = "OUT_OF_OFFICE";
  StatusType2[StatusType2["REMOTE"] = 1] = "REMOTE";
  StatusType2[StatusType2["SICK"] = 2] = "SICK";
  StatusType2[StatusType2["VACATION"] = 3] = "VACATION";
  StatusType2[StatusType2["BUSINESS_TRIP"] = 4] = "BUSINESS_TRIP";
})(StatusType || (StatusType = {}));
var Status = new import_dynamodb_toolbox2.Entity({
  table,
  name: "Status",
  attributes: {
    PK: {hidden: true, partitionKey: true, default: () => "STATUS"},
    SK: {hidden: true, sortKey: true, prefix: "STATUS", default: (data) => data.id},
    GSI1PK: {hidden: true, partitionKey: "GSI1", default: () => "STATUS"},
    GSI1SK: {hidden: true, sortKey: "GSI1", prefix: "DATE", default: (data) => data.endsAt},
    id: ["SK", 0],
    userId: {type: "string"},
    allDay: {type: "boolean"},
    statusType: {type: "string"},
    createdAt: {type: "string"},
    updatedAt: {type: "string"},
    startsAt: {type: "string"},
    endsAt: {type: "string"},
    message: {type: "string"}
  }
});

// src/data/repos/status.ts
var import_ulid = __toModule(require_index_umd());
var statusById = async (id) => {
  const result = await Status.get({id});
  if (!result || !result.Item) {
    throw new Error(`Status not found`);
  }
  console.log("DB::statusById");
  return result.Item;
};

// src/api/status/statusById.ts
var handler = async (event) => {
  const {id} = event.arguments;
  console.log("LambdaEvent", event);
  console.log("EventID", id);
  const sts = await statusById(id);
  console.log("Status", sts);
  return sts;
};
//# sourceMappingURL=statusById.js.map
