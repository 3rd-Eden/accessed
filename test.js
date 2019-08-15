const { describe, it } = require('mocha');
const assume = require('assume');
const accessed = require('./');

describe('accessed', function () {
  it('return a object proxy', function () {
    const data = { bar: 'bar' };
    const res = accessed(data);

    assume(data).is.a('object');
    assume(res).does.not.equal(data);
    assume(res).is.a('object');
  });

  it('only includes the props that have been accessed on JSON.stringify', function () {
    const data = accessed({ foo: "bar", bar: "baz" });

    assume(data.foo).equals('bar');
    assume(JSON.stringify(data)).equals('{"foo":"bar"}');
  });

  it('tracks newly added props', function () {
    const data = accessed({ foo: "bar", bar: "baz" });

    data.another = 'bar';
    data.more = 'yep';

    assume(data.another).equals('bar');
    assume(data.bar).equals('baz');
    assume(JSON.stringify(data)).equals('{"another":"bar","bar":"baz"}');
  });

  it('ignores undefined props', function () {
    const data = accessed({ foo: "bar", bar: "baz" });

    assume(data.foo).equals('bar');
    assume(data.another).is.a('undefined');

    assume(JSON.stringify(data)).equals('{"foo":"bar"}');
  });

  describe('option: keys', function () {
    it('can force keys to be included', function () {
      const data = accessed({ foo: "bar", bar: "baz" }, {
        keys: ['bar', 'non-existing']
      });

      assume(data.foo).equals('bar');
      assume(JSON.stringify(data)).equals('{"bar":"baz","foo":"bar"}');
    });
  });

  describe('option: exclude', function () {
    it('can return the props that have not been accessed', function () {
      const data = accessed({ foo: "bar", bar: "baz", another: "key" }, {
        exclude: true
      });

      assume(data.foo).equals('bar');
      assume(JSON.stringify(data)).equals('{"bar":"baz","another":"key"}');
    });

    it('includes the keys that were originally provided', function () {
      const data = accessed({ foo: "bar", bar: "baz", another: "key" }, {
        keys: ['foo'],
        exclude: true
      });

      assume(data.foo).equals('bar');
      assume(JSON.stringify(data)).equals('{"bar":"baz","another":"key","foo":"bar"}');
    })
  });

  describe('#toJSON', function () {
    it('adds a `toJSON` function', function () {
      const data = accessed({ foo: "bar", bar: "baz" }, {
        keys: ['non-existing']
      });

      assume(data.toJSON).is.a('function');
      assume(data.toJSON()).is.a('object');
      assume(data.toJSON()).is.length(0);

      assume(data.foo).equals('bar');
      assume(data.toJSON()).is.length(1);
      assume(data.toJSON().foo).equals('bar');
    });

    it('does not introduce toJSON to the original object', function () {
      const og = { foo: 'bar' };
      const data = accessed(og);

      assume(data.toJSON).is.a('function');
      assume(og.toJSON).is.not.a('function');
    });
  });
});
