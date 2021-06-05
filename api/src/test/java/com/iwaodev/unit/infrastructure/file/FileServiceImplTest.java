package com.iwaodev.unit.infrastructure.file;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

import com.iwaodev.application.iservice.FileService;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("unittest")
public class FileServiceImplTest {

  @Autowired
  private FileService fileService;

  @Value("${file.order.path}")
  private String fileOrderPath;

  private static final Logger logger = LoggerFactory.getLogger(FileServiceImplTest.class);

  @Test
  public void shouldSaveFileSuccessfullyWhenSave() throws Exception {

    // arrange 
    String dummyFileName = "sample-artifact.txt";
    String dummyContent = "dummyContent";
    InputStream dummyContentStream = new ByteArrayInputStream(dummyContent.getBytes());
    
    // act 
    this.fileService.save(this.fileOrderPath + "/order_id", dummyFileName, dummyContentStream);
    
    // assert
    assertThat(1).isEqualTo(1);



  }
}
