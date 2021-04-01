import ReactPaginate from 'react-paginate';
import useTranslation from 'next-translate/useTranslation';
import styles from './pagination.module.scss';

function Pagination({
  initialPage = 0,
  forcePage = 0,
  pageCount,
  onPageChange,
}) {
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

export default Pagination;
