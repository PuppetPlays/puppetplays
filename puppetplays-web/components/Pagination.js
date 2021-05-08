import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import useTranslation from 'next-translate/useTranslation';
import styles from './pagination.module.scss';

function Pagination({ initialPage, forcePage, pageCount, onPageChange }) {
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
      initialPage={initialPage}
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
  initialPage: 0,
  forcePage: 0,
};

Pagination.propTypes = {
  initialPage: PropTypes.number,
  forcePage: PropTypes.number,
  pageCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
