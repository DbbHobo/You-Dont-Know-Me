# createElement

## createElement原理

`createElement`入口在`packages/react/index.js`，在`React`中我们知道`JSX`会通过`Babel`转译为
`React.createElement`从而生成`React-Element`对象，可以看到最后返回的是`ReactElement`方法生成的对象：

```ts
// 【packages/react/src/jsx/ReactJSXElement.js】
/**
 * Create and return a new ReactElement of the given type.
 * See https://reactjs.org/docs/react-api.html#createelement
 */
export function createElement(type, config, children) {
  if (__DEV__) {
    if (!enableOwnerStacks && !isValidElementType(type)) {
      // This is just an optimistic check that provides a better stack trace before
      // owner stacks. It's really up to the renderer if it's a valid element type.
      // When owner stacks are enabled, we instead warn in the renderer and it'll
      // have the stack trace of the JSX element anyway.
      //
      // This is an invalid element type.
      //
      // We warn in this case but don't throw. We expect the element creation to
      // succeed and there will likely be errors in render.
      let info = '';
      if (
        type === undefined ||
        (typeof type === 'object' &&
          type !== null &&
          Object.keys(type).length === 0)
      ) {
        info +=
          ' You likely forgot to export your component from the file ' +
          "it's defined in, or you might have mixed up default and named imports.";
      }

      let typeString;
      if (type === null) {
        typeString = 'null';
      } else if (isArray(type)) {
        typeString = 'array';
      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
        typeString = `<${getComponentNameFromType(type.type) || 'Unknown'} />`;
        info =
          ' Did you accidentally export a JSX literal instead of a component?';
      } else {
        typeString = typeof type;
      }

      console.error(
        'React.createElement: type is invalid -- expected a string (for ' +
          'built-in components) or a class/function (for composite ' +
          'components) but got: %s.%s',
        typeString,
        info,
      );
    } else {
      // This is a valid element type.

      // Skip key warning if the type isn't valid since our key validation logic
      // doesn't expect a non-string/function type and can throw confusing
      // errors. We don't want exception behavior to differ between dev and
      // prod. (Rendering will throw with a helpful message and as soon as the
      // type is fixed, the key warnings will appear.)
      for (let i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], type);
      }
    }

    // Unlike the jsx() runtime, createElement() doesn't warn about key spread.
  }

  let propName;

  // Reserved names are extracted
  const props = {};

  let key = null;
  let ref = null;

  if (config != null) {
    if (__DEV__) {
      if (
        !didWarnAboutOldJSXRuntime &&
        '__self' in config &&
        // Do not assume this is the result of an oudated JSX transform if key
        // is present, because the modern JSX transform sometimes outputs
        // createElement to preserve precedence between a static key and a
        // spread key. To avoid false positive warnings, we never warn if
        // there's a key.
        !('key' in config)
      ) {
        didWarnAboutOldJSXRuntime = true;
        console.warn(
          'Your app (or one of its dependencies) is using an outdated JSX ' +
            'transform. Update to the modern JSX transform for ' +
            'faster performance: https://react.dev/link/new-jsx-transform',
        );
      }
    }

    if (hasValidRef(config)) {
      if (!enableRefAsProp) {
        ref = config.ref;
        if (!disableStringRefs) {
          ref = coerceStringRef(ref, getOwner(), type);
        }
      }

      if (__DEV__ && !disableStringRefs) {
        warnIfStringRefCannotBeAutoConverted(config, config.__self);
      }
    }
    if (hasValidKey(config)) {
      if (__DEV__) {
        checkKeyStringCoercion(config.key);
      }
      key = '' + config.key;
    }

    // Remaining properties are added to a new props object
    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        // Skip over reserved prop names
        propName !== 'key' &&
        (enableRefAsProp || propName !== 'ref') &&
        // Even though we don't use these anymore in the runtime, we don't want
        // them to appear as props, so in createElement we filter them out.
        // We don't have to do this in the jsx() runtime because the jsx()
        // transform never passed these as props; it used separate arguments.
        propName !== '__self' &&
        propName !== '__source'
      ) {
        if (enableRefAsProp && !disableStringRefs && propName === 'ref') {
          props.ref = coerceStringRef(config[propName], getOwner(), type);
        } else {
          props[propName] = config[propName];
        }
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    if (__DEV__) {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  if (__DEV__) {
    if (key || (!enableRefAsProp && ref)) {
      const displayName =
        typeof type === 'function'
          ? type.displayName || type.name || 'Unknown'
          : type;
      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }
      if (!enableRefAsProp && ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }

  return ReactElement(
    type,
    key,
    ref,
    undefined,
    undefined,
    getOwner(),
    props,
    __DEV__ && enableOwnerStacks ? Error('react-stack-top-frame') : undefined,
    __DEV__ && enableOwnerStacks ? createTask(getTaskName(type)) : undefined,
  );
}
```

工厂函数`ReactElement`用于构造`React-Element`对象，后续生成`VNode`都是通过这些`React-Element`对象：

```ts
// 【packages/react/src/jsx/ReactJSXElement.js】
/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, instanceof check
 * will not work. Instead test $$typeof field against Symbol.for('react.transitional.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @internal
 */
function ReactElement(
  type,
  key,
  _ref,
  self,
  source,
  owner,
  props,
  debugStack,
  debugTask,
) {
  let ref;
  if (enableRefAsProp) {
    // When enableRefAsProp is on, ignore whatever was passed as the ref
    // argument and treat `props.ref` as the source of truth. The only thing we
    // use this for is `element.ref`, which will log a deprecation warning on
    // access. In the next release, we can remove `element.ref` as well as the
    // `ref` argument.
    const refProp = props.ref;

    // An undefined `element.ref` is coerced to `null` for
    // backwards compatibility.
    ref = refProp !== undefined ? refProp : null;
  } else {
    ref = _ref;
  }

  let element;
  if (__DEV__ && enableRefAsProp) {
    // In dev, make `ref` a non-enumerable property with a warning. It's non-
    // enumerable so that test matchers and serializers don't access it and
    // trigger the warning.
    //
    // `ref` will be removed from the element completely in a future release.
    element = {
      // This tag allows us to uniquely identify this as a React Element
      $$typeof: REACT_ELEMENT_TYPE,

      // Built-in properties that belong on the element
      type,
      key,

      props,

      // Record the component responsible for creating this element.
      _owner: owner,
    };
    if (ref !== null) {
      Object.defineProperty(element, 'ref', {
        enumerable: false,
        get: elementRefGetterWithDeprecationWarning,
      });
    } else {
      // Don't warn on access if a ref is not given. This reduces false
      // positives in cases where a test serializer uses
      // getOwnPropertyDescriptors to compare objects, like Jest does, which is
      // a problem because it bypasses non-enumerability.
      //
      // So unfortunately this will trigger a false positive warning in Jest
      // when the diff is printed:
      //
      //   expect(<div ref={ref} />).toEqual(<span ref={ref} />);
      //
      // A bit sketchy, but this is what we've done for the `props.key` and
      // `props.ref` accessors for years, which implies it will be good enough
      // for `element.ref`, too. Let's see if anyone complains.
      Object.defineProperty(element, 'ref', {
        enumerable: false,
        value: null,
      });
    }
  } else if (!__DEV__ && disableStringRefs) {
    // In prod, `ref` is a regular property and _owner doesn't exist.
    element = {
      // This tag allows us to uniquely identify this as a React Element
      $$typeof: REACT_ELEMENT_TYPE,

      // Built-in properties that belong on the element
      type,
      key,
      ref,

      props,
    };
  } else {
    // In prod, `ref` is a regular property. It will be removed in a
    // future release.
    element = {
      // This tag allows us to uniquely identify this as a React Element
      $$typeof: REACT_ELEMENT_TYPE,

      // Built-in properties that belong on the element
      type,
      key,
      ref,

      props,

      // Record the component responsible for creating this element.
      _owner: owner,
    };
  }

  if (__DEV__) {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {};

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: 0,
    });
    // debugInfo contains Server Component debug information.
    Object.defineProperty(element, '_debugInfo', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: null,
    });
    if (enableOwnerStacks) {
      Object.defineProperty(element, '_debugStack', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: debugStack,
      });
      Object.defineProperty(element, '_debugTask', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: debugTask,
      });
    }
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
}
```

## 元素和组件

```ts
```

## 总结

## 参考资料