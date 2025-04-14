import { identity } from 'lib/utils';
import { Fragment } from 'react';

function CommaSepList({
  list,
  listTransform = identity,
  itemComponent,
  itemComponents,
  separator = ', ',
  ...additionalProps
}) {
  // Sécurité pour s'assurer que list est un tableau
  if (!list || !Array.isArray(list)) {
    return null;
  }

  if (!itemComponent && !itemComponents) {
    return list.map(listTransform).join(separator);
  }
  return list.map((item, index) => {
    const Component = item.typeHandle
      ? itemComponents[item.typeHandle]
      : itemComponent;
    return (
      <Fragment key={index}>
        <Component {...item} {...additionalProps} />
        {index < list.length - 1 && separator}
      </Fragment>
    );
  });
}

export default CommaSepList;
