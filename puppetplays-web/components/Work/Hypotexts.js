import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { hasAtLeastOneItem } from 'lib/utils';
import Info from 'components/Info';
import Hypotext from 'components/Hypotext';

function Hypotexts({ hypotexts }) {
  const { t } = useTranslation();

  return (
    <Info label={t('common:hypotexts')} show={hasAtLeastOneItem(hypotexts)}>
      {hypotexts.map((hypotext) => (
        <Hypotext key={hypotext.title} {...hypotext} />
      ))}
    </Info>
  );
}

Hypotexts.defaultProps = {
  hypotexts: null,
};

Hypotexts.propTypes = {
  hypotexts: PropTypes.arrayOf(PropTypes.object),
};

export default Hypotexts;
