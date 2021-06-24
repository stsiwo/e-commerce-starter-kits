package com.iwaodev.application.event.order;

import java.math.BigDecimal;
import java.util.Optional;

import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.PaymentService;
import com.iwaodev.domain.order.event.CompletedOrderPaymentEvent;
import com.iwaodev.exception.InvalidUserTypeException;
import com.iwaodev.exception.NotFoundException;
import com.iwaodev.infrastructure.model.Address;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.DeliverySpecType;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.DestinationAddressDetailsType;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.DestinationType;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.DomesticAddressDetailsType;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.NonContractShipment;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.NotificationType;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.OptionType;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.ParcelCharacteristicsType;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.PreferencesType;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.ReferencesType;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.SenderType;
import com.iwaodev.infrastructure.shipping.schema.ncshipment.ParcelCharacteristicsType.Dimensions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionalEventListener;
import com.iwaodev.exception.AppException;
/**
 * shipment integration will be integrated at next version.
 *
 **/
//@Service
//public class MakeNonContractShipment {
//
//  private static final Logger logger = LoggerFactory.getLogger(MakeNonContractShipment.class);
//
//  private OrderRepository orderRepository;
//
//  private UserRepository userRepository;
//
//  private PaymentService paymentService;
//
//  @Autowired
//  public MakeNonContractShipment(OrderRepository orderRepository, UserRepository userRepository,
//      PaymentService paymentService) {
//    this.orderRepository = orderRepository;
//    this.userRepository = userRepository;
//    this.paymentService = paymentService;
//  }
//
//  /**
//   * @TransactionalEventListener.
//   *
//   * this allows this handler to be bound to the transaction where the event is
//   * dispatched.
//   *
//   * ends up a single transaction.
//   *
//   * make sure the class/method which is calling this handler also
//   * has @Transactional.
//   *
//   **/
//  @TransactionalEventListener
//  public void handleAddSoldCountEventHandler(CompletedOrderPaymentEvent event) {
//    logger.info("start handleAddSoldCountEventHandler");
//    logger.info(Thread.currentThread().getName());
//
//    /**
//     * make shipment api call (e.g., Canada Post) to create non contract shipment
//     * after payment succeeded.
//     *
//     **/
//
//    /**
//     * prepare request body.
//     * 
//     **/
//    Optional<User> adminOption = this.userRepository.getAdmin();
//    if (adminOption.isEmpty()) {
//      // product not found so return error
//      logger.info("the admin user does not exist.");
//      throw new AppException(HttpStatus.NOT_FOUND, "the admin user does not exist.");
//    }
//
//    User admin = adminOption.get();
//    Order order = event.getOrder();
//
//    try {
//      Address adminSenderAddress = admin.getSenderAddressOfAdmin();
//    } catch (NotFoundException e) {
//      throw new AppException(HttpStatus.NOT_FOUND, e.getMessage());
//    } catch (InvalidUserTypeException e) {
//      throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
//    }
//
//    // main element
//    NonContractShipment shipment = new NonContractShipment();
//
//    // sender
//    DomesticAddressDetailsType senderAddress = new DomesticAddressDetailsType();
//    senderAddress.setAddressLine1(adminSenderAddress.getAddress1());
//    senderAddress.setAddressLine2(adminSenderAddress.getAddress2());
//    senderAddress.setCity(adminSenderAddress.getCity());
//    senderAddress.setProvState(adminSenderAddress.getProvince());
//    senderAddress.setPostalZipCode(adminSenderAddress.getPostalCode());
//
//    SenderType sender = new SenderType();
//    sender.setName(admin.getFirstName() + " " + admin.getLastName());
//    sender.setCompany(admin.getCompanyName());
//    sender.setContactPhone(admin.getSelectedPhoneNumberWithCountryCode());
//    sender.setAddressDetails(senderAddress);
//
//    // receiver
//    DestinationAddressDetailsType destinationAddress = new DestinationAddressDetailsType();
//    destinationAddress.setAddressLine1(order.getShippingAddress().getAddress1());
//    destinationAddress.setAddressLine2(order.getShippingAddress().getAddress2());
//    destinationAddress.setCity(order.getShippingAddress().getCity());
//    destinationAddress.setProvState(order.getShippingAddress().getProvince());
//    destinationAddress.setCountryCode(order.getShippingAddress().getCountry());
//    destinationAddress.setPostalZipCode(order.getShippingAddress().getPostalCode());
//
//    DestinationType destination = new DestinationType();
//    destination.setName(order.getOrderFirstName() + " " + order.getOrderLastName());
//    destination.setAddressDetails(destinationAddress);
//
//    OptionType option1 = new OptionType();
//    option1.setOptionCode("DC"); // make sure what is default option
//
//    DeliverySpecType.Options options = new DeliverySpecType.Options();
//    options.getOptions().add(option1);
//
//    Dimensions parcelDimension = new Dimensions();
//    parcelDimension.setHeight();
//    parcelDimension.setLength();
//    parcelDimension.setWidth();
//
//    ParcelCharacteristicsType characteristics = new ParcelCharacteristicsType();
//    characteristics.setWeight(new BigDecimal(5));
//    characteristics.setDimensions(parcelDimension);
//
//    NotificationType notification = new NotificationType();
//    ;
//    notification.setEmail("ryuko.saito@kubere.com");
//    notification.setOnDelivery(true);
//    notification.setOnException(false);
//    notification.setOnShipment(true);
//
//    PreferencesType preferences = new PreferencesType();
//    preferences.setShowInsuredValue(true);
//    preferences.setShowPackingInstructions(false);
//    preferences.setShowPostageRate(true);
//
//    ReferencesType references = new ReferencesType();
//    references.setCostCentre("costCentre");
//    references.setCustomerRef1("custRef1");
//    references.setCustomerRef2("custRef2");
//
//    DeliverySpecType deliverySpec = new DeliverySpecType();
//    deliverySpec.setServiceCode("DOM.EP");
//    deliverySpec.setSender(sender);
//    deliverySpec.setDestination(destination);
//    deliverySpec.setOptions(options);
//    deliverySpec.setParcelCharacteristics(characteristics);
//    deliverySpec.setNotification(notification);
//    deliverySpec.setPreferences(preferences);
//    deliverySpec.setReferences(references);
//
//    shipment.setRequestedShippingPoint("K1K1K1");
//    shipment.setDeliverySpec(deliverySpec);
//
//  }
//}
