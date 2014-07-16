Jasmine-Backbone is a set of custom matchers that I used in my previous projects.

Jasmine-Backbone is compatible with __Jasmine 1.3__ and __Jasmine 2.0__.

## Utils Functions

- `jasmine.Backbone.useMock()`
  - _Must be called at the begining of your test._
  - Mock standards functions of backbone objects.
  - Mock are configured with `callThrough`.

```javascript
beforeEach(function() {
  jasmine.Backbone.useMock();
});
```

- `jasmine.Backbone.mockView(view, [additionalMethods])`
  - Must be call if you want to mock a single view or if you want to mock additional methods on view.
  - Mock are configured with `callThrough`.

```javascript
beforeEach(function() {
  var CustomView = Backbone.View.extend({
    foo: function() {
    }
  });

  // Can be call with constructor
  // Second argument is optional
  jasmine.Backbone.mockView(CustomView, ['foo']);

  // Or with an instance
  var view = new CustomView();
  jasmine.Backbone.mockView(view);
});
```

- `jasmine.Backbone.mockCollection(collection, [additionalMethods])`
  - Must be call if you want to mock a single collection or if you want to mock additional methods on collection.
  - Mock are configured with `callThrough`.

```javascript
beforeEach(function() {
  var CustomCollection = Backbone.Collection.extend();

  // Can be call with constructor
  // Second argument is optional
  jasmine.Backbone.mockCollection(CustomCollection);

  // Or with an instance
  var collection = new CustomCollection();
  jasmine.Backbone.mockCollection(collection);
});
```

- `jasmine.Backbone.mockModel(model, [additionalMethods])`
  - Must be call if you want to mock a single model or if you want to mock additional methods on model.
  - Mock are configured with `callThrough`.

```javascript
beforeEach(function() {
  var CustomModel = Backbone.Model.extend();

  // Can be call with constructor
  // Second argument is optional
  jasmine.Backbone.mockModel(CustomModel);

  // Or with an instance
  var model = new CustomModel();
  jasmine.Backbone.mockCollection(model);
});
```

- `jasmine.Backbone.resetAll(obj...)`
  - Reset calls on spied methods on given objects.

```javascript
beforeEach(function() {
  jasmine.Backbone.resetAll(Backbone.View, Backbone.Model, Backbone.Collection);
});
```

- `jasmine.Backbone.reset(obj, [methods])`
  - Reset given spy methods on given objects.

```javascript
beforeEach(function() {
  jasmine.Backbone.resetAll(Backbone.View, ['listenTo']);
});
```

## Models

- `toBeABackboneModel()`
  - Check that a given value is a backbone model
  - Error message: 'Expect value (not) to be a backbone model'

```javascript
it('should check if an object is a backbone model', function() {
  expect(new Backbone.Model()).toBeABackboneModel();
  expect({}).not.toBeABackboneModel();
  expect(new Backbone.Collection()).not.toBeABackboneModel();
  expect(new Backbone.View()).not.toBeABackboneModel();
});
```

- `toBeNewModel()`
  - Check that a given model is new
  - Error message: 'Expect actual.toJSON() (not) to be a new backbone model'

```javascript
it('should check if model is new', function() {
  expect(new Backbone.Model()).toBeNewModel();
  expect(new Backbone.Model({id: 1})).not.toBeNewModel();
});
```

- `toHaveTriggered(eventName)`
  - Check that a given event has been triggered
  - Error message: 'Expect backbone object (not) to have triggered event eventName'

```javascript
it('should check if model triggered specified event', function() {
  var model = new Backbone.Model();

  expect(model).not.toHaveTriggered('foo');
  model.trigger('foo');
  expect(model).toHaveTriggered('foo');
});
```

- `toHaveTriggeredWith(eventName, args...)`
  - Check that a given event has been triggered with given arguments
  - Error message: 'Expect backbone object (not) to have triggered event eventName with args'

```javascript
it('should check if model triggered specified event with arguments', function() {
  var model = new Backbone.Model();

  var arg1 = {
    id: 1
  };

  var arg2 = 'bar';

  expect(model).not.toHaveTriggeredWith('foo', arg1, arg2);
  model.trigger('foo', arg1, arg2);
  expect(model).toHaveTriggeredWith('foo', arg1, arg2);
  expect(model).toHaveTriggeredWith('foo', jasmine.objectContaining(arg1), arg2);
  expect(model).not.toHaveTriggeredWith('foo', arg1, 'foobar');
});
```

- `toListenTo(target, eventName, [callback])`
  - Check that a given model listen to an expected event
  - Error message: 'Expect backbone object (not) to listen to event eventName on model|collection|view + ' target'

```javascript
it('should check if model listen to specified event', function() {
  var model = new Backbone.Model({
    id: 1
  });

  var target = new Backbone.Model({
    id: 2
  });

  expect(model).not.toListenTo(target, 'foo');

  var callback = function() {};

  model.listenTo(target, 'foo', callback);

  expect(model).toListenTo(target, 'foo');
  expect(model).toListenTo(target, 'foo', callback);

  expect(model).not.toListenTo(target, 'bar');
  expect(model).not.toListenTo(target, 'foo', function() {});
});
```

- `toListenToOnce(target, eventName, [callback])`
  - Check that a given model listen (once) to an expected event
  - Error message: 'Expect backbone object (not) to listen once to event eventName on model|collection|view + ' target'

```javascript
it('should check if model listen once to specified event', function() {
  var model = new Backbone.Model({
    id: 1
  });

  var target = new Backbone.Model({
    id: 2
  });

  expect(model).not.toListenToOnce(target, 'foo');

  var callback = function() {};

  model.listenToOnce(target, 'foo', callback);

  expect(model).toListenToOnce(target, 'foo');
  expect(model).toListenToOnce(target, 'foo', callback);

  expect(model).not.toListenToOnce(target, 'bar');
  expect(model).not.toListenToOnce(target, 'foo', function() {});
});
```

- `toHaveModelId(expectedId)`
  - Check that a given model has expected id.
  - Error message: 'Expect backbone model actual (not) to have id expectedId but was actualId'

```javascript
it('should check model id', function() {
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
```

- `toHaveModelAttribute(name, [value])`
  - Check that a given model is has expected attribute and check value if not omitted.
  - Error message: 'Expect backbone model actual (not) to have attributes expectedAttributes'

```javascript
it('should check model attributes', function() {
  var model = new CustomModel({
    id: 1,
    foo: 'bar',
    sub: {
      id: 1
    }
  });

  expect(model).toHaveModelAttribute('foo');
  expect(model).toHaveModelAttribute('foo', 'bar');

  expect(model).not.toHaveModelAttribute('bar');

  expect(model).toHaveModelAttribute({
    id: 1,
    foo: 'bar',
    sub: {
      id: 1
    }
  });
});
```

- `toBeValidModel()`
  - Check that a given model is valid.
  - Error message: 'Expect actual to be valid'

```javascript
it('should check if model is valid', function() {
  var CustomModel = Backbone.Model({
    urlRoot: '/foo',
    validate: function() {
      if (this.get('foo') === 'foo') {
        return 'foo must not be foo';
      }
    }
  });

  var model = new CustomModel();

  expect(model).toBeValidModel();
  this.model.set('foo', 'foo');
  expect(model).not.toBeValidModel();
});
```

- `toHaveModelURLRoot(expectedRootURL)`
  - Check that a given model has expected root URL.
  - Error message: 'Expect backbone model actual (not) to have root url expectedRootURL but was actualRootURL'

```javascript
it('should check if model root URL', function() {
  var CustomModel = Backbone.Model({
    urlRoot: '/foo'
  });

  var model = new CustomModel();

  expect(model).toHaveModelURLRoot('/foo');
  expect(model).not.toHaveModelURLRoot('/bar');
});
```

- `toHaveModelURL(expectedURL)`
  - Check that a given model has expected URL.
  - Error message: 'Expect model actual {{not}} to have url expectedURL but was actualURL'

```javascript
it('should check if model URL', function() {
  var CustomModel = Backbone.Model({
    urlRoot: '/foo'
  });

  var model1 = new CustomModel();
  var model2 = new CustomModel({
    id: 1
  });

  expect(model1).toHaveModelURL('/foo');
  expect(model2).toHaveModelURL('/foo/1');

  expect(model1).not.toHaveModelURL('/bar');
  expect(model2).not.toHaveModelURL('/bar');
});
```

- `toHaveBeenFetched()`
  - Check that a given model has been fetched
  - Error message: 'Expect backbone model (not) to have been fetched'

```javascript
it('should check if model has been fetched', function() {
  var model = new Backbone.Model({
    id: 1
  });

  expect(model).not.toHaveBeenFetched();
  model.fetch();
  expect(model).toHaveBeenFetched();
});
```

- `toHaveBeenSaved()`
  - Check that a given model has been saved
  - Error message: 'Expect backbone model (not) to have been saved'

```javascript
it('should check if model has been saved', function() {
  var model = new Backbone.Model();

  expect(model).not.toHaveBeenSaved();
  model.save();
  expect(model).toHaveBeenSaved();
});
```

- `toHaveBeenDestroyed()`
  - Check that a given model has been destroyed
  - Error message: 'Expect backbone model (not) to have been destroyed'

```javascript
it('should check if model has been destroyed', function() {
  var model = new Backbone.Model({
    id: 1
  });

  expect(model).not.toHaveBeenDestroyed();
  model.destroy();
  expect(model).toHaveBeenDestroyed();
});
```

- `toEqualAsJSON(json)`
  - Check that a given model has the same json representation as another model or object
  - Error message: 'Expect json representation of backbone model|collection actual (not) to equal json'

```javascript
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
  expect(m1).toEqualAsJSON(m2.toJSON());

  expect(m1).not.toEqualAsJSON(m3);
  expect(m1).not.toEqualAsJSON(m3.toJSON());
});
```

- `toEqualAsPartialJSON(json)`
  - Check that a given model contains the same json representation as another model or object
  - Error message: 'Expect json representation of backbone model|collection actual (not) to partially equal json'

```javascript
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
  expect(m1).toEqualAsPartialJSON(m2.toJSON());

  expect(m1).not.toEqualAsPartialJSON(m3);
  expect(m1).not.toEqualAsPartialJSON(m3.toJSON());
});
```

## Collections

- `toBeABackboneCollection()`
  - Check that a given value is a backbone collection
  - Error message: 'Expect value (not) to be a backbone collection'

```javascript
it('should check if an object is a backbone collection', function() {
  expect(new Backbone.Collection()).toBeABackboneCollection();
  expect({}).not.toBeABackboneCollection();
  expect(new Backbone.Model()).not.toBeABackboneCollection();
  expect(new Backbone.View()).not.toBeABackboneCollection();
});
```

- `toHaveBeenFetched()`
  - Check that a given collection has been fetched
  - Error message: 'Expect backbone collection (not) to have been fetched'

```javascript
it('should check if collection has been fetched', function() {
  var collection = new Backbone.Collection({
    url: '/foo'
  });

  expect(collection).not.toHaveBeenFetched();
  collection.fetch();
  expect(collection).toHaveBeenFetched();
});
```

- `toHaveCollectionURL(expectedURL)`
  - Check that a given collection has expected URL.
  - Error message: 'Expect collection actual {{not}} to have url expectedURL but was actualURL'

```javascript
it('should check collection URL', function() {
  var collection = new Backbone.Collection({
    url: '/foo'
  });

  expect(collection).toHaveCollectionURL('/foo');
  expect(collection).not.toHaveCollectionURL('/bar');
});
```

- `toContainModel(model)`
  - Check that a given collection contain given model.
  - Error message: 'Expect backbone collection (not) to contain model model'

```javascript
it('should check if backbone collection contains given model', function() {
  var collection = new Backbone.Collection();

  var model1 = new Backbone.Model({
    id: 1
  });

  var model2 = new Backbone.Model();
  var model3 = new Backbone.Model();

  collection.push(model1);
  collection.push(model2);

  expect(collection).toContainModel(model1);
  expect(collection).toContainModel(model2);
  expect(collection).not.toContainModel(model3);
});
```

- `toHaveCollectionSize(expectedSize)`
  - Check that a given collection has expected size.
  - Error message: 'Expect backbone collection (not) to have size expectedSize but was actualSize'

```javascript
it('should check backbone collection size', function() {
  var collection = new Backbone.Collection();

  var model1 = new Backbone.Model({
    id: 1
  });

  var model2 = new Backbone.Model();
  var model3 = new Backbone.Model();

  collection.push(model1);
  collection.push(model2);
  collection.push(model3);

  expect(collection).toHaveCollectionSize(3);
  expect(collection).not.toHaveCollectionSize(1);
});
```

- `toBeEmptyCollection(expectedSize)`
  - Check that a given collection is empty.
  - Error message: 'Expect backbone collection (not) to be empty'

```javascript
it('should check that backbone collection is empty', function() {
  var collection = new Backbone.Collection();

  expect(collection).toBeEmptyCollection();

  var model1 = new Backbone.Model();
  collection.push(model1);

  expect(collection).not.toBeEmptyCollection();
});
```

- `toHaveTriggered(eventName)`
  - Check that a given event has been triggered
  - Error message: 'Expect backbone object (not) to have triggered event eventName'

```javascript
it('should check if collection triggered specified event', function() {
  var collection = new Backbone.Collection();

  expect(collection).not.toHaveTriggered('foo');
  collection.trigger('foo');
  expect(collection).toHaveTriggered('foo');
});
```

- `toHaveTriggeredWith(eventName, args...)`
  - Check that a given event has been triggered with given arguments
  - Error message: 'Expect backbone object (not) to have triggered event eventName with args'

```javascript
it('should check if collection triggered specified event with arguments', function() {
  var collection = new Backbone.Collection();

  var arg1 = {
    id: 1
  };

  var arg2 = 'bar';

  expect(collection).not.toHaveTriggeredWith('foo', arg1, arg2);
  collection.trigger('foo', arg1, arg2);
  expect(collection).toHaveTriggeredWith('foo', arg1, arg2);
  expect(collection).toHaveTriggeredWith('foo', jasmine.objectContaining(arg1), arg2);
  expect(collection).not.toHaveTriggeredWith('foo', arg1, 'foobar');
});
```

- `toListenTo(target, eventName, [callback])`
  - Check that a given collection listen to an expected event
  - Error message: 'Expect backbone object (not) to listen to event eventName on model|collection|view target'

```javascript
it('should check if collection listen to specified event', function() {
  var collection = new Backbone.Collection();
  var target = new Backbone.Model();

  expect(collection).not.toListenTo(target, 'foo');

  var callback = function() {};

  collection.listenTo(target, 'foo', callback);

  expect(collection).toListenTo(target, 'foo');
  expect(collection).toListenTo(target, 'foo', callback);

  expect(collection).not.toListenTo(target, 'bar');
  expect(collection).not.toListenTo(target, 'foo', function() {});
});
```

- `toListenToOnce(target, eventName, [callback])`
  - Check that a given collection listen (once) to an expected event
  - Error message: 'Expect backbone object (not) to listen once to event eventName on model|collection|view target'

```javascript
it('should check if collection listen once to specified event', function() {
  var collection = new Backbone.Collection();

  var target = new Backbone.Model();

  expect(collection).not.toListenToOnce(target, 'foo');

  var callback = function() {};

  collection.listenToOnce(target, 'foo', callback);

  expect(collection).toListenToOnce(target, 'foo');
  expect(collection).toListenToOnce(target, 'foo', callback);

  expect(collection).not.toListenToOnce(target, 'bar');
  expect(collection).not.toListenToOnce(target, 'foo', function() {});
});
```

- `toEqualAsJSON(json)`
  - Check that a given collection has the same json representation as another collection or array
  - Error message: 'Expect json representation of backbone model|collection actual (not) to equal json'

```javascript
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
  expect(c1).toEqualAsJSON(c2.toJSON());

  expect(c1).not.toEqualAsJSON(c3);
  expect(c1).not.toEqualAsJSON(c3.toJSON());
});
```

- `toEqualAsPartialJSON(json)`
  - Check that a given collection contains the same json representation as another collection or array
  - Error message: 'Expect json representation of backbone model|collection actual (not) to partially equal json'

```javascript
it('should compare partial json representations of backbone collections or arrays', function() {
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
  expect(c1).toEqualAsPartialJSON(c2.toJSON());

  expect(c1).not.toEqualAsPartialJSON(c3);
  expect(c1).not.toEqualAsPartialJSON(c3.toJSON());
});
```

## Views

- `toHaveViewClassName(expectedClassName)`
  - Check that a given view has expected class name
  - Error message: 'Expect backbone view (not) to have class name expectedClassName but was actualClassName'

```javascript
it('should check if view has class name', function() {
  var CustomView = Backbone.View.extend({
    className: 'foo'
  });

  var view = new CustomView();

  expect(view).toHaveViewClassName('foo');
  expect(view).not.toHaveViewClassName('bar');
});
```

- `toHaveViewTagName(expectedTagName)`
  - Check that a given view has expected tag name
  - Error message: 'Expect backbone view (not) to have tag name expectedTagName but was actualTagName'

```javascript
it('should check if view has tag name', function() {
  var CustomView = Backbone.View.extend({
    tagName: 'ul'
  });

  var view = new CustomView();

  expect(view).toHaveViewTagName('ul');
  expect(view).not.toHaveViewTagName('div');
});
```

- `toHaveViewProperties(expectedTagName, expectedClassName)`
  - Check that a given view has expected class and tag name
  - Error message: 'Expect backbone view (not) to have tag name expectedTagName and class name expectedClassName but was actualTagName and actualClassName'

```javascript
it('should check if view has class and tag name', function() {
  var CustomView = Backbone.View.extend({
    tagName: 'ul',
    className: 'foo'
  });

  var view = new CustomView();

  expect(view).toHaveViewProperties('ul', 'foo');
  expect(view).not.toHaveViewProperties('div', 'foo');
});
```

- `toHaveBeenRemoved()`
  - Check that a given view has been removed
  - Error message: 'Expect backbone view (not) to have been removed'

```javascript
it('should check if view has been removed', function() {
  var view = new Backbone.View();

  expect(view).not.toHaveBeenRemoved();
  view.remove();
  expect(view).toHaveBeenRemoved();
});
```

- `toHaveTriggered(eventName)`
  - Check that a given event has been triggered
  - Error message: 'Expect backbone object (not) to have triggered event eventName'

```javascript
it('should check if view triggered specified event', function() {
  var view = new Backbone.View();

  expect(view).not.toHaveTriggered('foo');
  view.trigger('foo');
  expect(view).toHaveTriggered('foo');
});
```

- `toHaveTriggeredWith(eventName, args...)`
  - Check that a given event has been triggered with given arguments
  - Error message: 'Expect backbone object (not) to have triggered event eventName with args'

```javascript
it('should check if view triggered specified event with arguments', function() {
  var view = new Backbone.View();

  var arg1 = {
    id: 1
  };

  var arg2 = 'bar';

  expect(view).not.toHaveTriggeredWith('foo', arg1, arg2);
  view.trigger('foo', arg1, arg2);
  expect(view).toHaveTriggeredWith('foo', arg1, arg2);
  expect(view).toHaveTriggeredWith('foo', jasmine.objectContaining(arg1), arg2);
  expect(view).not.toHaveTriggeredWith('foo', arg1, 'foobar');
});
```

- `toListenTo(target, eventName, [callback])`
  - Check that a given view listen to an expected event
  - Error message: 'Expect backbone object (not) to listen to event eventName on model|collection|view target'

```javascript
it('should check if view listen to specified event', function() {
  var view = new Backbone.View();
  var target = new Backbone.Model();

  expect(view).not.toListenTo(target, 'foo');

  var callback = function() {};

  view.listenTo(target, 'foo', callback);

  expect(view).toListenTo(target, 'foo');
  expect(view).toListenTo(target, 'foo', callback);

  expect(view).not.toListenTo(target, 'bar');
  expect(view).not.toListenTo(target, 'foo', function() {});
});
```

- `toListenToOnce(target, eventName, [callback])`
  - Check that a given view listen (once) to an expected event
  - Error message: 'Expect backbone object (not) to listen once to event eventName on model|collection|view target'

```javascript
it('should check if view listen once to specified event', function() {
  var view = new Backbone.View();

  var target = new Backbone.Model();

  expect(view).not.toListenToOnce(target, 'foo');

  var callback = function() {};

  view.listenToOnce(target, 'foo', callback);

  expect(view).toListenToOnce(target, 'foo');
  expect(view).toListenToOnce(target, 'foo', callback);

  expect(view).not.toListenToOnce(target, 'bar');
  expect(view).not.toListenToOnce(target, 'foo', function() {});
});
```

## Licence

MIT License (MIT)

## Contributing

If you think some matchers are missing or error messages are not useful enough, feel free to contribute and submit an issue or a pull request.
