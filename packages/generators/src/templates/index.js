const fs = require('fs');
const path = require('path');

const readTemplate = (name) => {
  const content = fs.readFileSync(path.join(__dirname, `./${name}.hbs`), 'utf8');

  return `[#references:start]: <> ({ "template": "${name}" })
${content}
[#references:end]: <> ({})`;
};

const replaceTemplate =
  (name, replacer = (match, next) => match.replace(match, next)) =>
  (prev, next) => {
    if (!prev.trim()) {
      return next;
    }

    const expr = /^\[#references:start\]:\s<>\s\(({.+?})\)(.+)\[#references:end\].+?$/gms;
    if([TEMPLATE.openapi, TEMPLATE.modelsData].includes(name)){
      return prev.replace(expr, (match, payload, content) => {
        const config = JSON.parse(payload);
        
        if (config.template === name) {
          const updatedContent = replacer(content, next);

          if (updatedContent.includes('[#references:start]:')) {
            return updatedContent
          }
          return `[#references:start]: <> (${payload})${updatedContent}\n\n[#references:end]: <> ({})`;
        } 
        return match; 
      });
    }
    
    return prev.replace(expr, (match, payload, content) => {

      const config = JSON.parse(payload);
      const replaced =
        config.template === name ? match.replace(content, '\n' + replacer(content, next) + '\n') : content;
      return replaced;
    });
  };

const summaryReplacer = (match, next) => {
  const { path, provider } = next;

  const summary = SummaryParserMap.parse(match);

  summary[provider] = {
    ...summary[provider],
    key: provider,
    value: path,
    children: { ...summary[provider]?.children },
  };

  const stringified = SummaryParserMap.stringify(summary);

  return `## Generated\n${stringified}`;
};

const escapeRegExp = (str) => {
  return str.replace(/\$/g, '$$$$');
};

const TEMPLATE = {
  openapi: 'openapi',
  summary: 'summary',
  models: 'models',
  modelsData: 'modelsData',
};

const SECTION = {
  references: 'references',
  generator: 'generator',
}

CATEGORY_MAPPING = {
  "text-models-llm": "Text Models (LLM)", 
  "image-models": "Image Models",
  "video-models": "Video Models",
  "embedding-models": "Embedding Models",
  "speech-voice-models/tts": "Voice/Speech Models",
  "speech-voice-models/stt": "Voice/Speech Models",
  "stt": "Speech-to-Text",
  "tts": "Text-to-Speech",//"Voice/Speech Models" / "TTS",
  "speech-voice-models": "Voice/Speech Models",
  "music-models": "Music Models",
  "vision-modle": "Vision Models",
  "vision-modle/ocr": "Vision Models",
  "vision-modle/ofr": "Vision Models",
  "ocr": "OCR",
  "ofr": "OFR",
  "moderation-safety-models": "Content Moderation/Safety Models",
  "3d-generating-models": "3D-Generating Models"
}
const VENDORS_PATH_MAP = new Map()
const ALIAS_PATH_MAP = new Map()
const ALIAS_MAP = {}

/*
[name modal]: {alias: string, path: string, category: string}
*/
const MODELS_TO_ALIAS_MAP = {}

const CATEGORY_SET = new Set(["Text Models (LLM)", "Image Models", "Video Models", "Embedding Models", "Voice/Speech Models", "STT", 'Speech Models', "Voice/Speech Models", "TTS", "Music Models", "Vision Models", "Vision Models" ,  "Content Moderation/Safety Models", "3D-Generating Models"])

module.exports = { readTemplate, replaceTemplate, TEMPLATE, CATEGORY_MAPPING, SECTION, CATEGORY_SET, VENDORS_PATH_MAP, ALIAS_PATH_MAP, ALIAS_MAP, MODELS_TO_ALIAS_MAP };
