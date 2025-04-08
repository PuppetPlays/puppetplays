export async function getServerSideProps({ locale, query }) {
  try {
    const filtersState = queryParamsToState(query);

    // Wrap each API call in try/catch to prevent one failure from breaking everything
    let uniqueAuthorsIds = [];
    let authors = [];

    try {
      const authorsIds = await getFetchAPIClient({
        variables: { locale },
      })(getAllWorksAuthorsIdsQuery);

      uniqueAuthorsIds = uniq(
        (authorsIds?.entries || []).flatMap(entry =>
          (entry?.authors || []).map(author => author?.id).filter(Boolean),
        ),
      );
    } catch (error) {
      console.error('Error fetching authors IDs:', error);
    }

    try {
      if (uniqueAuthorsIds.length > 0) {
        const personsRelatedToWorks = await getFetchAPIClient({
          variables: { locale, ...stateToGraphqlVariables(filtersState) },
        })(getAllAuthorsQuery(filtersState));

        authors = (personsRelatedToWorks?.entries || []).filter(({ id }) =>
          uniqueAuthorsIds.includes(id),
        );
      }
    } catch (error) {
      console.error('Error fetching authors details:', error);
    }

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        initialData: { entries: groupBy(authors, getFirstLetter) },
        uniqueAuthorsIds,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        initialData: { entries: {} },
        uniqueAuthorsIds: [],
      },
    };
  }
} 