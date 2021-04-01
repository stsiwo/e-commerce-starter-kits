import * as React from 'react';
import SearchController from 'components/common/SearchController';
import SearchResult from 'components/common/SearchResult';

const ProductSearch: React.FunctionComponent<{}> = (props) => {

  return (
    <React.Fragment>
      <SearchController />
      <SearchResult />
    </React.Fragment>
  )
}

export default ProductSearch


