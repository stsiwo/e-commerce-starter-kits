package com.iwaodev.application.iservice;

import com.iwaodev.application.dto.shipping.RatingDTO;
import com.iwaodev.ui.criteria.shipping.RatingCriteria;

public interface ShippingService {

  public RatingDTO getRating(RatingCriteria criteria) throws Exception;

  public RatingDTO getRating(Double weight, String destinationPostalCode) throws Exception;
}




