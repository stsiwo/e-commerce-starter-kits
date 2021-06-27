package com.iwaodev.application.iservice;

public interface S3Service {

  public void upload(String path, byte[] bytes) throws Exception;

  public byte[] get(String path) throws Exception;

  /**
   * delete specific file at s3.
   *
   * also, delete users/{userId} s3 directory for delete request of this user.
   **/
  public void delete(String path) throws Exception;

}




