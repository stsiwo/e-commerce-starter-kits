package com.iwaodev.application.iservice;

import javax.xml.bind.JAXBException;

import com.iwaodev.application.dto.shipping.RatingDTO;
import com.iwaodev.infrastructure.shipping.schema.authreturn.AuthorizedReturn;
import com.iwaodev.infrastructure.shipping.schema.authreturn.AuthorizedReturnInfo;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.NonContractShipment;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.NonContractShipmentInfo;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.NonContractShipmentReceipt;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.NonContractShipmentRefundRequest;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.NonContractShipmentRefundRequestInfo;
import com.iwaodev.infrastructure.shipping.schema.rating.PriceQuotes;
import com.iwaodev.ui.criteria.shipping.RatingCriteria;

public interface CanadaPostService {

  public PriceQuotes getRating(Double weight, String destinationPostalCode, String originalPostalCode) throws JAXBException, Exception;

  public RatingDTO getRegularParcelRating(RatingCriteria criteria, String originalPostalCode) throws JAXBException, Exception;

  public RatingDTO getRegularParcelRating(Double weight, String destinationPostalCode, String originalPostalCode) throws JAXBException, Exception;

  public NonContractShipmentInfo createNonContractShipment(NonContractShipment shipment) throws JAXBException, Exception;

  public byte[] getArtifactAfterNonContractShipment(String getArtifactUrl, String acceptHeader) throws JAXBException, Exception;

  public NonContractShipmentReceipt getNonContractShipmentReceipt(String shipmentId) throws JAXBException, Exception;

  public NonContractShipmentRefundRequestInfo requestConContractShipmentRefund(NonContractShipmentRefundRequest nonContractShipmentRefundRequest, String requestRefundUrl) throws JAXBException, Exception;

  public AuthorizedReturnInfo createAuthrizedReturn(AuthorizedReturn authorizedReturn) throws JAXBException, Exception;

  public byte[] getAuthorizedReturnArtifact(String getAuthorizedReturnArtifactUrl, String acceptHeader) throws JAXBException, Exception;
}

