package com.iwaodev.application.iservice;

import java.util.UUID;

import com.iwaodev.ui.criteria.contact.ContactCriteria;


public interface ContactService {

  public void submit(ContactCriteria criteria, UUID userId) throws Exception;
}


