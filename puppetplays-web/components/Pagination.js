import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import { useTranslation } from 'next-i18next';
import styles from './pagination.module.scss';

function Pagination({ forcePage, pageCount, onPageChange }) {
  const { t } = useTranslation();

  return (
    <ReactPaginate
      previousLabel={t('common:previous')}
      nextLabel={t('common:next')}
      breakLabel="..."
      pageCount={pageCount}
      pageRangeDisplayed={5}
      marginPagesDisplayed={2}
      onPageChange={onPageChange}
      forcePage={forcePage}
      containerClassName={styles.container}
      activeClassName="is-current"
      previousClassName={pageCount === 1 && 'is-hidden'}
      nextClassName={pageCount === 1 && 'is-hidden'}
      disableInitialCallback
    />
  );
}

Pagination.defaultProps = {
  forcePage: 0,
};

Pagination.propTypes = {
  forcePage: PropTypes.number,
  pageCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
