package com.iwaodev.domain.order;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.iwaodev.domain.user.UserTypeEnum;

import lombok.Data;

/**
 * used as a type for a value of OrderEventBag.
 *
 **/
@Data
public class OrderEventInfo {

  List<UserTypeEnum> addableBy = new ArrayList<>();

  List<OrderStatusEnum> nextAddableEventsForAdmin = new ArrayList<>();

  List<OrderStatusEnum> nextAddableEventsForMember = new ArrayList<>();

  Boolean isUndoable;

  public OrderEventInfo(List<UserTypeEnum> addableBy, List<OrderStatusEnum> nextAddableEventsForAdmin, List<OrderStatusEnum> nextAddableEventsForMember, Boolean isUndoable) {
    this.addableBy = addableBy;
    this.nextAddableEventsForAdmin = nextAddableEventsForAdmin;
    this.nextAddableEventsForMember = nextAddableEventsForMember;
    this.isUndoable = isUndoable;
  }

  public String addableByToString() {
    return this.addableBy.stream().map(Object::toString).collect(Collectors.joining(", ")); 
  }
}
