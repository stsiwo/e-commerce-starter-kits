package com.iwaodev.util;

import java.math.BigDecimal;
import java.text.NumberFormat;

import org.springframework.stereotype.Component;

@Component
public class Util {

  /**
   * display BigDecimal as currency
   **/
  public static String currencyFormat(BigDecimal n) {
    return NumberFormat.getCurrencyInstance().format(n);
  }
}
