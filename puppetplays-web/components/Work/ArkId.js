import Link from 'next/link';
import PropTypes from 'prop-types';

function ArkId({ id }) {
  if (!id) {
    return null;
  } else if (id.startsWith('http')) {
    return (
      <Link href={id} target="_blank" rel="nofollow noopener noreferrer">
        {id}
      </Link>
    );
  }

  return id;
}

ArkId.defaultProps = {
  id: null,
};

ArkId.propTypes = {
  id: PropTypes.string,
};

export default ArkId;
