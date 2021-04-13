import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { generateWishlistItemList } from 'tests/data/wishlist';
import { WishlistItemType } from 'domain/wishlist/types';
import { useDispatch, useSelector } from 'react-redux';
import { mSelector } from 'src/selectors/selector';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import WishlistItem from 'components/common/WishlistItem';

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
      textAlign: "center"
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
 *      (MEMBER): send api request (/users/{userId}/wishlist/{wishlistId} DELETE: delete) 
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

  // implement later
  //const curWishlistItemList = useSelector(mSelector.makeWishlistItemListSelector())
  const testWishlistItems = generateWishlistItemList(4)

  // on select change
  const handleSelectWishlistItemChange: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = (e) => {
    /**
     * dispatch select update action (see above)
     **/
  }

  const renderWishlistItems: () => React.ReactNode = () => {
    return testWishlistItems.map((wishlistItem: WishlistItemType) => {
      return (
        <WishlistItem value={wishlistItem} onChange={handleSelectWishlistItemChange} key={wishlistItem.wishlistId} />
      )
    })
  }

  return (
    <React.Fragment>
      <Typography variant="h5" component="h5" align="center" className={classes.title} >
        {"Wish List"}
      </Typography>
      {(testWishlistItems.length === 0 &&
        <React.Fragment>
        <Typography variant="body1" component="p" align="center">
          {"Oops, you don't have any item in your wishlist."}
        </Typography>
        <Box component="div">
          <Button>  
            {"log in"}
          </Button>
          <Button>  
            {"search"}
          </Button>
        </Box>
        </React.Fragment>
      )}
      {(testWishlistItems.length > 0 &&
        <React.Fragment>
          {renderWishlistItems()}
          <Box component="div" className={classes.controllerBox}>
            <Button>
              {"Go to cart"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default Wishlist


