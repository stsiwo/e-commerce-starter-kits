package com.iwaodev.application.iservice;

import javax.xml.bind.JAXBException;

import com.iwaodev.infrastructure.shipping.schema.ncshipment.NonContractShipment;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.NonContractShipmentInfo;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.NonContractShipmentReceipt;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.NonContractShipmentRefundRequest;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.NonContractShipmentRefundRequestInfo;
import com.iwaodev.infrastructure.shipping.schema.rating.PriceQuotes;
import com.iwaodev.infrastructure.shipping.schema.authreturn.AuthorizedReturn;
import com.iwaodev.infrastructure.shipping.schema.authreturn.AuthorizedReturnInfo;
import com.iwaodev.ui.criteria.shipping.RatingCriteria;

public interface ShippingService {

  public PriceQuotes getRating(RatingCriteria criteria) throws JAXBException;

  public NonContractShipmentInfo createNonContractShipment(NonContractShipment shipment) throws JAXBException;

  public byte[] getArtifactAfterNonContractShipment(String getArtifactUrl, String acceptHeader) throws JAXBException;

  public NonContractShipmentReceipt getNonContractShipmentReceipt(String shipmentId) throws JAXBException;

  public NonContractShipmentRefundRequestInfo requestConContractShipmentRefund(NonContractShipmentRefundRequest nonContractShipmentRefundRequest, String requestRefundUrl) throws JAXBException;

  public AuthorizedReturnInfo createAuthrizedReturn(AuthorizedReturn authorizedReturn) throws JAXBException;

  public byte[] getAuthorizedReturnArtifact(String getAuthorizedReturnArtifactUrl, String acceptHeader) throws JAXBException;
}

