import { Fragment } from 'react';
import { identity } from 'lib/utils';

function CommaSepList({
  list,
  listTransform = identity,
  itemComponent: ItemComponent,
}) {
  if (!ItemComponent) {
    return list.map(listTransform).join(', ');
  }
  return list.map((item, index) => (
    <Fragment key={index}>
      <ItemComponent {...item} />
      {index < list.length - 1 && ', '}
    </Fragment>
  ));
}

export default CommaSepList;
