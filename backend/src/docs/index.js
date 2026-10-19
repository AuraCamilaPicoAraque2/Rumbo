// Une la especificación base (paso 2), la del catálogo (paso 4) y la de funciones nuevas (paso 5)
import { openapiSpec as base } from './openapi.js'
import { catalogPaths, catalogSchemas, catalogTags } from './openapi.catalog.js'
import { featurePaths, featureSchemas, featureTags } from './openapi.features.js'

export const openapiSpec = {
  ...base,
  tags: [...base.tags, ...catalogTags, ...featureTags],
  components: {
    ...base.components,
    schemas: { ...base.components.schemas, ...catalogSchemas, ...featureSchemas },
  },
  paths: { ...base.paths, ...catalogPaths, ...featurePaths },
}
