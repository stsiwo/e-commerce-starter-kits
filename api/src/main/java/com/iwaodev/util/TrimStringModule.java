package com.iwaodev.util;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdScalarDeserializer;
import com.fasterxml.jackson.databind.module.SimpleModule;

import org.springframework.stereotype.Component;

@Component
public class TrimStringModule extends SimpleModule {

  private static final long serialVersionUID = 1L;

  public TrimStringModule() {
    addDeserializer(String.class, new StdScalarDeserializer<String>(String.class) {
      @Override
      public String deserialize(JsonParser jp, DeserializationContext ctxt)
          throws IOException, JsonProcessingException {
        return jp.getValueAsString().trim();
      }
    });
  }

}
