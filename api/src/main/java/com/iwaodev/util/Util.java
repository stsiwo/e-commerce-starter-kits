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

  /**
   * format postal code.
   *
   * remove space. (e.g., "A1A 2C2" => "A1A2C2").
   **/
  public static String formatPostalCode(String postalCode) {
    return postalCode.replaceAll("\\s+","");
  }

  /**
   *
   * @param curVersion: a version in db
   * @param receivedVersion: a version you received from client
   * @return true if match, otherwise false
   */
  public static boolean checkETagVersion(Long curVersion, String receivedVersion) {
    return receivedVersion.equals("\"" + curVersion + "\"");
  }
}
