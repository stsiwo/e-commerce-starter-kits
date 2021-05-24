import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ImageIcon from '@material-ui/icons/Image';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mSelector } from 'src/selectors/selector';
import SampleProductImage from 'static/sample-product-1-1.jpg';
import { ProductImageType } from 'domain/product/types';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      margin: theme.spacing(2)
    },
    avatarBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: `${theme.spacing(1)}px 0`,
    },
    avatar: {
      width: 100,
      height: 100,
      boxShadow: theme.shadows[5],
    },
    root: {
      maxWidth: 200,
      margin: theme.spacing(1),
    },
    media: {
      // aspect ratio: 1:1
      height: 0,
      paddingTop: '100%',
      marginTop: '30',
    },
    form: {
      margin: theme.spacing(1),
      textAlign: "center",
    },
    formControl: {
      // need to be 'flex', otherwise, default animation (e.g., when click the input, the placeholder goes up to the left top) collapses.
      display: "flex",
      maxWidth: 400,
      width: "80%",
      margin: "5px auto",

    },
    actionBox: {
      textAlign: "center"
    },
  }),
);

interface ProductImageFormPropsType {
  productImages: ProductImageType[],
  productImageFiles: File[],
  onUpdate: (file: File, path: string, index: number) => void
  onRemove: (index: number) => void 
}

/**
 * admin product images upload component 
 *
 **/
const ProductImagesForm: React.FunctionComponent<ProductImageFormPropsType> = (props) => {

  // mui: makeStyles
  const classes = useStyles();

  // auth
  const auth = useSelector(mSelector.makeAuthSelector())

  const dispatch = useDispatch()

  // snackbar notification
  // usage: 'enqueueSnackbar("message", { variant: "error" };
  const { enqueueSnackbar } = useSnackbar();

  /**
   * file uploading stuff
   **/
  const length = 5;
  const imageInputRefs = React.useRef<HTMLInputElement[]>(Array(length).fill(null));

  const handleTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {

    const index = parseInt(e.currentTarget.getAttribute("data-image-index")) as number

    if (imageInputRefs.current[index]) {
      imageInputRefs.current[index].click();
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const index = parseInt(e.currentTarget.getAttribute("data-image-index")) as number

    const newFile = e.currentTarget.files[0];
    const newPath = URL.createObjectURL(e.currentTarget.files[0])

    props.onUpdate(newFile, newPath, index);

  }

  const handleRemoveFileClick = (e: React.MouseEvent<HTMLButtonElement>) => {

    const index = parseInt(e.currentTarget.getAttribute("data-image-index")) as number

    props.onRemove(index)
  }

  // render helper
  const renderImageCards: () => React.ReactNode = () => {
    return props.productImageFiles.map((file: File, index: number) => {

      return (
        <Card className={classes.root} key={index}>
          <CardHeader
            avatar={
              <Avatar aria-label={`product-image-${index + 1}`}>
                {index}
              </Avatar>
            }
            title={`Product Image ${index + 1}`}
            subheader={index === 0 ? `Primary` : ""}
          />
          <CardMedia
            className={classes.media}
            image={!props.productImages[index].isChange ? API1_URL + props.productImages[index].productImagePath : props.productImages[index].productImagePath}
            title={file ? file.name : ""}
          />
          <CardActions disableSpacing>
            <IconButton data-image-index={index} onClick={handleRemoveFileClick}>
              <DeleteForeverIcon />
            </IconButton>
            <input
              accept="image/*"
              className={null}
              id={`product-image-input-${index}`}
              multiple
              hidden
              type="file"
              ref={(el) => imageInputRefs.current[index] = el}
              data-image-index={index}
              onChange={handleFileChange}
            />
            <label htmlFor={`product-image-input-${index}`}>
              <IconButton data-image-index={index} onClick={handleTriggerClick}>
                <ImageIcon />
              </IconButton>
            </label>
          </CardActions>
        </Card>
      )
    })
  }

  return (
    <Grid
      container
      justify="center"
    >
      {renderImageCards()}
    </Grid>
  )
}

export default ProductImagesForm
