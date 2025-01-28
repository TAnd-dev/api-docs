const _ = require('lodash');

const extractModels = (schema, schemaById) => {
  if (schema.properties?.model?.enum) {
    return schema.properties.model.enum;
  }

  if (Array.isArray(schema.anyOf)) {
    return schema.anyOf.flatMap((v) => extractModels(v, schemaById));
  }

  if (Array.isArray(schema.oneOf)) {
    return schema.oneOf.flatMap((v) => extractModels(v, schemaById));
  }

  if (Array.isArray(schema.allOf)) {
    return schema.allOf.flatMap((v) => extractModels(v, schemaById));
  }

  if (schema.$ref) {
    return extractModels(schemaById[schema.$ref.split('/').at(-1)], schemaById);
  }

  return [];
};

const extractUnion = (model, schema, schemaById) => {
  if (schema.properties?.model?.enum) {
    if (schema.properties.model.enum.includes(model)) {
      return _.set({ ...schema }, 'properties.model.enum', [model]);
    }
  }

  if (Array.isArray(schema.anyOf)) {
    for (const inner of schema.anyOf) {
      const extracted = extractUnion(model, inner, schemaById);
      if (extracted) {
        return;
      }
    }
  }

  if (Array.isArray(schema.oneOf)) {
    for (const inner of schema.oneOf) {
      const extracted = extractUnion(model, inner, schemaById);
      if (extracted) {
        return;
      }
    }
  }

  if (Array.isArray(schema.allOf)) {
    return schema;
  }

  if (schema.$ref) {
    return extractUnion(model, schemaById[schema.$ref.split('/').at(-1)], schemaById);
  }

  return null;
};

const parseOpenapi = (openapi) => {
  const byModel = {};
  const schemaById = openapi.components.schemas;

  for (const path in openapi.paths) {
    for (const method in openapi.paths[path]) {
      if (method !== 'post') {
        continue;
      }

      const refId = openapi.paths[path][method].requestBody?.content?.['application/json']?.schema?.$ref
        .split('/')
        .at(-1);
      const schema = schemaById[refId];
      const models = extractModels(schema, schemaById);

      for (const model of models) {
        byModel[model] = { path, schema: extractUnion(model, schema, schemaById) };
      }
    }
  }

  return { byModel };
};

module.exports = parseOpenapi;
