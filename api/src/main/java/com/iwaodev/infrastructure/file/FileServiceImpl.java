package com.iwaodev.infrastructure.file;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import com.iwaodev.application.iservice.FileService;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class FileServiceImpl implements FileService {

  private static final Logger logger = LoggerFactory.getLogger(FileServiceImpl.class);

  private final List<String> imageFileTypeList = Arrays.asList("image/apng", "image/avif", "image/gif", "image/jpeg",
      "image/png", "image/svg+xml", "image/webp");

  @Override
  public void save(String targetDirectory, String fileName, InputStream content) throws IOException {

    this.generatePathIfNotExist(targetDirectory + "/" + fileName);

    // raw stream writer
    FileOutputStream fos = new FileOutputStream(targetDirectory + "/" + fileName, false);

    // copy input stream content to this fileoutputstream
    IOUtils.copy(content, fos);

    // save it
    fos.close();
  }

  private File generatePathIfNotExist(String path) throws IOException {
    // make sure the directory exists and create it if does not exist

    // path should include the file itself
    File file = new File(path);

    // create any parent directory if it does not exist
    if (!file.getParentFile().exists()) {
      logger.debug("target directory does not exist");
      file.getParentFile().mkdirs();
    }

    // create the file if does not exist
    if (!file.exists()) {
      logger.debug("target file does not exist");
      file.createNewFile();
    }
    return file;
  }

  @Override
  public void save(String path, MultipartFile sourceFile) throws IOException {

    // e.g., /var/www/ec/products/{productId}/images/product-image-0.jpeg
    String filePath = path;

    // create any parent directory and file itself if does not exist.
    File destFile = this.generatePathIfNotExist(filePath);

    // copy this sourceFile to the file and save it.
    sourceFile.transferTo(destFile);
  }

  @Override
  public boolean remove(String path) {
    File targetFile = new File(path);
    return targetFile.delete();
  }

  @Override
  public boolean isImage(MultipartFile file) {
    return this.imageFileTypeList.contains(file.getContentType());
  }

  @Override
  public String getExtension(String fileName) {
    int i = fileName.lastIndexOf('.');
    if (i != -1) {
      return fileName.substring(i + 1);
    }
    return "";
  }

  @Override
  public byte[] load(String path) throws IOException {
    Path targetPath = Paths.get(path);
    return Files.readAllBytes(targetPath);
  }

  @Override
  public void removeWithRegex(String parentDirectory, String pattern) throws IOException {
    List<Path> paths = Files.find(Paths.get(parentDirectory), Integer.MAX_VALUE,
        (path, basicFileAttributes) -> path.toFile().getName().matches(pattern)).collect(Collectors.toList());

    for (Path path : paths) {
      Files.deleteIfExists(path);
    }
  }

  @Override
  public String extractFileNameFromPath(String path) {
    return Paths.get(path).getFileName().toString();
  }

  @Override
  public String generateHashedFileName(String originalFileName) {
    String fileName = com.google.common.io.Files.getNameWithoutExtension(originalFileName);
    String extension = this.getExtension(originalFileName);
    String hashCode = NanoIdUtils.randomNanoId(NanoIdUtils.DEFAULT_NUMBER_GENERATOR, NanoIdUtils.DEFAULT_ALPHABET, 11);

    return fileName + "-" + hashCode + "." + extension;
  }

}
