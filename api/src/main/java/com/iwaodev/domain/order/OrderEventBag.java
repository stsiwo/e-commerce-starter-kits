package com.iwaodev.domain.order;


import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import com.iwaodev.domain.user.UserTypeEnum;

public class OrderEventBag {

  public static final Map<OrderStatusEnum, OrderEventInfo> map;
  static {
        Map<OrderStatusEnum, OrderEventInfo> aMap = new HashMap<>();

        /**
         * DRAFT
         **/
        
        aMap.put(OrderStatusEnum.DRAFT, new OrderEventInfo(
              Arrays.asList(UserTypeEnum.ANONYMOUS, UserTypeEnum.MEMBER), 
              Arrays.asList(OrderStatusEnum.ORDERED, OrderStatusEnum.SESSION_TIMEOUT, OrderStatusEnum.ERROR),
              Arrays.asList()
              ));

        /**
         * SESSION_TIMEOUT
         **/
        
        aMap.put(OrderStatusEnum.SESSION_TIMEOUT, new OrderEventInfo(
              Arrays.asList(UserTypeEnum.ANONYMOUS, UserTypeEnum.MEMBER), 
              Arrays.asList(OrderStatusEnum.ERROR),
              Arrays.asList()
              ));

        /**
         * ORDERED
         **/
        
        aMap.put(OrderStatusEnum.ORDERED, new OrderEventInfo(
              Arrays.asList(UserTypeEnum.ANONYMOUS, UserTypeEnum.MEMBER), 
              Arrays.asList(OrderStatusEnum.PAYMENT_FAILED, OrderStatusEnum.PAID, OrderStatusEnum.ERROR),
              Arrays.asList()
              ));

        /**
         * PAYMENT_FAILED
         **/
        
        aMap.put(OrderStatusEnum.PAYMENT_FAILED, new OrderEventInfo(
              Arrays.asList(UserTypeEnum.ANONYMOUS, UserTypeEnum.MEMBER), 
              Arrays.asList(OrderStatusEnum.ERROR),
              Arrays.asList()
              ));

        /**
         * PAID
         **/
        
        aMap.put(OrderStatusEnum.PAID, new OrderEventInfo(
              Arrays.asList(UserTypeEnum.ANONYMOUS, UserTypeEnum.MEMBER), 
              Arrays.asList(OrderStatusEnum.SHIPPED, OrderStatusEnum.CANCEL_REQUEST, OrderStatusEnum.ERROR),
              Arrays.asList(OrderStatusEnum.CANCEL_REQUEST)
              ));

        /**
         * CANCEL_REQUEST
         **/
        
        aMap.put(OrderStatusEnum.CANCEL_REQUEST, new OrderEventInfo(
              Arrays.asList(UserTypeEnum.MEMBER, UserTypeEnum.ADMIN), 
              Arrays.asList(OrderStatusEnum.RECEIVED_CANCEL_REQUEST, OrderStatusEnum.ERROR),
              Arrays.asList()
              ));

        /**
         * RECEIVED_CANCEL_REQUEST
         **/
        
        aMap.put(OrderStatusEnum.RECEIVED_CANCEL_REQUEST, new OrderEventInfo(
              Arrays.asList(UserTypeEnum.ADMIN), 
              Arrays.asList(OrderStatusEnum.CANCELED, OrderStatusEnum.ERROR),
              Arrays.asList()
              ));

        /**
         * CANCELED
         **/
        
        aMap.put(OrderStatusEnum.CANCELED, new OrderEventInfo(
              Arrays.asList(UserTypeEnum.ADMIN), 
              Arrays.asList(OrderStatusEnum.ERROR),
              Arrays.asList()
              ));

        /**
         * SHIPPED
         **/
        
        aMap.put(OrderStatusEnum.SHIPPED, new OrderEventInfo(
              Arrays.asList(UserTypeEnum.ADMIN), 
              Arrays.asList(OrderStatusEnum.DELIVERED, OrderStatusEnum.RETURN_REQUEST, OrderStatusEnum.ERROR),
              Arrays.asList(OrderStatusEnum.RETURN_REQUEST)
              ));

        /**
         * RETURN_REQUEST
         **/
        
        aMap.put(OrderStatusEnum.RETURN_REQUEST, new OrderEventInfo(
              Arrays.asList(UserTypeEnum.MEMBER, UserTypeEnum.ADMIN), 
              Arrays.asList(OrderStatusEnum.RECEIVED_RETURN_REQUEST, OrderStatusEnum.ERROR),
              Arrays.asList()
              ));

        /**
         * RECEIVED_RETURN_REQUEST
         **/
        
        aMap.put(OrderStatusEnum.RECEIVED_RETURN_REQUEST, new OrderEventInfo(
              Arrays.asList(UserTypeEnum.ADMIN), 
              Arrays.asList(OrderStatusEnum.RETURNED, OrderStatusEnum.ERROR),
              Arrays.asList()
              ));

        /**
         * RETURNED 
         **/
        
        aMap.put(OrderStatusEnum.RETURNED, new OrderEventInfo(
              Arrays.asList(UserTypeEnum.ADMIN), 
              Arrays.asList(OrderStatusEnum.ERROR),
              Arrays.asList()
              ));

        /**
         * DELIVERED 
         **/
        
        aMap.put(OrderStatusEnum.DELIVERED, new OrderEventInfo(
              Arrays.asList(UserTypeEnum.ADMIN), 
              Arrays.asList(OrderStatusEnum.RETURN_REQUEST, OrderStatusEnum.ERROR),
              Arrays.asList(OrderStatusEnum.RETURN_REQUEST)
              ));

        /**
         * ERROR 
         **/
        
        aMap.put(OrderStatusEnum.ERROR, new OrderEventInfo(
              Arrays.asList(UserTypeEnum.ADMIN), 
              Arrays.asList(),
              Arrays.asList()
              ));


        map = Collections.unmodifiableMap(aMap);
    }
}
