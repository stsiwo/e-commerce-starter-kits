import * as React from 'react';
import SearchController from 'components/common/SearchController';
import SearchResult from 'components/common/SearchResult';
import { ProductType } from 'domain/product/types';
import { generateProductList } from 'tests/data/product';

/**
 * "/search" endpoint: to search & display products
 *
 * - stpes:
 *  
 *  1. send a request to /products (GET) to fetch the products
 *  2. manage states (e.g., result blog list, filter/sort/pagination) here (not in child component)
 *  3. every time filter/sort/pagination changes, send a request again.
 *
 **/
const ProductSearch: React.FunctionComponent<{}> = (props) => {

  //
  const [curProductList, setProductList] = React.useState<ProductType[]>(generateProductList(40))

  // filter/sort/pagination
  
  // useEffect to send request every time its dependency updated



  return (
    <React.Fragment>
      <SearchController />
      <SearchResult products={curProductList}/>
    </React.Fragment>
  )
}

export default ProductSearch


