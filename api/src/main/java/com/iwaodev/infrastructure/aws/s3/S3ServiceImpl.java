package com.iwaodev.infrastructure.aws.s3;

import java.nio.ByteBuffer;
import java.util.UUID;

import javax.annotation.PostConstruct;

import com.iwaodev.application.iservice.S3Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.model.S3Object;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class S3ServiceImpl implements S3Service {

  private static final Logger logger = LoggerFactory.getLogger(S3ServiceImpl.class);

  private S3Client s3Client;

  @Value("${aws.s3.region}")
  private String awsRegion;

  @Value("${aws.s3.bucketName}")
  private String awsBucketName;

  /**
   * you can't inject @value if you use the default constructor and assign the
   * value to property.
   *
   * this is because injection is done after calling the constructor.
   *
   * ref:
   * https://stackoverflow.com/questions/25764459/spring-boot-application-properties-value-not-populating/25765032
   *
   **/

  public S3ServiceImpl() {
  }

  @PostConstruct
  public void init() {
    logger.info("aws s3 region: " + this.awsRegion);
    logger.info("aws s3 bucket name: " + this.awsBucketName);

    Region region = Region.of(this.awsRegion);
    this.s3Client = S3Client.builder().region(region).build();
  }

  /**
   * ref:
   * https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/examples-s3-objects.html
   **/

  @Override
  public void upload(String path, byte[] bytes) throws Exception {

    logger.info("start upload image to " + path);
    logger.info("size: " + bytes.length);

    try {
      PutObjectRequest objectRequest = PutObjectRequest.builder().bucket(this.awsBucketName).key(path).build();
      this.s3Client.putObject(objectRequest, RequestBody.fromByteBuffer(ByteBuffer.wrap(bytes)));
    } catch (S3Exception e) {
      throw new Exception(e.getMessage());
    }

  }

  @Override
  public byte[] get(String path) throws Exception {

    logger.info("start get image to " + path);
    GetObjectRequest getObjectRequest = GetObjectRequest.builder().bucket(this.awsBucketName).key(path).build();

    ResponseBytes<GetObjectResponse> responseBytes;
    try {
      responseBytes = this.s3Client.getObjectAsBytes(getObjectRequest);
    } catch (S3Exception e) {
      throw new Exception(e.getMessage());
    }

    return responseBytes.asByteArray();
  }

  /**
   * if you need to delete a folder, you need to delete all of its object inside the folder first.
   **/
  @Override
  public void delete(String path) throws Exception {
    logger.info("start delete image to " + path);

    if (path == null || path.isEmpty()) {
      logger.info("path is empty so skip deleting");
      return;
    }

    DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder().bucket(this.awsBucketName).key(path)
        .build();

    try {
      this.s3Client.deleteObject(deleteObjectRequest);
    } catch (S3Exception e) {
      throw new Exception(e.getMessage());
    }
  }

  @Override
  public void deleteFolder(String path) throws Exception {

    try {
            // To delete a bucket, all the objects in the bucket must be deleted first
            ListObjectsV2Request listObjectsV2Request = ListObjectsV2Request
              .builder()
              .bucket(this.awsBucketName)
              .prefix(path)
              .build();

            ListObjectsV2Response listObjectsV2Response;

            do {
                listObjectsV2Response = this.s3Client.listObjectsV2(listObjectsV2Request);
                for (S3Object s3Object : listObjectsV2Response.contents()) {
                    this.s3Client.deleteObject(DeleteObjectRequest.builder()
                            .bucket(this.awsBucketName)
                            .key(s3Object.key())
                            .build());
                }

                listObjectsV2Request = ListObjectsV2Request.builder().bucket(this.awsBucketName)
                        .continuationToken(listObjectsV2Response.nextContinuationToken())
                        .build();

            } while(listObjectsV2Response.isTruncated());

            // then, delete an empty folder.
            this.delete(path);

    } catch (S3Exception e) {
      throw new Exception(e.getMessage());
    }
  }

  @Override
  public void listAllObjects(String path) throws Exception {
    
  }
}
