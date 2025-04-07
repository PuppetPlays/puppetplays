import PropTypes from 'prop-types';
import { useTranslation } from 'next-i18next';
import { hasAtLeastOneItem } from 'lib/utils';
import Info from 'components/Info';
import Hypotext from 'components/Hypotext';

function Hypotexts({ hypotexts }) {
  const { t } = useTranslation();

  return (
    <Info label={t('common:hypotexts')} fill show={hasAtLeastOneItem(hypotexts)}>
      {hypotexts.map(hypotext => (
        <Hypotext key={hypotext.id} {...hypotext} />
      ))}
    </Info>
  );
}

Hypotexts.defaultProps = {
  hypotexts: [],
};

Hypotexts.propTypes = {
  hypotexts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      authors: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          usualName: PropTypes.string,
          firstName: PropTypes.string,
          lastName: PropTypes.string,
        }),
      ),
    }),
  ),
};

export default Hypotexts;
