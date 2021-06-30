package com.iwaodev.application.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import com.iwaodev.application.dto.product.ProductDTO;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.iservice.FileService;
import com.iwaodev.application.iservice.ProductService;
import com.iwaodev.application.iservice.S3Service;
import com.iwaodev.application.mapper.ProductMapper;
import com.iwaodev.application.specification.factory.ProductSpecificationFactory;
import com.iwaodev.domain.product.ProductSortEnum;
import com.iwaodev.exception.AppException;
import com.iwaodev.infrastructure.model.Product;
import com.iwaodev.infrastructure.model.ProductImage;
import com.iwaodev.ui.criteria.product.ProductCriteria;
import com.iwaodev.ui.criteria.product.ProductImageCriteria;
import com.iwaodev.ui.criteria.product.ProductQueryStringCriteria;

import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.services.s3.model.S3Exception;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

  private static final Logger logger = LoggerFactory.getLogger(ProductServiceImpl.class);

  @Autowired
  private ProductRepository repository;

  @Autowired
  private ProductSpecificationFactory specificationFactory;

  @Autowired
  private FileService fileService;

  @Autowired
  private S3Service s3Service;

  @Value("${file.product.path}")
  private String productFilePath;

  @Value("${file.product.productImageParentDirectory}")
  private String productImageParentDirectory;

  @PersistenceContext
  private EntityManager entityManager;

  public Page<ProductDTO> getAll(ProductQueryStringCriteria criteria, Integer page, Integer limit, ProductSortEnum sort)
      throws Exception {

    // get result with repository
    // and map entity to dto with MapStruct
    return this.repository
        .findAllToAvoidNPlusOne(this.specificationFactory.build(criteria), PageRequest.of(page, limit, getSort(sort)))
        .map(new Function<Product, ProductDTO>() {

          @Override
          public ProductDTO apply(Product product) {
            ProductDTO dto = ProductMapper.INSTANCE.toProductDTO(product);
            return dto;
          }

        });
  }

  @Override
  public Page<ProductDTO> getPublicAll(ProductQueryStringCriteria criteria, Integer page, Integer limit,
      ProductSortEnum sort) throws Exception {

    // set for public
    criteria.setIsPublic(true);

    // session filter (e.g., @Filter/@FilterDef) - reviews entity
    Session session = this.entityManager.unwrap(Session.class);
    session.enableFilter("verifiedFilter").setParameter("isVerified", true);

    // get result with repository
    // and map entity to dto with MapStruct
    return this.repository
        .findAllToAvoidNPlusOne(this.specificationFactory.build(criteria), PageRequest.of(page, limit, getSort(sort)))
        .map(new Function<Product, ProductDTO>() {

          @Override
          public ProductDTO apply(Product product) {
            logger.info("yes");

            return ProductMapper.INSTANCE.toProductDTO(product);
          }
        });
  }

  private Sort getSort(ProductSortEnum sortEnum) {

    if (sortEnum == ProductSortEnum.DATE_DESC) {
      return Sort.by("createdAt").descending();
    } else if (sortEnum == ProductSortEnum.DATE_ASC) {
      return Sort.by("createdAt").ascending();
    } else if (sortEnum == ProductSortEnum.ALPHABETIC_ASC) {
      return Sort.by("productName").ascending();
    } else if (sortEnum == ProductSortEnum.ALPHABETIC_DESC) {
      return Sort.by("productName").descending();
    } else if (sortEnum == ProductSortEnum.PRICE_ASC) {
      return Sort.by("productBaseUnitPrice").ascending();
    } else {
      return Sort.by("productBaseUnitPrice").descending();
    }
  }

  @Override
  public ProductDTO getById(UUID id) throws Exception {

    // get result with repository
    // and map entity to dto with MapStruct
    Optional<Product> targetEntityOption = this.repository.findById(id);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given product does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given product does not exist.");
    }

    // map entity to dto
    return ProductMapper.INSTANCE.toProductDTO(targetEntityOption.get());
  }

  @Override
  public ProductDTO getByPath(String path) throws Exception {

    // get result with repository
    // and map entity to dto with MapStruct
    Optional<Product> targetEntityOption = this.repository.findByPath(path);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given product does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given product does not exist.");
    }

    // map entity to dto
    return ProductMapper.INSTANCE.toProductDTO(targetEntityOption.get());
  }

  @Override
  public ProductDTO getByPathOrId(String path) throws Exception {

    // get result with repository
    // and map entity to dto with MapStruct
    Optional<Product> targetEntityOption = this.repository.findByPathOrId(path);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given product does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given product does not exist.");
    }

    // map entity to dto
    return ProductMapper.INSTANCE.toProductDTO(targetEntityOption.get());
  }

  @Override
  public ProductDTO getPublicByPathOrId(String path) throws Exception {

    // get result with repository
    // and map entity to dto with MapStruct
    Optional<Product> targetEntityOption = this.repository.findPublicByPathOrId(path);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given product does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given product does not exist.");
    }

    // map entity to dto
    return ProductMapper.INSTANCE.toProductDTO(targetEntityOption.get());
  }

  /**
   * create a product.
   *
   * this does not create variants along with the product.
   *
   **/
  @Override
  public ProductDTO create(ProductCriteria criteria, List<MultipartFile> files) throws Exception {

    /**
     * MapStruct error?
     *
     * 'productId' is not assigned when use MapStruct (e.g., ProductMapper) event if
     * setting UUID.randomUUID() at Product#constructor.
     *
     * for now, assign the id explicitly here.
     * 
     **/

    // map criteria to entity
    Product newEntity = ProductMapper.INSTANCE.toProductEntityFromProductCriteria(criteria);

    // assign id
    newEntity.setProductId(UUID.randomUUID());

    logger.info("new product id: " + newEntity.getProductId());

    // duplication
    if (this.repository.isOthersHavePath(newEntity.getProductId(), criteria.getProductPath())) {
      throw new AppException(HttpStatus.BAD_REQUEST, "the product path already taken.");
    }

    if (this.repository.isOthersHaveName(newEntity.getProductId(), criteria.getProductName())) {
      throw new AppException(HttpStatus.BAD_REQUEST, "the product name already taken.");
    }

    // discout price must be less then unit price

    List<ProductImage> productImages = this.createImages(newEntity.getProductId(), files, criteria.getProductImages());

    newEntity.setProductImages(productImages);

    logger.info("new product image size");
    logger.info("" + newEntity.getProductImages().size());

    logger.info("new product name");
    logger.info("" + newEntity.getProductName());
    // save it
    Product savedEntity = this.repository.save(newEntity);
    /**
     * need this refresh to refresh the @Formular/@Transient fields
     **/
    this.repository.refresh(savedEntity);

    logger.info("is discount available");
    logger.info("" + savedEntity.getIsDiscountAvailable());

    logger.info("new product image size afer saved");
    logger.info("" + savedEntity.getProductImages().size());
    // map entity to dto and return it.
    return ProductMapper.INSTANCE.toProductDTO(savedEntity);
  }

  private List<ProductImage> createImages(UUID productId, List<MultipartFile> files,
      List<ProductImageCriteria> criterion) throws Exception {
    // save to local file system & create product image entity
    List<ProductImage> productImages = new ArrayList<>();

    for (ProductImageCriteria criteria : criterion) {

      ProductImage newEntity = new ProductImage();

      // assign image name only creating.
      newEntity.setProductImageName(criteria.getProductImageName());

      Optional<MultipartFile> fileOption = files.stream().filter(file -> {

        /**
         * 'getOriginalFilename()': file name 'getName()': key name for multipart form
         * data
         **/
        logger.info("file.getOriginalFilename(): " + file.getOriginalFilename());
        logger.info("criteria.getProductImageName(): " + criteria.getProductImageName());
        return file.getOriginalFilename().contains(criteria.getProductImageName());
      }).findFirst();

      // if file exists, we need to save it to local directory and save its public
      // path to its product iamge entity
      if (!fileOption.isEmpty()) {

        logger.info("file exists, so save it.");

        MultipartFile file = fileOption.get();

        // check the file content type (only image is allowed)
        if (!this.fileService.isImage(file)) {
          logger.info("only image files are acceptable.");
          throw new AppException(HttpStatus.BAD_REQUEST, "only image files are acceptable.");
        }

        // generate unique (including hash for cache) file name
        String newFileName = this.fileService.generateHashedFileName(file.getOriginalFilename());

        logger.info("create local directory and public path");

        // construct path
        String localDirectory = this.getProductLocalDirectory(productId);
        String publicPath = this.getPublicPath(newFileName, productId.toString());
        String localDirectoryWithFile = localDirectory + "/" + newFileName;

        logger.info("local Directory: " + localDirectory + " and public path: " + publicPath);

        // try to save teh file
        try {
          this.s3Service.upload(localDirectoryWithFile, file.getBytes());
        } catch (Exception e) {
          logger.info(e.getMessage());
          throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        newEntity.setProductImagePath(publicPath);
      } else {

        /**
         * still you need to assign empty string to productImagePath which is not null
         * column in db. otherwise, you got sql constraint error.
         **/
        newEntity.setProductImagePath("");
      }

      // if the file does not exist, we don't need to set product image path.

      // both cases, we need to set 'isChange' to false for the next update.
      // isChange: false => the client does not update/remove the image.
      newEntity.setIsChange(false);

      // both cases, never change the productImageName
      // newEntity.setProductImageName(criteria.getProductImageName());

      productImages.add(newEntity);
    }

    return productImages;
  }

  @Override
  public ProductDTO update(ProductCriteria criteria, UUID id, List<MultipartFile> files) throws Exception {

    Optional<Product> targetEntityOption = this.repository.findById(id);

    if (targetEntityOption.isEmpty()) {
      logger.info("the given product does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given product does not exist.");
    }

    Product oldEntity = targetEntityOption.get();

    // make sure criteria has product id
    criteria.setProductId(id);

    // create new one
    Product newEntity = ProductMapper.INSTANCE.toProductEntityFromProductCriteria(criteria);

    // duplication
    if (this.repository.isOthersHavePath(newEntity.getProductId(), criteria.getProductPath())) {
      throw new AppException(HttpStatus.BAD_REQUEST, "the product path already taken.");
    }

    if (this.repository.isOthersHaveName(newEntity.getProductId(), criteria.getProductName())) {
      throw new AppException(HttpStatus.BAD_REQUEST, "the product name already taken.");
    }

    // update product images
    this.updateImages(id, files, oldEntity.getProductImages(), newEntity.getProductImages());

    // transfer variants from old to new too
    newEntity.setVariants(oldEntity.getVariants());

    // unit price must be greater than the discount price at any variant if it does
    // not has its own unit price validaiton
    if (!newEntity.isBaseUnitPriceLessThanDiscountPriceAtAnyVariant()) {
      throw new AppException(HttpStatus.BAD_REQUEST,
          "the one of your discount price at its varaint must be cheaper than this product unit price.");
    }

    // hopely, remove old one included nested entity and replace with new one
    // 'save' return updated entity so return this one
    Product updatedEntity = this.repository.save(newEntity);
    /**
     * when updating you need to call this flush otherwise update statement does not
     * executed. i don't know why.
     **/
    this.repository.flush();
    /**
     * need this refresh to refresh the @Formular/@Transient fields
     **/
    this.repository.refresh(updatedEntity);

    return ProductMapper.INSTANCE.toProductDTO(updatedEntity);
  }

  // this includes update/remove product images
  private void updateImages(UUID productId, List<MultipartFile> files, List<ProductImage> oldProductImages,
      List<ProductImage> newProductImages) throws Exception {

    logger.info("start handling update of images");

    for (ProductImage newProductImage : newProductImages) {

      logger.info("target product image id: " + newProductImage.getProductImageId());

      // only update product images which = isChange: true
      if (!newProductImage.getIsChange()) {
        logger.info("isChange is false so go next one");
        continue;
      }
      logger.info("isChange is true so remove this image first then update if necessary");

      // find target product image
      Optional<ProductImage> oldProductImageOption = oldProductImages.stream()
          .filter(productImage -> productImage.getProductImageId().equals(newProductImage.getProductImageId()))
          .findFirst();

      // should exist otherwise your logic is wrong.
      if (oldProductImageOption.isEmpty()) {
        logger.info("the given product image does not exist");
        throw new AppException(HttpStatus.NOT_FOUND, "the given product image does not exist.");
      }

      ProductImage oldProductImage = oldProductImageOption.get();

      logger.info("product image id: " + oldProductImage.getProductImageId());

      // if this is empty => remove the product image
      // if this is not empty => update the product image
      Optional<MultipartFile> fileOption = files.stream()
          .filter(file -> file.getOriginalFilename().contains(newProductImage.getProductImageName())).findFirst();

      // get local product directory
      String localDirectory = this.getProductLocalDirectory(productId);

      /**
       * remove previous image (both cases: update/remove)
       *
       **/
      String oldProductImagePath = oldProductImage.getProductImagePath();

      // remove it
      try {
        this.s3Service.delete(oldProductImagePath);
      } catch (Exception e) {
        logger.info(e.getMessage());
        throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
      }

      /**
       * update image
       **/
      // product image
      if (!fileOption.isEmpty()) {

        logger.info("need to add new file");

        // need to update
        MultipartFile file = fileOption.get();

        // check the file content type (only image is allowed)
        if (!this.fileService.isImage(file)) {
          logger.info("only image files are acceptable.");
          throw new AppException(HttpStatus.BAD_REQUEST, "only image files are acceptable.");
        }

        // generate unique (including hash for cache) file name
        String newFileName = this.fileService.generateHashedFileName(file.getOriginalFilename());

        // construct path
        String publicPath = this.getPublicPath(newFileName, productId.toString());
        String localDirectoryWithFile = localDirectory + "/" + newFileName;

        // try to save teh file
        try {
          // save new one
          this.s3Service.upload(localDirectoryWithFile, file.getBytes());

        } catch (Exception e) {
          logger.info(e.getMessage());
          throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        logger.info("updated public path: " + publicPath);
        logger.info("updated product image name: " + newProductImage.getProductImageName());

        newProductImage.setProductImagePath(publicPath);

      } else {
        // when removing
        newProductImage.setProductImagePath("");
      }

      newProductImage.setIsChange(false);
    }
  }

  private String getProductLocalDirectory(UUID productId) {
    return this.productFilePath + "/" + productId.toString() + "/" + this.productImageParentDirectory;
  }

  private String getPublicPath(String fileName, String productIdString) {
    return this.productFilePath + "/" + productIdString + "/" + this.productImageParentDirectory + "/" + fileName;
  }

  @Override
  public void delete(UUID id) throws Exception {

    /**
     * deleting product permanently is not good idea, esp for its related orders.
     *
     * - so, if the product does not have any deal before, you can delete the
     * product permanently.
     *
     * - this is useful if the admin put wrong product and want to delete it.
     *
     *
     * #Change:
     *
     * - now you can successfully delete products even if the product is purchased
     * before since the order store the all necessary info.
     *
     **/

    Optional<Product> targetEntityOption = this.repository.findById(id);

    if (!targetEntityOption.isEmpty()) {
      Product targetEntity = targetEntityOption.get();

      // delete product images at s3
      String productKey = this.productFilePath + "/" + targetEntity.getProductId().toString();
      this.s3Service.delete(productKey);

      this.repository.delete(targetEntity);
    }
  }

  // @Override
  // public void uploadProductImages(UUID productId, MultipartFile[] files) {

  // // find the product
  // Optional<Product> targetEntityOption = this.repository.findById(productId);

  // if (targetEntityOption.isEmpty()) {
  // logger.info("the given product does not exist");
  // throw new AppException(HttpStatus.NOT_FOUND, "the given product
  // does not exist.");
  // }

  // // save to local file system & create product image entity
  // List<ProductImage> productImages = new ArrayList<>();

  // for (int i = 0; i < files.length; i++) {

  // MultipartFile file = files[i];

  // // check the file content type (only image is allowed)
  // if (!this.fileService.isImage(file)) {
  // logger.info("only image files are acceptable.");
  // throw new AppException(HttpStatus.BAD_REQUEST, "only image files
  // are acceptable.");
  // }

  // // construct path
  // String directoryPath = this.productFilePath + "/" + productId.toString();
  // String fileName = this.productImageName + "-" + i +
  // this.fileService.getExtension(file.getName());
  // String path = directoryPath + "/" + fileName;

  // // try to save teh file
  // try {
  // this.fileService.save(path, file);
  // } catch (IOException e) {
  // logger.info(e.getMessage());
  // throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR,
  // e.getMessage());
  // }

  // // create new product image entity
  // ProductImage productImage = new ProductImage(fileName);
  // productImages.add(productImage);
  // }

  // Product targetEntity = targetEntityOption.get();

  // targetEntity.setProductImages(productImages);

  // this.repository.save(targetEntity);
  // }

  // @Override
  // public void removeProductImages(UUID productId) {

  // // find the product
  // Optional<Product> targetEntityOption = this.repository.findById(productId);

  // if (targetEntityOption.isEmpty()) {
  // logger.info("the given product does not exist");
  // throw new AppException(HttpStatus.NOT_FOUND, "the given product
  // does not exist.");
  // }

  // // get product images from db
  // Product targetEntity = targetEntityOption.get();

  // for (ProductImage productImage : targetEntity.getProductImages()) {

  // String productImagePath = productImage.getProductImagePath();

  // // construct internal path to the image
  // String path = this.productFilePath + "/" + productId.toString() + "/" +
  // productImagePath;

  // // remove from the directory
  // boolean isSuccess = this.fileService.remove(path);

  // logger.info("product image file succeed (" + path + ")?" + isSuccess);

  // // update product entity to remove avatarImagePath
  // targetEntity.removeProductImage(productImage);
  // }

  // this.repository.save(targetEntity);
  // }

  @Override
  public byte[] getProductImage(UUID productId, String imageName) throws Exception {

    String internalPath = this.getProductLocalDirectory(productId) + "/" + imageName;

    byte[] content = null;

    try {
      // content = this.fileService.load(internalPath);
      content = this.s3Service.get(internalPath);
    } catch (Exception e) {
      logger.info(e.getMessage());
      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

    return content;
  }

  @Override
  public void turnPassedDiscountFalseByTime(LocalDateTime time) throws Exception {

    // get all product
    List<Product> products = this.repository.findAll();

    // if any variant of the product is discount and it passed the end date, make
    // is_discount false.
    for (Product product : products) {
      product.turnDiscountFalseByTime(time);
    }

    this.repository.saveAll(products);
  }

  /**
   * make is_public true only if the release date == time (date).
   *
   * this does not include any other date esp past. this is because user might want to unpublish some products on purpose even if it passed release date.
   **/
  @Override
  public void publishProductsByTime(LocalDateTime time) throws Exception {
    
    // get all product
    List<Product> products = this.repository.findAll();

    // if any unpublished product even if it passed release date, make is_public true 
    for (Product product : products) {
      product.publishProductsByTime(time);
    }

    this.repository.saveAll(products);
  }

}
