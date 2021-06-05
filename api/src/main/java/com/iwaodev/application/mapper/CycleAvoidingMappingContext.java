package com.iwaodev.application.mapper;

import java.util.IdentityHashMap;
import java.util.Map;

import org.mapstruct.BeforeMapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.TargetType;

/**
 * ref: https://github.com/mapstruct/mapstruct-examples/tree/master/mapstruct-mapping-with-cycles
 **/
public class CycleAvoidingMappingContext {

  private Map<Object, Object> knownInstances = new IdentityHashMap<Object, Object>();

  @BeforeMapping
  public <T> T getMappedInstance(Object source, @TargetType Class<T> targetType) {
    return (T) knownInstances.get(source);
  }

  @BeforeMapping
  public void storeMappedInstance(Object source, @MappingTarget Object target) {
    knownInstances.put(source, target);
  }
}
