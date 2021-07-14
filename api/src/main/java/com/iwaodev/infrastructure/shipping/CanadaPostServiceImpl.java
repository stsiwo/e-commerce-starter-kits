package com.iwaodev.infrastructure.shipping;

import java.io.StringReader;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Iterator;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import com.iwaodev.application.dto.shipping.RatingDTO;
import com.iwaodev.application.iservice.CanadaPostService;
import com.iwaodev.infrastructure.shipping.schema.authreturn.AuthorizedReturn;
import com.iwaodev.infrastructure.shipping.schema.authreturn.AuthorizedReturnInfo;
import com.iwaodev.infrastructure.shipping.schema.messages.Messages;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.NonContractShipment;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.NonContractShipmentInfo;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.NonContractShipmentReceipt;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.NonContractShipmentRefundRequest;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.NonContractShipmentRefundRequestInfo;
import com.iwaodev.infrastructure.shipping.schema.rating.MailingScenario;
import com.iwaodev.infrastructure.shipping.schema.rating.MailingScenario.Destination;
import com.iwaodev.infrastructure.shipping.schema.rating.MailingScenario.Destination.Domestic;
import com.iwaodev.infrastructure.shipping.schema.rating.PriceQuotes.PriceQuote;
import com.iwaodev.infrastructure.shipping.schema.rating.PriceQuotes;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.NonContractShipment;
import com.iwaodev.ui.criteria.shipping.RatingCriteria;
import com.iwaodev.util.Util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CanadaPostServiceImpl implements CanadaPostService {

  private static final Logger logger = LoggerFactory.getLogger(CanadaPostServiceImpl.class);

  private RestTemplate restTemplate;

  private String ratingUrl;

  private String nonContractShipmentUrl;

  private String authorizedReturnUrl;

  private String customerNumber;

  private Util util;

  @Autowired
  public CanadaPostServiceImpl(@Qualifier("shippingRestTemplate") RestTemplate restTemplate,
      @Value("${shipping.api.baseurl}") String shippingApiBaseUrl,
      @Value("${shipping.api.customernumber}") String shippingApiCustomerNumber, Util util) {
    this.restTemplate = restTemplate;
    this.ratingUrl = shippingApiBaseUrl + "/rs/ship/price";
    this.nonContractShipmentUrl = shippingApiBaseUrl + "/" + shippingApiCustomerNumber + "/ncshipment";
    this.authorizedReturnUrl = shippingApiBaseUrl + "/rs/" + shippingApiCustomerNumber + "/" + shippingApiCustomerNumber
        + "/authorizedreturn";
    this.customerNumber = shippingApiCustomerNumber;
    this.util = util;
  }

  @Override
  public PriceQuotes getRating(Double weight, String destinationPostalCode, String originalPostalCode)
      throws JAXBException, Exception {

    /**
     * construct request body based on this criteria
     **/
    MailingScenario mailingScenario = new MailingScenario();
    mailingScenario.setCustomerNumber(this.customerNumber);

    logger.info("customer number (canada post): " + this.customerNumber);

    MailingScenario.ParcelCharacteristics parcelCharacteristics = new MailingScenario.ParcelCharacteristics();
    /**
     * prevent the value from overflow the decimal point. use 'setScale'.
     **/
    parcelCharacteristics.setWeight(new BigDecimal(weight).setScale(3, RoundingMode.UP));
    mailingScenario.setParcelCharacteristics(parcelCharacteristics);

    mailingScenario.setOriginPostalCode(this.util.formatPostalCode(originalPostalCode));

    Domestic domestic = new Domestic();
    domestic.setPostalCode(this.util.formatPostalCode(destinationPostalCode));
    Destination destination = new Destination();
    destination.setDomestic(domestic);
    mailingScenario.setDestination(destination);

    /**
     * issue with XmlMapper (e.g., ObjectMapper) from jackson xml library.
     *
     * don't use this otherwise, you get an error, which ignore 'xmlns' when
     * serializing so don't use it.
     *
     * instead, use JAXB.marshal.
     *
     * issue with JAXB.marshal/unmarshal.
     *
     * don't use thsi otherwise, you get an error with unmarshal function (e.g.,
     * io.FileNotFoundExeption)
     *
     * instead, ue JAXBContext.
     *
     **/
    String requestBody = serializeObjectToXmlString(mailingScenario, MailingScenario.class);

    logger.info(requestBody);

    /**
     * prep for post request
     **/
    HttpHeaders headers = new HttpHeaders();
    headers.add("Accept", "application/vnd.cpc.ship.rate-v4+xml");
    headers.add("Content-Type", "application/vnd.cpc.ship.rate-v4+xml");
    headers.add("Accept-Language", "en-CA");

    HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

    /**
     * request
     **/
    ResponseEntity<String> response = this.restTemplate.postForEntity(this.ratingUrl, request, String.class);
    logger.info(response.getBody());

    /**
     * parse response xml to dto object
     **/
    if (response.getStatusCode().is2xxSuccessful()) {
      // 2xx
      PriceQuotes priceQuotes = deserializeXmlStringToObject(response.getBody(), PriceQuotes.class);
      return priceQuotes;
    } else {
      // anything else
      Messages messageData = deserializeXmlStringToObject(response.getBody(), Messages.class);
      for (Iterator<Messages.Message> iter = messageData.getMessage().iterator(); iter.hasNext();) {
        Messages.Message aMessage = (Messages.Message) iter.next();
        logger.info("Error Code: " + aMessage.getCode());
        logger.info("Error Msg: " + aMessage.getDescription());
      }
      throw new Exception("failed to get rating cost & delivery date");
    }

  }

  private RatingDTO extractRegularParcel(PriceQuotes quotes) {
    RatingDTO ratingDTO = new RatingDTO();
    for (PriceQuote quote : quotes.getPriceQuotes()) {
      if (quote.getServiceName().equals("Regular Parcel")) {
        logger.info("this is regular parcel");
        ratingDTO.setEstimatedShippingCost(quote.getPriceDetails().getDue());
        ratingDTO.setExpectedDeliveryDate(quote.getServiceStandard().getExpectedDeliveryDate().toGregorianCalendar()
            .toZonedDateTime().toLocalDateTime());
      }
    }
    return ratingDTO;
  }

  @Override
  public RatingDTO getRegularParcelRating(Double weight, String destinationPostalCode, String originalPostalCode)
      throws JAXBException, Exception {
    PriceQuotes priceQuotes = this.getRating(weight, destinationPostalCode, originalPostalCode);
    return this.extractRegularParcel(priceQuotes);
  }

  @Override
  public RatingDTO getRegularParcelRating(RatingCriteria criteria, String originalPostalCode)
      throws JAXBException, Exception {
    PriceQuotes priceQuotes = this.getRating(criteria.getParcelWeight(), criteria.getDestinationPostalCode(), originalPostalCode);
    return this.extractRegularParcel(priceQuotes);
  }

  @Override
  public NonContractShipmentInfo createNonContractShipment(NonContractShipment shipment)
      throws JAXBException, Exception {

    /**
     * issue with XmlMapper (e.g., ObjectMapper) from jackson xml library.
     *
     * don't use this otherwise, you get an error, which ignore 'xmlns' when
     * serializing so don't use it.
     *
     * instead, use JAXB.marshal.
     *
     * issue with JAXB.marshal/unmarshal.
     *
     * don't use thsi otherwise, you get an error with unmarshal function (e.g.,
     * io.FileNotFoundExeption)
     *
     * instead, use JAXBContext.
     *
     **/
    String requestBody = serializeObjectToXmlString(shipment, NonContractShipment.class);

    logger.info(requestBody);

    /**
     * prep for post request
     **/
    HttpHeaders headers = new HttpHeaders();
    headers.add("Accept", "application/vnd.cpc.ncshipment-v4+xml");
    headers.add("Content-Type", "application/vnd.cpc.ncshipment-v4+xml");
    headers.add("Accept-Language", "en-CA");

    HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

    /**
     * request
     **/
    ResponseEntity<String> response = this.restTemplate.postForEntity(this.nonContractShipmentUrl, request,
        String.class);

    logger.info(response.getBody());

    /**
     * parse response xml to dto object
     **/
    NonContractShipmentInfo nonContractShipmentInfo = deserializeXmlStringToObject(response.getBody(),
        NonContractShipmentInfo.class);

    return nonContractShipmentInfo;
  }

  @Override
  public byte[] getArtifactAfterNonContractShipment(String getArtifactUrl, String acceptHeader)
      throws JAXBException, Exception {

    /**
     * prep for post request
     **/
    HttpHeaders headers = new HttpHeaders();
    headers.add("Accept", acceptHeader);
    headers.add("Accept-Language", "en-CA");

    HttpEntity<String> request = new HttpEntity<>(null, headers);

    /**
     * request
     **/
    ResponseEntity<byte[]> response = this.restTemplate.postForEntity(getArtifactUrl, request, byte[].class);

    /**
     * parse response xml to dto object
     **/

    return response.getBody();
  }

  @Override
  public NonContractShipmentReceipt getNonContractShipmentReceipt(String shipmentId) throws JAXBException, Exception {

    /**
     * prep for post request
     **/
    HttpHeaders headers = new HttpHeaders();
    headers.add("Accept", " application/vnd.cpc.ncshipment-v4+xml");
    headers.add("Content-Type", "application/vnd.cpc.ncshipment-v4+xml");
    headers.add("Accept-Language", "en-CA");

    HttpEntity<String> request = new HttpEntity<>(null, headers);

    /**
     * request
     **/
    ResponseEntity<String> response = this.restTemplate
        .postForEntity(this.nonContractShipmentUrl + "/" + shipmentId + "/receipt", request, String.class);

    logger.info(response.getBody());

    /**
     * parse response xml to dto object
     **/
    NonContractShipmentReceipt nonContractShipmentReceipt = deserializeXmlStringToObject(response.getBody(),
        NonContractShipmentReceipt.class);

    return nonContractShipmentReceipt;
  }

  @Override
  public NonContractShipmentRefundRequestInfo requestConContractShipmentRefund(
      NonContractShipmentRefundRequest nonContractShipmentRefundRequest, String requestRefundUrl)
      throws JAXBException, Exception {

    /**
     * issue with XmlMapper (e.g., ObjectMapper) from jackson xml library.
     *
     * don't use this otherwise, you get an error, which ignore 'xmlns' when
     * serializing so don't use it.
     *
     * instead, use JAXB.marshal.
     *
     * issue with JAXB.marshal/unmarshal.
     *
     * don't use thsi otherwise, you get an error with unmarshal function (e.g.,
     * io.FileNotFoundExeption)
     *
     * instead, use JAXBContext.
     *
     **/
    String requestBody = serializeObjectToXmlString(nonContractShipmentRefundRequest,
        NonContractShipmentRefundRequest.class);

    logger.info(requestBody);

    /**
     * prep for post request
     **/
    HttpHeaders headers = new HttpHeaders();
    headers.add("Accept", "application/vnd.cpc.ncshipment-v4+xml");
    headers.add("Content-Type", "application/vnd.cpc.ncshipment-v4+xml");
    headers.add("Accept-Language", "en-CA");

    HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

    /**
     * request
     **/
    ResponseEntity<String> response = this.restTemplate.postForEntity(requestRefundUrl, request, String.class);

    logger.info(response.getBody());

    /**
     * parse response xml to dto object
     **/
    NonContractShipmentRefundRequestInfo nonContractShipmentRefundRequestInfo = deserializeXmlStringToObject(
        response.getBody(), NonContractShipmentRefundRequestInfo.class);

    return nonContractShipmentRefundRequestInfo;
  }

  @Override
  public AuthorizedReturnInfo createAuthrizedReturn(AuthorizedReturn authorizedReturn) throws JAXBException, Exception {

    /**
     * issue with XmlMapper (e.g., ObjectMapper) from jackson xml library.
     *
     * don't use this otherwise, you get an error, which ignore 'xmlns' when
     * serializing so don't use it.
     *
     * instead, use JAXB.marshal.
     *
     * issue with JAXB.marshal/unmarshal.
     *
     * don't use thsi otherwise, you get an error with unmarshal function (e.g.,
     * io.FileNotFoundExeption)
     *
     * instead, use JAXBContext.
     *
     **/
    String requestBody = serializeObjectToXmlString(authorizedReturn, AuthorizedReturn.class);

    logger.info(requestBody);

    /**
     * prep for post request
     **/
    HttpHeaders headers = new HttpHeaders();
    headers.add("Accept", "application/vnd.cpc.authreturn-v2+xml");
    headers.add("Content-Type", "application/vnd.cpc.authreturn-v2+xml");
    headers.add("Accept-Language", "en-CA");

    HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

    /**
     * request
     **/
    ResponseEntity<String> response = this.restTemplate.postForEntity(this.authorizedReturnUrl, request, String.class);

    logger.info(response.getBody());

    /**
     * parse response xml to dto object
     **/
    AuthorizedReturnInfo authorizedReturnInfo = deserializeXmlStringToObject(response.getBody(),
        AuthorizedReturnInfo.class);

    return authorizedReturnInfo;
  }

  @Override
  public byte[] getAuthorizedReturnArtifact(String getAuthorizedReturnArtifactUrl, String acceptHeader)
      throws JAXBException, Exception {
    /**
     * prep for post request
     **/
    HttpHeaders headers = new HttpHeaders();
    headers.add("Accept", acceptHeader);
    headers.add("Accept-Language", "en-CA");

    HttpEntity<String> request = new HttpEntity<>(null, headers);

    /**
     * request
     **/
    ResponseEntity<byte[]> response = this.restTemplate.postForEntity(getAuthorizedReturnArtifactUrl, request,
        byte[].class);

    /**
     * parse response xml to dto object
     **/

    return response.getBody();
  }

  private <T> String serializeObjectToXmlString(T object, Class<T> classType) throws JAXBException {
    JAXBContext jaxbContext = JAXBContext.newInstance(classType);
    Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
    jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
    StringWriter sw = new StringWriter();
    jaxbMarshaller.marshal(object, sw);
    return sw.toString();
  }

  private <T> T deserializeXmlStringToObject(String xmlString, Class<T> classType) throws JAXBException {
    JAXBContext jaxbResponseContext = JAXBContext.newInstance(classType);
    Unmarshaller jaxbResponseUnmarshaller = jaxbResponseContext.createUnmarshaller();
    T object = (T) jaxbResponseUnmarshaller.unmarshal(new StringReader(xmlString));
    return object;
  }

}
