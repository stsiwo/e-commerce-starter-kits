package com.iwaodev.application.mapper;

import com.iwaodev.application.dto.order.OrderDTO;
import com.iwaodev.application.dto.order.OrderEventDTO;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.OrderAddress;
import com.iwaodev.infrastructure.model.OrderEvent;
import com.iwaodev.ui.criteria.order.OrderAddressCriteria;
import com.iwaodev.ui.criteria.order.OrderCriteria;
import com.iwaodev.ui.criteria.order.OrderEventCriteria;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface OrderMapper {

  OrderMapper INSTANCE = Mappers.getMapper( OrderMapper.class );

  // does not solve the circular dependencies. it gives me a hint which one is circular dependency.
  //ProductDTO toProductDTO(Product product, @Context CycleAvoidingMappingContext context);
  
  //OrderDTO toOrderAddressDTO(Order order); ?? what is OrderAddress??
  OrderDTO toOrderDTO(Order order);

  OrderEventDTO toOrderEventDTO(OrderEvent orderEvent);

  @Mapping(target = "user", ignore = true)
  @Mapping(target = "orderEvents", ignore = true)
  @Mapping(target = "orderDetails", ignore = true)
  Order toOrderEntityFromOrderCriteria(OrderCriteria criteria);

  OrderEvent toOrderEventEntityfromOrderEventCriteria(OrderEventCriteria criteria);

  /**
   * issue: order address id is not assigned to the order entity.
   *
   * reason: might be that it uses unidirectional relationship. 
   *
   *  - I have to unidrectional rather than bidirectioinal since two property from order address entity are assigned to the order entity and i don't know how to make this bidirectional.
   *
   *  - when using bidirectional, it works find (e.g., product & product variant are work find). 
   *
   *  - for now, just explicitly assign the relationship rather than delegating to this mapping.
   * 
   *
   **/
  //OrderAddress toOrderAddressEntityFromOrderAddressCriteria(OrderAddressCriteria criteria);

}

