package com.iwaodev.application.service;

import javax.xml.bind.JAXBException;

import com.iwaodev.application.dto.shipping.RatingDTO;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.CanadaPostService;
import com.iwaodev.application.iservice.ShippingService;
import com.iwaodev.exception.AppException;
import com.iwaodev.ui.criteria.shipping.RatingCriteria;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ShippingServiceImpl implements ShippingService {

  private static final Logger logger = LoggerFactory.getLogger(ShippingServiceImpl.class);

  @Autowired
  private CanadaPostService canadaPostService;

  @Autowired
  private UserRepository userRepository;

  @Override
  public RatingDTO getRating(RatingCriteria criteria) throws Exception {
    return this.getRating(criteria.getParcelWeight(), criteria.getDestinationPostalCode());
  }

@Override
public RatingDTO getRating(Double weight, String destinationPostalCode) throws Exception {
    String originalPostalCode = this.userRepository.getPostalCodeOfAdmin();

    if (originalPostalCode == null || originalPostalCode.isEmpty()) {
        logger.debug("failed to get admin's postal code. this should not happen.");
        throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "internal server error. please try again later.");
    }

    logger.info("satoshi");
    try {
        RatingDTO ratingDTO = this.canadaPostService.getRegularParcelRating(weight, destinationPostalCode, originalPostalCode);
        return ratingDTO;
    } catch (Exception e) {
        throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }
}

}
