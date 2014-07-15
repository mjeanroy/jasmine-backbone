/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Mickael Jeanroy <mickael.jeanroy@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function(_, Backbone, undefined) {

  // Check version
  var JASMINE_VERSION = (function() {
    var version = jasmine.version_ || jasmine.version;
    if (version.major) {
      version = version.major;
    } else {
      version = parseInt(version.split('.')[0], 10);
    }
    return version;
  })();

  var IS_JASMINE_1 = JASMINE_VERSION === 1;
  var IS_JASMINE_2 = JASMINE_VERSION === 2;

  var pp = function(message) {
    var placeholders = [].slice.call(arguments, 1);
    for (var i = 0, size = placeholders.length; i < size; ++i) {
      if (placeholders.hasOwnProperty(i)) {
        message = message.replace('{{%' + i + '}}', jasmine.pp(placeholders[i]));
      }
    }
    return message;
  };

  var andCallThrough = function(spy) {
    if (IS_JASMINE_1) {
      spy.andCallThrough();
    } else {
      spy.and.callThrough();
    }
    return spy;
  };

  var isSpy = function(spy) {
    return jasmine.isSpy(spy);
  };

  var spyIf = function(obj, methodName) {
    if (!isSpy(obj[methodName])) {
      var spy = spyOn(obj, methodName);
      andCallThrough(spy);
    }
    return obj[methodName];
  };

  var spyEach = function(obj, methods) {
    if (!_.isArray(methods)) {
      methods = [methods];
    }

    if (!_.isArray(obj)) {
      obj = [obj];
    }

    _.each(obj, function(o) {
      _.each(methods, function(methodName) {
        spyIf(o, methodName);
      });
    });
  };

  var resetAll = function(obj, methods) {
    if (!methods || _.isEmpty(methods)) {
      methods = _.methods(obj);
    }

    _.each(methods, function(method) {
      if (jasmine.isSpy(obj[method])) {
        var spy = obj[method];
        if (IS_JASMINE_1) {
          spy.reset();
        } else {
          spy.calls.reset();
        }
      }
    });
  };

  var isInstanceOf = function(obj, Klass) {
    return obj instanceof Klass;
  };

  var isBackboneModel = function(obj) {
    return isInstanceOf(obj, Backbone.Model);
  };

  var isBackboneCollection = function(obj) {
    return isInstanceOf(obj, Backbone.Collection);
  };

  var isBackboneView = function(obj) {
    return isInstanceOf(obj, Backbone.View);
  };

  var hasAttribute = function(model, name) {
    return model.has(name);
  };

  var isAttributeEqualTo = function(model, name, value, equalsFunction) {
    return equalsFunction(model.get(name), value);
  };

  jasmine.Backbone = {
    viewMethods: ['initialize', 'render', 'listenToOnce', 'listenTo', 'remove'],
    modelMethods: ['fetch', 'save', 'destroy', 'trigger'],
    collectionMethods: ['fetch', 'trigger'],

    useMock: function() {
      spyEach(Backbone.View.prototype, jasmine.Backbone.viewMethods);
      spyEach(Backbone.Model.prototype, jasmine.Backbone.modelMethods);
      spyEach(Backbone.Collection.prototype, jasmine.Backbone.collectionMethods);
    },

    mockModel: function(model, methods) {
      methods = jasmine.Backbone.modelMethods.concat(methods || []);
      spyEach(model, methods);
    },

    mockCollection: function(collection, methods) {
      methods = jasmine.Backbone.collectionMethods.concat(methods || []);
      spyEach(collection, methods);
    },

    mockView: function(view, methods) {
      methods = jasmine.Backbone.viewMethods.concat(methods || []);
      spyEach(view, methods);
    },

    resetAll: function() {
      var objs = [].slice.call(arguments);

      if (_.isEmpty(objs)) {
        objs = [Backbone.View.prototype, Backbone.Model.prototype, Backbone.Collection.prototype];
      }

      _.each(objs, resetAll);
    },

    reset: function(obj, methods) {
      resetAll(obj, methods);
    }
  };

  var matchers = {
    toBeABackboneModel: function() {
      return {
        pass: isBackboneModel(this.actual),
        message: pp('Expect {{%0}} {{not}} to be a backbone model', this.actual)
      };
    },

    toBeABackboneCollection: function() {
      return {
        pass: isBackboneCollection(this.actual),
        message: pp('Expect {{%0}} {{not}} to be a backbone collection', this.actual)
      };
    },

    toBeABackboneView: function() {
      return {
        pass: isBackboneView(this.actual),
        message: pp('Expect {{%0}} {{not}} to be a backbone view', this.actual)
      };
    },

    toBeNewModel: function() {
      return {
        pass: this.actual.isNew(),
        message: pp('Expect {{%0}} {{not}} to be a new backbone model', this.actual.toJSON())
      };
    },

    toHaveModelId: function(id) {
      var actualId = this.actual.id;
      return {
        pass: this.equals(id, actualId),
        message: pp('Expect backbone model {{%0}} {{not}} to have id {{%1}} but was {{%2}}', this.actual.toJSON(), id, actualId)
      };
    },

    toHaveModelAttribute: function(name, value) {
      var model = this.actual;
      var pass = isBackboneModel(model);
      var obj = name;

      if (pass) {
        if (arguments.length === 1 && _.isString(name)) {
          // Check only that model has given attribute
          pass = pass && hasAttribute(model, obj);
        }
        else {
          // Check attribute and value
          // If first parameter is not a string, then check each entry of object

          if (_.isString(obj)) {
            obj = {};
            obj[name] = value;
          }

          var equalsFunction = this.equals;

          pass = pass && _.every(obj, function(attrValue, attrName) {
            return hasAttribute(model, attrName) && isAttributeEqualTo(model, attrName, attrValue, equalsFunction);
          });
        }
      }

      return {
        pass: pass,
        message: pp('Expect backbone model {{%0}} {{not}} to have attributes {{%1}}', model.toJSON(), obj)
      };
    },

    toBeValidModel: function() {
      return {
        pass: this.actual.isValid(),
        message: pp('Expect {{%0}} to be valid', this.actual.toJSON())
      };
    },

    toHaveModelURL: function(url) {
      var actualURL = _.result(this.actual, 'url');
      return {
        pass: actualURL === url,
        message: pp('Expect model {{%0}} {{not}} to have url {{%1}} but was {{%2}}', this.actual.toJSON(), url, actualURL)
      };
    },

    toHaveCollectionURL: function(url) {
      var actualURL = _.result(this.actual, 'url');
      return {
        pass: _.result(this.actual, 'url') === url,
        message: pp('Expect collection {{not}} to have url {{%0}} but was {{%1}}', url, actualURL)
      };
    },

    toHaveModelURLRoot: function(urlRoot) {
      var actualRootURL = _.result(this.actual, 'urlRoot');
      return {
        pass: actualRootURL === urlRoot,
        message: pp('Expect backbone model {{%0}} {{not}} to have root url {{%1}} but was {{%2}}', this.actual.toJSON(), urlRoot, actualRootURL)
      };
    },

    toHaveViewClassName: function(className) {
      var actualClassName = _.result(this.actual, 'className');
      return {
        pass: actualClassName === className,
        message: pp('Expect backbone view {{not}} to have class name {{%0}} but was {{%1}}', className, actualClassName)
      };
    },

    toHaveViewTagName: function(tagName) {
      var actualTagName = _.result(this.actual, 'tagName');
      return {
        pass: actualTagName === tagName,
        message: pp('Expect view {{not}} to have tag name {{%0}} but was {{%1}}', tagName, actualTagName)
      };
    },

    toHaveViewProperties: function(tagName, className) {
      var actualClassName = _.result(this.actual, 'className');
      var actualTagName = _.result(this.actual, 'tagName');
      return {
        pass: actualTagName === tagName && actualClassName === className,
        message: pp('Expect view {{not}} to have tag name {{%0}} and class name {{%1}} but was {{%2}} and {{%3}}', tagName, className, actualTagName, actualClassName)
      };
    },

    toHaveBeenRemoved: function() {
      return {
        pass: this.callCount(this.actual.remove) > 0,
        message: pp('Expect backbone view {{not}} to have been removed')
      };
    },

    toHaveBeenFetched: function() {
      var actual = this.actual;

      var spy = actual.fetch;
      if (!isSpy(spy)) {
        throw new Error('Fetch function must be a spy, call jasmine.Backbone.useMock() or spy function');
      }

      var type = isBackboneModel(actual) ? 'model' : 'collection';
      var msg = 'Expect backbone ' + type + ' {{not}} to have been fetched';

      return {
        pass: this.callCount(spy) > 0,
        message: pp(msg)
      };
    },

    toHaveBeenSaved: function() {
      var actual = this.actual;

      var spy = actual.save;
      if (!isSpy(spy)) {
        throw new Error('Save function must be a spy, call jasmine.Backbone.useMock() or spy function');
      }

      return {
        pass: this.callCount(spy) > 0,
        message: pp('Expect backbone model {{not}} to have been saved')
      };
    },

    toHaveBeenDestroyed: function() {
      var actual = this.actual;

      var spy = actual.destroy;
      if (!isSpy(spy)) {
        throw new Error('Destroy function must be a spy, call jasmine.Backbone.useMock() or spy function');
      }

      return {
        pass: this.callCount(spy) > 0,
        message: pp('Expect backbone model {{not}} to have been destroyed')
      };
    },

    toContainModel: function(model) {
      return {
        pass: !!this.actual.get(model),
        message: pp('Expect backbone collection {{not}} to contain model {{%0}}', model.toJSON())
      };
    },

    toHaveCollectionSize: function(size) {
      var actualSize = this.actual.length;
      return {
        pass: actualSize === size,
        message: pp('Expect backbone collection {{not}} to have size {{%0}} but was {{%1}}', size, actualSize)
      };
    },

    toBeEmptyCollection: function() {
      var actualSize = this.actual.length;
      return {
        pass: actualSize === 0,
        message: pp('Expect backbone collection {{not}} to be empty but size was {{%0}}', actualSize)
      };
    }
  };

  var jasmineMatchers = {};

  var parseNegateMessage = function(isNot, message) {
    var notKey = isNot ? '{{not}}' : '{{not}} ';
    var notValue = isNot ? 'not' : '';
    return (message || '').replace(notKey, notValue);
  };

  var toJasmineMatcher = {
    1: function(fn) {
      return function() {
        var env = this.env;
        var equals_ = this.env.equals_;

        var ctx = {
          actual: this.actual,
          isNot: this.isNot,
          callCount: function(spy) {
            return spy.callCount;
          },
          argsFor: function(spy, call) {
            return spy.argsForCall[call];
          },
          equals: function() {
            return equals_.apply(env, arguments);
          }
        };

        var result = fn.apply(ctx, arguments);

        // Not yet implemented
        if (!result) {
          return false;
        }

        var isNot = this.isNot;

        if (!result.pass) {
          this.message = function() {
            return parseNegateMessage(isNot, result.message);
          };
        }

        return result.pass;
      };
    },

    2: function(fn) {
      return function(util, customEqualityTesters) {
        var ctx = {
          callCount: function(spy) {
            return spy.calls.count();
          },
          argsFor: function(spy, call) {
            return spy.calls.argsFor(call);
          },
          equals: function(a, b) {
            return util.equals(a, b, customEqualityTesters);
          }
        };

        return {
          compare: function(actual) {
            ctx.actual = actual;
            ctx.isNot = false;

            var args = [].slice.call(arguments, 1);
            var result = fn.apply(ctx, args);

            // Not yet implemented
            if (!result) {
              result = {
                pass: false,
                message: 'Not Yet Implemented'
              };
            }

            return {
              pass: result.pass,
              message: parseNegateMessage(false, result.message)
            };
          },

          negativeCompare: function(actual) {
            ctx.actual = actual;
            ctx.isNot = true;

            var args = [].slice.call(arguments, 1);
            var result = fn.apply(ctx, args);

             // Not yet implemented
            if (!result) {
              result = {
                pass: true,
                message: 'Not Yet Implement'
              };
            }

            return {
              pass: !result.pass,
              message: parseNegateMessage(true, result.message)
            };
          }
        };
      };
    }
  };

  for (var matcher in matchers) {
    if (matchers.hasOwnProperty(matcher)) {
      jasmineMatchers[matcher] = toJasmineMatcher[JASMINE_VERSION](matchers[matcher]);
    }
  }

  beforeEach(function() {
    if (IS_JASMINE_1) {
      this.addMatchers(jasmineMatchers);
    } else {
      jasmine.addMatchers(jasmineMatchers);
    }
  });

})(_, Backbone, void 0);
