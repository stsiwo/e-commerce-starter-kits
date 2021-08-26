package com.iwaodev.application.iservice;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {

  public boolean isImage(MultipartFile file);

  public void save(String targetDirectory, String fileName, InputStream content) throws IOException;

  public void save(String path, MultipartFile sourceFile) throws IOException;

  public boolean remove(String path);

  public void removeWithRegex(String parentDirectory, String pattern) throws IOException;

  public byte[] load(String path) throws IOException;

  public String getExtension(String fileName);

  public String extractFileNameFromPath(String path);

  public String generateHashedFileName(String originalFileName);

  public Boolean isExceedMaxSize(MultipartFile file);
}


