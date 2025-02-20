const ModelsGenerator = require('./generators/models');
const ModelPageGenerator = require('./generators/model');
const HandlebarsPageGenerator = require('./generators/common/handlebars');
const PathPlugin = require('./generators/plugins/path');
const StorePlugin = require('./generators/plugins/store');
const { TEMPLATE, readTemplate, replaceTemplate, SECTION, CATEGORY, ALIAS_MAP } = require('./templates');
const { MODELS_URL, OPENAPI_URL } = require('./config');
const CustomGenerator = require('./generators/custom');
const VenderPageGenerator = require('./generators/vendor');
const { SummaryParserMap } = require('./templates/parser');
const { summary } = require('./generators/plugins/preset');
const CategoryPageGenerator = require('./generators/category');
const path = require('path');
const _ = require('lodash');

const DOCS_PATH = '/api-references';

const root = {
  next: ModelsGenerator.build({
    url: path.join(__dirname, "json_for-docs_generation_20250211_v3.json"), //MODELS_URL,
    openapi: {
      url: OPENAPI_URL,
    },
    effects: [PathPlugin.traverse(DOCS_PATH)],
    next:[
      CategoryPageGenerator.build({
        next: [
          VenderPageGenerator.build({
            next: [
              HandlebarsPageGenerator.build({
                content: readTemplate(TEMPLATE.models),
                effects: [
                  StorePlugin.store((...args) => ({
                    path: `${PathPlugin.path(...args)}${path.sep}README.md`,
                    transform: replaceTemplate(TEMPLATE.models),
                  })),
                  summary('README'),
                ],
              }),
              ModelPageGenerator.build({
                next: HandlebarsPageGenerator.build({
                  content: readTemplate(TEMPLATE.openapi),
                  effects: [
                    StorePlugin.store((...args) => ({
                      path: `${PathPlugin.path(...args)}.md`,
                      transform: replaceTemplate(TEMPLATE.openapi),
                    })),
                    StorePlugin.store((...args) => ({
                      content: (_, c) => JSON.stringify(jsonModify(c.openapi, ...args)),
                      path: `${PathPlugin.path(...args)}.json`,
                    })),
                    StorePlugin.store((...args) => ({
                      content: (_, c) => JSON.stringify(jsonModifyForPair(c.openapi, ...args)),
                      path: `${PathPlugin.path(getArgs(...args))}.json`,
                    })),
                    summary(),
                  ],
                }),
              }),
            ],
          }),
          // HandlebarsPageGenerator.build({
          //   content: readTemplate(TEMPLATE.summary, SECTION.references),
          //   effects: [
          //     StorePlugin.store((...args) => ({
          //       path: `${PathPlugin.root(...args)}/SUMMARY.md`,
          //       transform: replaceTemplate(TEMPLATE.summary),
          //     })),
          //   ],
          // }),
        ],
      }),
    ],
  }),
  plugins: [new PathPlugin(), new StorePlugin()],
};
let c = 0
const pairMap = {}
const getArgs = (args) => {

  const alias = args[args.plugins[0].id].tags.at(-1)
  if(pairMap[alias]) {
    console.log('@@@@', pairMap)
    return pairMap[alias]
  }
  return args
}
const jsonModify = (data, args) => {
  const key = Object.keys(data.schema.paths)[0]
  const alias = args[args.plugins[0].id].tags.at(-1)
  if (data.pair.has) {
    console.log(data.pair.has)
    const cloned = _.cloneDeep(args);
    cloned[cloned.plugins[0].id].path = cloned[cloned.plugins[0].id].path + '-pair'
    savePair(alias, cloned)
  }
  if (ALIAS_MAP[alias]) {
    if (data.schema.paths[key].post.requestBody.content["application/json"].schema?.properties?.model?.enum)
      data.schema.paths[key].post.requestBody.content["application/json"].schema.properties.model.enum = ALIAS_MAP[alias]
  }
  
  return data.schema
}

const savePair = (alias, cloned) => {
  if(!pairMap[alias])
    pairMap[alias] = cloned
}

const jsonModifyForPair = (data, args) => {
  // console.log(data.pair.has)
  if (data.pair.has) {
      console.log(data.pair.has)
      const key = Object.keys(data.pair.schema.paths)[0]
      const alias = args[args.plugins[0].id].tags.at(-1)
      // const cloned = _.cloneDeep(args);
      // cloned[cloned.plugins[0].id].path = cloned[cloned.plugins[0].id].path + '-pair'
      // if(!pairMap[alias])
      // pairMap[alias] = cloned
      // console.log(alias)
      // console.log(pairMap)
      // if(c < 1) {
      //   console.log(args)
      //   c += 1
      // }
      if (ALIAS_MAP[alias]) {
        if (data.pair.schema.paths[key][data.pair.method].requestBody.content["application/json"].schema?.properties?.model?.enum)
          data.pair.schema.paths[key][data.pair.method].requestBody.content["application/json"].schema.properties.model.enum = ALIAS_MAP[alias]
      }
      
      return data.pair.schema
  }

  const key = Object.keys(data.schema.paths)[0]
  const alias = args[args.plugins[0].id].tags.at(-1)

  if (ALIAS_MAP[alias]) {
    if (data.schema.paths[key].post.requestBody.content["application/json"].schema?.properties?.model?.enum)
      data.schema.paths[key].post.requestBody.content["application/json"].schema.properties.model.enum = ALIAS_MAP[alias]
  }
  
  return data.schema
  
}

module.exports = {
  root,
};
