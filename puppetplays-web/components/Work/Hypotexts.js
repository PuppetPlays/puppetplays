import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { hasAtLeastOneItem } from 'lib/utils';
import Info from 'components/Info';
import Hypotext from 'components/Hypotext';

function Hypotexts({ hypotexts }) {
  const { t } = useTranslation();

  return (
    <Info label={t('common:hypotexts')} show={hasAtLeastOneItem(hypotexts)}>
      {hypotexts && Array.isArray(hypotexts) && hypotexts.map((hypotext) => (
        <div key={hypotext.title}>
          <Hypotext {...hypotext} />
        </div>
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
