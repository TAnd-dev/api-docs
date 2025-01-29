const PageGenerator = require('./common/page');
const PathPlugin = require('./plugins/path');

class ModelPageGenerator extends PageGenerator {
  *generate() {
    const { models, openapi, ...rest } = this.config;

    for (const model of models) {
      const { path, schema } = openapi.byModel[model.name];

      if (!path) {
        console.warn(`Model '${model.name}' path not found.`);
      }

      yield this.done(
        {
          ...rest,
          openapi: {
            ...openapi,
            url: `./${model.key}.json`,
            path,
            method: 'post',
            schema,
          },
          model,
        },
        PathPlugin.traverse(`/${model.key}`, model.key),
      );
    }
  }
}

module.exports = ModelPageGenerator;
