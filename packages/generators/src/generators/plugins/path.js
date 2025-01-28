const path = require('path');
const GeneratorPlugin = require('./plugin');

class PathPlugin extends GeneratorPlugin {
  static traverse(path) {
    return this.apply(path);
  }

  static get path() {
    return (config) => {
      const state = PathPlugin.locate(config.plugins).state(config);
      return path.join(state.root, state.path);
    };
  }

  static get root() {
    return (config) => PathPlugin.locate(config.plugins).state(config).root;
  }

  apply(ctx, config, payload) {
    const state = this.state(ctx);
    state.path = path.join(state.path || '.', payload);
  }
}

module.exports = PathPlugin;
