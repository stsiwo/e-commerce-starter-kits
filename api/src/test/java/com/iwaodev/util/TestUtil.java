package com.iwaodev.util;




import java.lang.reflect.Type;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.iwaodev.application.event.EventHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.reflections.Reflections;
import org.springframework.context.ApplicationEvent;
import org.springframework.stereotype.Component;


@Component
public class TestUtil {

  private static final Logger logger = LoggerFactory.getLogger(TestUtil.class);

  public Set<Class<? extends EventHandler>> getAllEventHandlerOfEvent(Class eventClass) {
    Reflections ref = new Reflections("com.iwaodev");
    Set<Class<? extends EventHandler>> allEventHandlers = ref.getSubTypesOf(EventHandler.class);

    Set<Class<? extends EventHandler>> targetEventHandlers = allEventHandlers.stream().filter(eventHandler -> {
      Type[] types = eventHandler.getGenericInterfaces();
      
      boolean isContained = false;
      for (Type type: types) {
        if (type.getTypeName().contains(eventClass.getTypeName()) && type.getTypeName().contains(EventHandler.class.getTypeName())) {
          isContained = true;
        }
      }
      return isContained;
    }).collect(Collectors.toSet());

    return targetEventHandlers;
  }

  public Set<Class<? extends ApplicationEvent>> getAllEvent() {
    Reflections ref = new Reflections("com.iwaodev");
    Set<Class<? extends ApplicationEvent>> allEvents = ref.getSubTypesOf(ApplicationEvent.class);

    return allEvents;
  }
}
