import { Fragment } from 'react';
import { identity } from 'lib/utils';

function CommaSepList({
  list,
  listTransform = identity,
  itemComponent,
  itemComponents,
  separator = ', ',
}) {
  if (!itemComponent && !itemComponents) {
    return list.map(listTransform).join(separator);
  }
  return list.map((item, index) => {
    const Component = item.typeHandle
      ? itemComponents[item.typeHandle]
      : itemComponent;
    return (
      <Fragment key={index}>
        <Component {...item} />
        {index < list.length - 1 && separator}
      </Fragment>
    );
  });
}

export default CommaSepList;
