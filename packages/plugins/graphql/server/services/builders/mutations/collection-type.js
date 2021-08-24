'use strict';

const { extendType } = require('nexus');
const { utils } = require('../../types');
const { actionExists } = require('../../old/utils');

const builderUtils = require('../utils');

module.exports = ({ strapi }) => {
  const addCreateMutation = (t, contentType) => {
    const { uid } = contentType;

    const createMutationName = utils.getCreateMutationTypeName(contentType);
    const responseTypeName = utils.getEntityResponseName(contentType);

    // If the action doesn't exist, return early and don't add the mutation
    if (!actionExists({ resolver: `${uid}.create` })) {
      return;
    }

    t.field(createMutationName, {
      type: responseTypeName,

      args: {
        // Create payload
        data: utils.getContentTypeInputName(contentType),
      },

      async resolve(source, args) {
        // todo[v4]: need to handle media too? (type === 'media')

        const transformedArgs = builderUtils.transformArgs(args, { contentType });

        const { create } = strapi
          .plugin('strapi')
          .service('builders')
          .get('content-api')
          .buildMutationsResolvers({ contentType });

        const value = await create(source, transformedArgs);

        return { value, info: { args: transformedArgs, resourceUID: uid } };
      },
    });
  };

  const addUpdateMutation = (t, contentType) => {
    const { uid } = contentType;

    const updateMutationName = utils.getUpdateMutationTypeName(contentType);
    const responseTypeName = utils.getEntityResponseName(contentType);

    // If the action doesn't exist, return early and don't add the mutation
    if (!actionExists({ resolver: `${uid}.update` })) {
      return;
    }

    // todo[v4]: Don't allow to filter using every unique attributes for now
    // Only authorize filtering using unique scalar fields for updateOne queries
    // const uniqueAttributes = getUniqueAttributesFiltersMap(attributes);

    t.field(updateMutationName, {
      type: responseTypeName,

      args: {
        // Query args
        id: 'ID',
        // todo[v4]: Don't allow to filter using every unique attributes for now
        // ...uniqueAttributes,

        // Update payload
        data: utils.getContentTypeInputName(contentType),
      },

      async resolve(source, args) {
        const transformedArgs = builderUtils.transformArgs(args, { contentType });

        const { update } = strapi
          .plugin('strapi')
          .service('builders')
          .get('content-api')
          .buildMutationsResolvers({ contentType });

        const value = await update(source, transformedArgs);

        return { value, info: { args: transformedArgs, resourceUID: uid } };
      },
    });
  };

  const addDeleteMutation = (t, contentType) => {
    const { uid } = contentType;

    const deleteMutationName = utils.getDeleteMutationTypeName(contentType);
    const responseTypeName = utils.getEntityResponseName(contentType);

    // If the action doesn't exist, return early and don't add the mutation
    if (!actionExists({ resolver: `${uid}.delete` })) {
      return;
    }

    // todo[v4]: Don't allow to filter using every unique attributes for now
    // Only authorize filtering using unique scalar fields for updateOne queries
    // const uniqueAttributes = getUniqueAttributesFiltersMap(attributes);

    t.field(deleteMutationName, {
      type: responseTypeName,

      args: {
        // Query args
        id: 'ID',
        // todo[v4]: Don't allow to filter using every unique attributes for now
        // ...uniqueAttributes,
      },

      async resolve(source, args) {
        const transformedArgs = builderUtils.transformArgs(args, { contentType });

        const { delete: deleteResolver } = strapi
          .plugin('strapi')
          .service('builders')
          .get('content-api')
          .buildMutationsResolvers({ contentType });

        const value = await deleteResolver(source, args);

        return { value, info: { args: transformedArgs, resourceUID: uid } };
      },
    });
  };

  return {
    buildCollectionTypeMutations(contentType) {
      return extendType({
        type: 'Mutation',

        definition(t) {
          addCreateMutation(t, contentType);
          addUpdateMutation(t, contentType);
          addDeleteMutation(t, contentType);
        },
      });
    },
  };
};