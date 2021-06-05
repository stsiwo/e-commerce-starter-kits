package com.iwaodev.util;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;

import org.springframework.stereotype.Component;

/**
 * generate 11 char length unique id.
 *
 * ref: https://zelark.github.io/nano-id-cc/ 
 **/

@Component
public class NanoIdGenerator {


    public static String getId() {
      /**
       * only change size to 11
       **/
      return NanoIdUtils.randomNanoId(NanoIdUtils.DEFAULT_NUMBER_GENERATOR, NanoIdUtils.DEFAULT_ALPHABET, 11);
    }

    // more utility methods
}

