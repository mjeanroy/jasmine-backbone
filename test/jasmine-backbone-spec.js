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

(function() {

  (function(factory) {
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(['underscore', 'backbone'], factory);
    } else {
      // Browser globals
      factory(_, Backbone);
    }

  }(function(_, Backbone) {

    describe('Jasmine-Backbone', function() {

      beforeEach(function() {
        jasmine.addMatchers({
          toBeASpy: function(util, customEqualityTesters) {
            return {
              compare: function(actual) {
                return {
                  pass: jasmine.isSpy(actual)
                };
              }
            }
          }
        });
      });

      describe('installation', function() {
        it('should mock backbone views methods', function() {
          jasmine.Backbone.useMock();

          var ViewProto = Backbone.View.prototype;
          expect(ViewProto.initialize).toBeASpy();
          expect(ViewProto.render).toBeASpy();
          expect(ViewProto.listenToOnce).toBeASpy();
          expect(ViewProto.listenTo).toBeASpy();
          expect(ViewProto.remove).toBeASpy();
        });

        it('should mock backbone models methods', function() {
          jasmine.Backbone.useMock();

          var ModelProto = Backbone.Model.prototype;
          expect(ModelProto.fetch).toBeASpy();
          expect(ModelProto.save).toBeASpy();
          expect(ModelProto.destroy).toBeASpy();
          expect(ModelProto.trigger).toBeASpy();
        });

        it('should mock backbone collections methods', function() {
          jasmine.Backbone.useMock();

          var CollectionProto = Backbone.Collection.prototype;
          expect(CollectionProto.fetch).toBeASpy();
          expect(CollectionProto.trigger).toBeASpy();
        });

        it('should reset backbone object methods', function() {
          jasmine.Backbone.useMock();

          var methods = ['initialize', 'render', 'listenTo', 'listenToOnce', 'remove'];

          var view = new Backbone.View();
          _.each(methods, function(method) {
            spyOn(view[method].calls, 'reset');
          });

          jasmine.Backbone.reset(view, methods);

          _.each(methods, function(method) {
            expect(view[method].calls.reset).toHaveBeenCalled();
          });
        });

        it('should reset backbone view methods', function() {
          jasmine.Backbone.useMock();

          var methods = ['initialize', 'render', 'listenTo', 'listenToOnce', 'remove'];
          _.each(methods, function(method) {
            spyOn(Backbone.View.prototype[method].calls, 'reset');
          });

          jasmine.Backbone.resetAll();

          _.each(methods, function(method) {
            expect(Backbone.View.prototype[method].calls.reset).toHaveBeenCalled();
          });
        });

        it('should reset backbone models methods', function() {
          jasmine.Backbone.useMock();

          var methods = ['fetch', 'save', 'destroy', 'trigger'];
          _.each(methods, function(method) {
            spyOn(Backbone.Model.prototype[method].calls, 'reset');
          });

          jasmine.Backbone.resetAll();

          _.each(methods, function(method) {
            expect(Backbone.Model.prototype[method].calls.reset).toHaveBeenCalled();
          });
        });

        it('should reset backbone collections methods', function() {
          jasmine.Backbone.useMock();

          var methods = ['fetch', 'trigger']
          _.each(methods, function(method) {
            spyOn(Backbone.Collection.prototype[method].calls, 'reset');
          });

          jasmine.Backbone.resetAll();

          _.each(methods, function(method) {
            expect(Backbone.Collection.prototype[method].calls.reset).toHaveBeenCalled();
          });
        });
      });

      describe('once installed', function() {
        beforeEach(function() {
          jasmine.Backbone.useMock();
        });

        describe('with views', function() {
          beforeEach(function() {
            this.View1 = Backbone.View.extend({
              tagName: 'div',
              className: 'foo'
            });

            this.View2 = Backbone.View.extend({
              tagName: function() {
                return 'div';
              },
              className: function() {
                return 'foo';
              }
            });

            this.view1 = new this.View1();
            this.view2 = new this.View2();
          });

          it('should check if object is a backbone view', function() {
            expect(new Backbone.View()).toBeABackboneView();
            expect(new Backbone.Collection()).not.toBeABackboneView();
            expect(new Backbone.Model()).not.toBeABackboneView();
          });

          it('should check if view has class name', function() {
            expect(this.view1).toHaveViewClassName('foo');
            expect(this.view2).toHaveViewClassName('foo');

            expect(this.view1).not.toHaveViewClassName('bar');
            expect(this.view2).not.toHaveViewClassName('bar');
          });

          it('should check if view has tag name', function() {
            expect(this.view1).toHaveViewTagName('div');
            expect(this.view2).toHaveViewTagName('div');

            expect(this.view1).not.toHaveViewTagName('ul');
            expect(this.view2).not.toHaveViewTagName('ul');

            expect(new Backbone.View()).toHaveViewTagName('div');
            expect(new Backbone.View()).not.toHaveViewTagName('bar');
          });

          it('should check if view has given properties', function() {
            expect(this.view1).toHaveViewProperties('div', 'foo');
            expect(this.view1).not.toHaveViewProperties('ul', 'foo');
            expect(this.view1).not.toHaveViewProperties('div', 'bar');
            expect(this.view1).not.toHaveViewProperties('ul', 'bar');
          });

          it('should check if view has been removed', function() {
            expect(this.view1).not.toHaveBeenRemoved();

            this.view1.remove();

            expect(this.view1).toHaveBeenRemoved();
          });

          it('should check if view triggered specified event', function() {
            expect(this.view1).not.toHaveTriggered('foo');

            this.view1.trigger('foo');

            expect(this.view1).toHaveTriggered('foo');
          });

          it('should check if view triggered specified event with arguments', function() {
            var arg1 = {
              id: 1
            };

            var arg2 = 'bar';

            expect(this.view1).not.toHaveTriggeredWith('foo', arg1, arg2);

            this.view1.trigger('foo', arg1, arg2);

            expect(this.view1).toHaveTriggeredWith('foo', arg1, arg2);
            expect(this.view1).toHaveTriggeredWith('foo', jasmine.objectContaining(arg1), arg2);
            expect(this.view1).not.toHaveTriggeredWith('foo', arg1, 'foobar');
          });

          it('should check if view listen to specified event', function() {
            var model = new Backbone.Model({
              id: 1
            });

            expect(this.view1).not.toListenTo(model, 'foo');

            this.view1.listenTo(model, 'foo', jasmine.any(Function));

            expect(this.view1).toListenTo(model, 'foo');
            expect(this.view1).not.toListenTo(model, 'bar');
          });

          it('should check if view listen to specified event with specified callback', function() {
            var model = new Backbone.Model({
              id: 1
            });

            var callback = function() {};
            var callback2 = function() {};

            expect(this.view1).not.toListenTo(model, 'foo');

            this.view1.listenTo(model, 'foo', callback);

            expect(this.view1).toListenTo(model, 'foo', callback);
            expect(this.view1).not.toListenTo(model, 'foo', callback2);
          });

          it('should check if view listen once to specified event', function() {
            var model = new Backbone.Model({
              id: 1
            });

            expect(this.view1).not.toListenToOnce(model, 'foo');

            this.view1.listenToOnce(model, 'foo', jasmine.any(Function));

            expect(this.view1).toListenToOnce(model, 'foo');
            expect(this.view1).not.toListenToOnce(model, 'bar');
          });

          it('should check if view listen once to specified event with specified callback', function() {
            var model = new Backbone.Model({
              id: 1
            });

            var callback = function() {};
            var callback2 = function() {};

            expect(this.view1).not.toListenToOnce(model, 'foo');

            this.view1.listenToOnce(model, 'foo', callback);

            expect(this.view1).toListenToOnce(model, 'foo', callback);
            expect(this.view1).not.toListenToOnce(model, 'foo', callback2);
          });
        });

        describe('with models', function() {
          beforeEach(function() {
            this.Model1 = Backbone.Model.extend({
              defaults: {
                foo : 'bar'
              },

              urlRoot: '/foo',

              validate: function() {
                if (this.get('foo') === 'foo') {
                  return 'foo must not be foo';
                }
              }
            });

            this.Model2 = Backbone.Model.extend({
              defaults: {
                foo : 'bar'
              },

              urlRoot: function() {
                return '/foo';
              }
            });

            this.model1 = new this.Model1({
              bar: 'foo',
              sub: {
                id: 1
              }
            });

            this.model2 = new this.Model2({
              id: 1,
              bar: 'foo'
            });
          });

          it('should check if an object is a backbone model', function() {
            expect(this.model1).toBeABackboneModel();
            expect({}).not.toBeABackboneModel();
            expect(new Backbone.Collection()).not.toBeABackboneModel();
            expect(new Backbone.View()).not.toBeABackboneModel();
          });

          it('should check if model is new', function() {
            expect(this.model1).toBeNewModel();
            expect(this.model2).not.toBeNewModel();
          });

          it('should check model id with default id attribute', function() {
            expect(this.model2).toHaveModelId(1);
            expect(this.model2).not.toHaveModelId(2);
          });

          it('should check model id with custom id attribute', function() {
            var Model = Backbone.Model.extend({
              idAttribute: '_id'
            });

            var model = new Model({
              _id: 10
            });

            expect(model).toHaveModelId(10);
            expect(model).not.toHaveModelId(20);
          });

          it('should check model id with id object', function() {
            var model = new this.Model1({
              id: {
                foo: 'bar'
              }
            });

            expect(model).toHaveModelId({
              foo: 'bar'
            });

            expect(model).not.toHaveModelId({
              foo: 'foo'
            });
          });

          it('should check if a model has an attribute', function() {
            expect(this.model1).toHaveModelAttribute('foo');
            expect(this.model1).toHaveModelAttribute('bar');
            expect(this.model1).not.toHaveModelAttribute('foobar');
          });

          it('should check if a model has an attribute with expected value', function() {
            expect(this.model1).toHaveModelAttribute('foo', 'bar');
            expect(this.model1).toHaveModelAttribute('bar', 'foo');
            expect(this.model1).toHaveModelAttribute('sub', {
              id: 1
            });

            expect(this.model1).not.toHaveModelAttribute('foo', 'foo');
            expect(this.model1).not.toHaveModelAttribute('bar', 'bar');
            expect(this.model1).not.toHaveModelAttribute('sub', {
              id: 2
            });
          });

          it('should check if a model has a set of attributes', function() {
            expect(this.model1).toHaveModelAttribute({
              foo: 'bar',
              bar: 'foo',
              sub: {
                id: 1
              }
            });

            expect(this.model1).not.toHaveModelAttribute({
              foo: 'foo',
              bar: 'bar'
            });
          });

          it('should check if a model is valid', function() {
            expect(this.model1).toBeValidModel();

            this.model1.set('foo', 'foo');

            expect(this.model1).not.toBeValidModel();
          });

          it('should check model root URL', function() {
            expect(this.model1).toHaveModelURLRoot('/foo');
            expect(this.model2).toHaveModelURLRoot('/foo');

            expect(this.model1).not.toHaveModelURLRoot('/bar');
            expect(this.model2).not.toHaveModelURLRoot('/bar');
          });

          it('should check model URL', function() {
            expect(this.model1).toHaveModelURL('/foo');
            expect(this.model2).toHaveModelURL('/foo/1');

            expect(this.model1).not.toHaveModelURL('/bar');
            expect(this.model2).not.toHaveModelURL('/bar');
          });

          it('should check if model has been fetched', function() {
            expect(this.model1).not.toHaveBeenFetched();

            this.model1.fetch();

            expect(this.model1).toHaveBeenFetched();
          });

          it('should check if model has been saved', function() {
            expect(this.model1).not.toHaveBeenSaved();

            this.model1.save();

            expect(this.model1).toHaveBeenSaved();
          });

          it('should check if model has been destroyed', function() {
            expect(this.model1).not.toHaveBeenDestroyed();

            this.model1.destroy();

            expect(this.model1).toHaveBeenDestroyed();
          });

          it('should check if model triggered specified event', function() {
            expect(this.model1).not.toHaveTriggered('foo');

            this.model1.trigger('foo');

            expect(this.model1).toHaveTriggered('foo');
          });

          it('should check if model triggered specified event with arguments', function() {
            var arg1 = {
              id: 1
            };

            var arg2 = 'bar';

            expect(this.model1).not.toHaveTriggeredWith('foo', arg1, arg2);

            this.model1.trigger('foo', arg1, arg2);

            expect(this.model1).toHaveTriggeredWith('foo', arg1, arg2);
            expect(this.model1).toHaveTriggeredWith('foo', jasmine.objectContaining(arg1), arg2);
            expect(this.model1).not.toHaveTriggeredWith('foo', arg1, 'foobar');
          });

          it('should check if model listen to specified event', function() {
            var model = new Backbone.Model({
              id: 1
            });

            expect(this.model1).not.toListenTo(model, 'foo');

            this.model1.listenTo(model, 'foo', jasmine.any(Function));

            expect(this.model1).toListenTo(model, 'foo');
            expect(this.model1).not.toListenTo(model, 'bar');
          });

          it('should check if model listen to specified event with specified callback', function() {
            var model = new Backbone.Model({
              id: 1
            });

            var callback = function() {};
            var callback2 = function() {};

            expect(this.model1).not.toListenTo(model, 'foo');

            this.model1.listenTo(model, 'foo', callback);

            expect(this.model1).toListenTo(model, 'foo', callback);
            expect(this.model1).not.toListenTo(model, 'bar', callback2);
          });

          it('should check if model listen once to specified event', function() {
            var model = new Backbone.Model({
              id: 1
            });

            expect(this.model1).not.toListenToOnce(model, 'foo');

            this.model1.listenToOnce(model, 'foo', jasmine.any(Function));

            expect(this.model1).toListenToOnce(model, 'foo');
            expect(this.model1).not.toListenToOnce(model, 'bar');
          });

          it('should check if model listen once to specified event with specified callback', function() {
            var model = new Backbone.Model({
              id: 1
            });

            var callback = function() {};
            var callback2 = function() {};

            expect(this.model1).not.toListenToOnce(model, 'foo');

            this.model1.listenToOnce(model, 'foo', callback);

            expect(this.model1).toListenToOnce(model, 'foo', callback);
            expect(this.model1).not.toListenToOnce(model, 'foo', callback2);
          });

          it('should compare json representations of backbone models', function() {
            var m1 = new Backbone.Model({
              id: 1
            });

            var m2 = new Backbone.Model({
              id: 1
            });

            var m3 = new Backbone.Model({
              id: 2
            });

            expect(m1).toEqualAsJSON(m2);
            expect(m1).not.toEqualAsJSON(m3);
          });

          it('should compare json representations of backbone model and json object', function() {
            var m1 = new Backbone.Model({
              id: 1
            });

            var m2 = {
              id: 1
            };

            var m3 = {
              id: 2
            };

            expect(m1).toEqualAsJSON(m2);
            expect(m1).not.toEqualAsJSON(m3);
          });

          it('should compare partial json representations of backbone models', function() {
            var m1 = new Backbone.Model({
              id: 1,
              foo: 'bar'
            });

            var m2 = new Backbone.Model({
              id: 1
            });

            var m3 = new Backbone.Model({
              id: 2
            });

            expect(m1).toEqualAsPartialJSON(m2);
            expect(m1).not.toEqualAsPartialJSON(m3);
          });

          it('should compare partial json representations of backbone model and json object', function() {
            var m1 = new Backbone.Model({
              id: 1,
              foo: 'bar'
            });

            var m2 = {
              id: 1
            };

            var m3 = {
              id: 2
            };

            expect(m1).toEqualAsPartialJSON(m2);
            expect(m1).not.toEqualAsPartialJSON(m3);
          });
        });

        describe('with collections', function() {
          beforeEach(function() {
            this.Collection1 = Backbone.Collection.extend({
              url: '/foo'
            });

            this.collection1 = new this.Collection1();
          });

          it('should check if an object is a backbone collection', function() {
            expect(this.collection1).toBeABackboneCollection();
            expect({}).not.toBeABackboneCollection();
            expect(new Backbone.Model()).not.toBeABackboneCollection();
            expect(new Backbone.View()).not.toBeABackboneCollection();
          });

          it('should check if a collection has been fetched', function() {
            expect(this.collection1).not.toHaveBeenFetched();

            this.collection1.fetch();

            expect(this.collection1).toHaveBeenFetched();
          });

          it('should check if a collection has given URL', function() {
            expect(this.collection1).toHaveCollectionURL('/foo');
            expect(this.collection1).not.toHaveCollectionURL('/bar');
          });

          it('should check if backbone collection contains given model', function() {
            var model1 = new Backbone.Model({
              id: 1
            });

            var model2 = new Backbone.Model();

            var model3 = new Backbone.Model();

            this.collection1.push(model1);
            this.collection1.push(model2);

            expect(this.collection1).toContainModel(model1);
            expect(this.collection1).toContainModel(model2);
            expect(this.collection1).not.toContainModel(model3);
          });

          it('should check backbone collection size', function() {
            var model1 = new Backbone.Model({
              id: 1
            });

            var model2 = new Backbone.Model();

            var model3 = new Backbone.Model();

            this.collection1.push(model1);
            this.collection1.push(model2);

            expect(this.collection1).toHaveCollectionSize(2);
            expect(this.collection1).not.toHaveCollectionSize(1);
          });

          it('should check if backbone collection is empty', function() {
            expect(this.collection1).toBeEmptyCollection();

            var model1 = new Backbone.Model({
              id: 1
            });

            this.collection1.push(model1);

            expect(this.collection1).not.toBeEmptyCollection();
          });

          it('should check if collection triggered specified event', function() {
            expect(this.collection1).not.toHaveTriggered('foo');

            this.collection1.trigger('foo');

            expect(this.collection1).toHaveTriggered('foo');
          });

          it('should check if collection triggered specified event with arguments', function() {
            var arg1 = {
              id: 1
            };

            var arg2 = 'bar';

            expect(this.collection1).not.toHaveTriggeredWith('foo', arg1, arg2);

            this.collection1.trigger('foo', arg1, arg2);

            expect(this.collection1).toHaveTriggeredWith('foo', arg1, arg2);
            expect(this.collection1).toHaveTriggeredWith('foo', jasmine.objectContaining(arg1), arg2);
            expect(this.collection1).not.toHaveTriggeredWith('foo', arg1, 'foobar');
          });

          it('should check if collection listen to specified event', function() {
            var model = new Backbone.Model({
              id: 1
            });

            expect(this.collection1).not.toListenTo(model, 'foo');

            this.collection1.listenTo(model, 'foo', jasmine.any(Function));

            expect(this.collection1).toListenTo(model, 'foo');
            expect(this.collection1).not.toListenTo(model, 'bar');
          });

          it('should check if collection listen to specified event with specified callback', function() {
            var model = new Backbone.Model({
              id: 1
            });

            var callback = function() {};
            var callback2 = function() {};

            expect(this.collection1).not.toListenTo(model, 'foo');

            this.collection1.listenTo(model, 'foo', callback);

            expect(this.collection1).toListenTo(model, 'foo', callback);
            expect(this.collection1).not.toListenTo(model, 'foo', callback2);
          });

          it('should check if collection listen once to specified event', function() {
            var model = new Backbone.Model({
              id: 1
            });

            expect(this.collection1).not.toListenToOnce(model, 'foo');

            this.collection1.listenToOnce(model, 'foo', jasmine.any(Function));

            expect(this.collection1).toListenToOnce(model, 'foo');
            expect(this.collection1).not.toListenToOnce(model, 'bar');
          });

          it('should check if collection listen once to specified event with specified callback', function() {
            var model = new Backbone.Model({
              id: 1
            });

            var callback = function() {};
            var callback2 = function() {};

            expect(this.collection1).not.toListenToOnce(model, 'foo');

            this.collection1.listenToOnce(model, 'foo', callback);

            expect(this.collection1).toListenToOnce(model, 'foo', callback);
            expect(this.collection1).not.toListenToOnce(model, 'foo', callback2);
          });

          it('should compare json representations of backbone collections', function() {
            var c1 = new Backbone.Collection([{
              id: 1
            }]);

            var c2 = new Backbone.Collection([{
              id: 1
            }]);

            var c3 = new Backbone.Collection([{
              id: 2
            }]);

            expect(c1).toEqualAsJSON(c2);
            expect(c1).not.toEqualAsJSON(c3);
          });

          it('should compare json representations of backbone collections and json array', function() {
            var c1 = new Backbone.Collection([{
              id: 1
            }]);

            var c2 = [{
              id: 1
            }];

            var c3 = [{
              id: 2
            }];

            expect(c1).toEqualAsJSON(c2);
            expect(c1).not.toEqualAsJSON(c3);
          });

          it('should compare partial json representations of backbone collections', function() {
            var c1 = new Backbone.Collection([{
              id: 1,
              foo: 'bar'
            }]);

            var c2 = new Backbone.Collection([{
              id: 1
            }]);

            var c3 = new Backbone.Collection([{
              id: 2
            }]);

            expect(c1).toEqualAsPartialJSON(c2);
            expect(c1).not.toEqualAsPartialJSON(c3);
          });

          it('should compare partial json representations of backbone collections and json array', function() {
            var c1 = new Backbone.Collection([{
              id: 1,
              foo: 'bar'
            }]);

            var c2 = [{
              id: 1
            }];

            var c3 = [{
              id: 2
            }];

            expect(c1).toEqualAsPartialJSON(c2);
            expect(c1).not.toEqualAsPartialJSON(c3);
          });
        });
      });
    });
  }));

})();