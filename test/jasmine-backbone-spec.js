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
  });

  describe('once installed', function() {
    beforeEach(function() {
      jasmine.Backbone.useMock();
    });

    describe('with views', function() {
      beforeEach(function() {
        this.View = Backbone.View.extend({
        });

        this.view = new this.View();
      });
    });

    describe('with models', function() {
      beforeEach(function() {
        this.Model1 = Backbone.Model.extend({
          defaults: {
            foo : 'bar'
          },

          urlRoot: '/foo'
        });

        this.Model1 = Backbone.Model.extend({
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

        this.model2 = new this.Model1({
        	id: 1,
          bar: 'foo'
        });
      });

      it('should check if model is new', function() {
        expect(this.model1).toBeNewModel();
        expect(this.model2).not.toBeNewModel();
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
    });

    describe('with collections', function() {
      beforeEach(function() {
        this.Collection1 = Backbone.Collection.extend({
          url: '/foo'
        });

        this.collection1 = new this.Collection1();
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
    });
  });
});