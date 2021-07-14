package com.iwaodev.ui.controller;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import com.iwaodev.application.dto.shipping.RatingDTO;
import com.iwaodev.application.iservice.ShippingService;
import com.iwaodev.ui.criteria.shipping.RatingCriteria;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ShippingController {

  private static final Logger logger = LoggerFactory.getLogger(ShippingController.class);

  @Autowired
  private ShippingService shippingService;
  /**
   * authenticate non-logged in user.
   * 
   **/
  @RequestMapping(value = "/shipping/rating", method = RequestMethod.POST)
  public ResponseEntity<RatingDTO> index(
      @RequestBody @Valid RatingCriteria criteria,
      HttpServletResponse response) throws Exception {

    return new ResponseEntity<>(this.shippingService.getRating(criteria), HttpStatus.OK);

  }

}

