(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GOVUKFrontend = global.GOVUKFrontend || {}));
})(this, (function (exports) { 'use strict';

  function setFocus($element, options = {}) {
    var _options$onBeforeFocu;
    const isFocusable = $element.getAttribute('tabindex');
    if (!isFocusable) {
      $element.setAttribute('tabindex', '-1');
    }
    function onFocus() {
      $element.addEventListener('blur', onBlur, {
        once: true
      });
    }
    function onBlur() {
      var _options$onBlur;
      (_options$onBlur = options.onBlur) == null || _options$onBlur.call($element);
      if (!isFocusable) {
        $element.removeAttribute('tabindex');
      }
    }
    $element.addEventListener('focus', onFocus, {
      once: true
    });
    (_options$onBeforeFocu = options.onBeforeFocus) == null || _options$onBeforeFocu.call($element);
    $element.focus();
  }
  function isInitialised($root, moduleName) {
    return $root instanceof HTMLElement && $root.hasAttribute(`data-${moduleName}-init`);
  }

  /**
   * Checks if GOV.UK Frontend is supported on this page
   *
   * Some browsers will load and run our JavaScript but GOV.UK Frontend
   * won't be supported.
   *
   * @param {HTMLElement | null} [$scope] - (internal) `<body>` HTML element checked for browser support
   * @returns {boolean} Whether GOV.UK Frontend is supported on this page
   */
  function isSupported($scope = document.body) {
    if (!$scope) {
      return false;
    }
    return $scope.classList.contains('govuk-frontend-supported');
  }
  function isArray(option) {
    return Array.isArray(option);
  }
  function isObject(option) {
    return !!option && typeof option === 'object' && !isArray(option);
  }
  function formatErrorMessage(Component, message) {
    return `${Component.moduleName}: ${message}`;
  }
  /**
   * @typedef ComponentWithModuleName
   * @property {string} moduleName - Name of the component
   */
  /**
   * @import { ObjectNested } from './configuration.mjs'
   */

  class GOVUKFrontendError extends Error {
    constructor(...args) {
      super(...args);
      this.name = 'GOVUKFrontendError';
    }
  }
  class SupportError extends GOVUKFrontendError {
    /**
     * Checks if GOV.UK Frontend is supported on this page
     *
     * @param {HTMLElement | null} [$scope] - HTML element `<body>` checked for browser support
     */
    constructor($scope = document.body) {
      const supportMessage = 'noModule' in HTMLScriptElement.prototype ? 'GOV.UK Frontend initialised without `<body class="govuk-frontend-supported">` from template `<script>` snippet' : 'GOV.UK Frontend is not supported in this browser';
      super($scope ? supportMessage : 'GOV.UK Frontend initialised without `<script type="module">`');
      this.name = 'SupportError';
    }
  }
  class ConfigError extends GOVUKFrontendError {
    constructor(...args) {
      super(...args);
      this.name = 'ConfigError';
    }
  }
  class ElementError extends GOVUKFrontendError {
    constructor(messageOrOptions) {
      let message = typeof messageOrOptions === 'string' ? messageOrOptions : '';
      if (typeof messageOrOptions === 'object') {
        const {
          component,
          identifier,
          element,
          expectedType
        } = messageOrOptions;
        message = identifier;
        message += element ? ` is not of type ${expectedType != null ? expectedType : 'HTMLElement'}` : ' not found';
        message = formatErrorMessage(component, message);
      }
      super(message);
      this.name = 'ElementError';
    }
  }
  class InitError extends GOVUKFrontendError {
    constructor(componentOrMessage) {
      const message = typeof componentOrMessage === 'string' ? componentOrMessage : formatErrorMessage(componentOrMessage, `Root element (\`$root\`) already initialised`);
      super(message);
      this.name = 'InitError';
    }
  }
  /**
   * @import { ComponentWithModuleName } from '../common/index.mjs'
   */

  class Component {
    /**
     * Returns the root element of the component
     *
     * @protected
     * @returns {RootElementType} - the root element of component
     */
    get $root() {
      return this._$root;
    }
    constructor($root) {
      this._$root = void 0;
      const childConstructor = this.constructor;
      if (typeof childConstructor.moduleName !== 'string') {
        throw new InitError(`\`moduleName\` not defined in component`);
      }
      if (!($root instanceof childConstructor.elementType)) {
        throw new ElementError({
          element: $root,
          component: childConstructor,
          identifier: 'Root element (`$root`)',
          expectedType: childConstructor.elementType.name
        });
      } else {
        this._$root = $root;
      }
      childConstructor.checkSupport();
      this.checkInitialised();
      const moduleName = childConstructor.moduleName;
      this.$root.setAttribute(`data-${moduleName}-init`, '');
    }
    checkInitialised() {
      const constructor = this.constructor;
      const moduleName = constructor.moduleName;
      if (moduleName && isInitialised(this.$root, moduleName)) {
        throw new InitError(constructor);
      }
    }
    static checkSupport() {
      if (!isSupported()) {
        throw new SupportError();
      }
    }
  }

  /**
   * @typedef ChildClass
   * @property {string} moduleName - The module name that'll be looked for in the DOM when initialising the component
   */

  /**
   * @typedef {typeof Component & ChildClass} ChildClassConstructor
   */
  Component.elementType = HTMLElement;

  const configOverride = Symbol.for('configOverride');
  class ConfigurableComponent extends Component {
    [configOverride](param) {
      return {};
    }

    /**
     * Returns the root element of the component
     *
     * @protected
     * @returns {ConfigurationType} - the root element of component
     */
    get config() {
      return this._config;
    }
    constructor($root, config) {
      super($root);
      this._config = void 0;
      const childConstructor = this.constructor;
      if (!isObject(childConstructor.defaults)) {
        throw new ConfigError(formatErrorMessage(childConstructor, 'Config passed as parameter into constructor but no defaults defined'));
      }
      const datasetConfig = normaliseDataset(childConstructor, this._$root.dataset);
      this._config = mergeConfigs(childConstructor.defaults, config != null ? config : {}, this[configOverride](datasetConfig), datasetConfig);
    }
  }
  function normaliseString(value, property) {
    const trimmedValue = value ? value.trim() : '';
    let output;
    let outputType = property == null ? void 0 : property.type;
    if (!outputType) {
      if (['true', 'false'].includes(trimmedValue)) {
        outputType = 'boolean';
      }
      if (trimmedValue.length > 0 && isFinite(Number(trimmedValue))) {
        outputType = 'number';
      }
    }
    switch (outputType) {
      case 'boolean':
        output = trimmedValue === 'true';
        break;
      case 'number':
        output = Number(trimmedValue);
        break;
      default:
        output = value;
    }
    return output;
  }
  function normaliseDataset(Component, dataset) {
    if (!isObject(Component.schema)) {
      throw new ConfigError(formatErrorMessage(Component, 'Config passed as parameter into constructor but no schema defined'));
    }
    const out = {};
    const entries = Object.entries(Component.schema.properties);
    for (const entry of entries) {
      const [namespace, property] = entry;
      const field = namespace.toString();
      if (field in dataset) {
        out[field] = normaliseString(dataset[field], property);
      }
      if ((property == null ? void 0 : property.type) === 'object') {
        out[field] = extractConfigByNamespace(Component.schema, dataset, namespace);
      }
    }
    return out;
  }
  function mergeConfigs(...configObjects) {
    const formattedConfigObject = {};
    for (const configObject of configObjects) {
      for (const key of Object.keys(configObject)) {
        const option = formattedConfigObject[key];
        const override = configObject[key];
        if (isObject(option) && isObject(override)) {
          formattedConfigObject[key] = mergeConfigs(option, override);
        } else {
          formattedConfigObject[key] = override;
        }
      }
    }
    return formattedConfigObject;
  }
  function extractConfigByNamespace(schema, dataset, namespace) {
    const property = schema.properties[namespace];
    if ((property == null ? void 0 : property.type) !== 'object') {
      return;
    }
    const newObject = {
      [namespace]: {}
    };
    for (const [key, value] of Object.entries(dataset)) {
      let current = newObject;
      const keyParts = key.split('.');
      for (const [index, name] of keyParts.entries()) {
        if (isObject(current)) {
          if (index < keyParts.length - 1) {
            if (!isObject(current[name])) {
              current[name] = {};
            }
            current = current[name];
          } else if (key !== namespace) {
            current[name] = normaliseString(value);
          }
        }
      }
    }
    return newObject[namespace];
  }
  /**
   * Schema for component config
   *
   * @template {Partial<Record<keyof ConfigurationType, unknown>>} ConfigurationType
   * @typedef {object} Schema
   * @property {Record<keyof ConfigurationType, SchemaProperty | undefined>} properties - Schema properties
   * @property {SchemaCondition<ConfigurationType>[]} [anyOf] - List of schema conditions
   */
  /**
   * Schema property for component config
   *
   * @typedef {object} SchemaProperty
   * @property {'string' | 'boolean' | 'number' | 'object'} type - Property type
   */
  /**
   * Schema condition for component config
   *
   * @template {Partial<Record<keyof ConfigurationType, unknown>>} ConfigurationType
   * @typedef {object} SchemaCondition
   * @property {(keyof ConfigurationType)[]} required - List of required config fields
   * @property {string} errorMessage - Error message when required config fields not provided
   */
  /**
   * @template {Partial<Record<keyof ConfigurationType, unknown>>} [ConfigurationType=ObjectNested]
   * @typedef ChildClass
   * @property {string} moduleName - The module name that'll be looked for in the DOM when initialising the component
   * @property {Schema<ConfigurationType>} [schema] - The schema of the component configuration
   * @property {ConfigurationType} [defaults] - The default values of the configuration of the component
   */
  /**
   * @template {Partial<Record<keyof ConfigurationType, unknown>>} [ConfigurationType=ObjectNested]
   * @typedef {typeof Component & ChildClass<ConfigurationType>} ChildClassConstructor<ConfigurationType>
   */

  /**
   * Notification Banner component
   *
   * @preserve
   * @augments ConfigurableComponent<NotificationBannerConfig>
   */
  class NotificationBanner extends ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element to use for notification banner
     * @param {NotificationBannerConfig} [config] - Notification banner config
     */
    constructor($root, config = {}) {
      super($root, config);
      if (this.$root.getAttribute('role') === 'alert' && !this.config.disableAutoFocus) {
        setFocus(this.$root);
      }
    }
  }

  /**
   * Notification banner config
   *
   * @typedef {object} NotificationBannerConfig
   * @property {boolean} [disableAutoFocus=false] - If set to `true` the
   *   notification banner will not be focussed when the page loads. This only
   *   applies if the component has a `role` of `alert` – in other cases the
   *   component will not be focused on page load, regardless of this option.
   */

  /**
   * @import { Schema } from '../../common/configuration.mjs'
   */
  NotificationBanner.moduleName = 'govuk-notification-banner';
  NotificationBanner.defaults = Object.freeze({
    disableAutoFocus: false
  });
  NotificationBanner.schema = Object.freeze({
    properties: {
      disableAutoFocus: {
        type: 'boolean'
      }
    }
  });

  exports.NotificationBanner = NotificationBanner;

}));
//# sourceMappingURL=notification-banner.bundle.js.map
