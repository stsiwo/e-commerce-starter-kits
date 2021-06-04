import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination/Pagination';
import WishlistItem from 'components/common/WishlistItem';
import WishlistItemSearchController from 'components/common/WishlistItemSearchController';
import { WishlistItemType } from 'domain/wishlist/types';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSingleWishlistItemActionCreator, fetchWishlistItemActionCreator, patchWishlistItemActionCreator, wishlistItemPaginationPageActions } from 'reducers/slices/domain/wishlistItem';
import { mSelector } from 'src/selectors/selector';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(6)
    },
    subtotalBox: {
      padding: theme.spacing(1),
    },
    controllerBox: {
      textAlign: "center",
      margin: theme.spacing(3),
    }
  }),
);

/**
 * member & guest wishlist management page
 *
 * steps: 
 *
 *  1. retrieve wishlist item list from redux state
 *
 *  2. display on this dumb component
 *
 *  3. when the user updates (e.g., select, remove), dispatch following actions:
 *
 *    3.2: remove: need to remove the selected item
 *      (MEMBER): send api request (/users/{userId}/wishlist/{wishlistItemId} DELETE: delete) 
 *      (GUEST): just only update redux state
 *
 *  4. received updated state from redux
 *
 *  5. display updated state on this dumb component again
 *      
 *
 **/
const Wishlist: React.FunctionComponent<{}> = (props) => {

  const classes = useStyles();

  const dispatch = useDispatch()

  const curWishlistItems = useSelector(mSelector.makeWishlistItemSelector())

  const curQueryString = useSelector(mSelector.makeWishlistItemQueryStringSelector())
  const pagination = useSelector(mSelector.makeWishlistItemPaginationSelector())

  // fetch wishlistItems
  React.useEffect(() => {
    dispatch(fetchWishlistItemActionCreator())
  }, [
      JSON.stringify(curQueryString)
    ])

  const handleMoveToCartClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {

    const wishlistItemId = e.currentTarget.getAttribute("data-wishlist-id")
    dispatch(
      patchWishlistItemActionCreator({ wishlistItemId: wishlistItemId })
    );

  }

  const handleDeleteClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>> = (e) => {
    const wishlistItemId = e.currentTarget.getAttribute("data-wishlist-id")
    dispatch(
      deleteSingleWishlistItemActionCreator({ wishlistItemId: wishlistItemId })
    );
  }

  const renderWishlistItems: () => React.ReactNode = () => {
    return curWishlistItems.map((wishlistItem: WishlistItemType) => {
      return (
        <WishlistItem value={wishlistItem} onMoveToCartClick={handleMoveToCartClick} onDelete={handleDeleteClick} key={wishlistItem.wishlistItemId} />
      )
    })
  }

  // pagination stuff
  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {

    // need to decrement since we incremented when display
    const nextPage = value - 1;

    dispatch(wishlistItemPaginationPageActions.update(nextPage))
  };
  return (
    <React.Fragment>
      <Typography variant="h5" component="h5" align="center" className={classes.title} >
        {"Wishlist"}
      </Typography>
      <WishlistItemSearchController />
      {(curWishlistItems.length === 0 &&
        <React.Fragment>
          <Typography variant="body1" component="p" align="center">
            {"Oops, Your wishlist is empty."}
          </Typography>
          <Box component="div" className={classes.controllerBox}>
            <Button>
              {"search"}
            </Button>
          </Box>
        </React.Fragment>
      )}
      {(curWishlistItems.length > 0 &&
        <React.Fragment>
          {renderWishlistItems()}
          <Grid container justify="center" className={classes.controllerBox}>
            <Pagination
              page={pagination.page + 1} // don't forget to increment when display
              count={pagination.totalPages}
              color="primary"
              showFirstButton
              showLastButton
              size={"medium"}
              onChange={handlePaginationChange}
            />
          </Grid>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default Wishlist


