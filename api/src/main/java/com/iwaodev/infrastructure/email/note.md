# Email Logic

  ## Generals

    - always BCC to admin personal email address for copy and backup.
    - main email adress: contact@domain.com
    - when an email is sent from app, use 'no-reply@domain.com' always if users need inquery ask them to use 'contact@domain.com'
      - but in order to send email from 'no-reply@domain', you need to use aws SES and open the limit to send the notification to the customer.

  ## When to Send Email

    - user signup & email verification email (these are together): done
    - forgot-password email: done
    - order completed email for customer: done 
    - new order was placed email for admin: done
    - order shipped email for customer: done
    - order cancel request email for admin: done
    - order return request email for admin:  done
    - order cancel request received email for customer: done
    - order return request received email for customer: done
    - order canceled email (refund) for customer: done
    - order returned email (refund) for customer: done
    - please review email (after delivery) for customer: done
    - review udated email (after delivery) for admin: done


  ## Note
    - (guest)
      - the admin contact via contact@domain.com directly. and the admin need to update the order status.
      - e.g.,) if the guest customer wants to cancel the order, the admin must add 'cancel_request' on behalf of the guest user since all guest user cannot access order management console.
    - (member)
      - the member can user order management or contact via contact@domain.com
      - if the member forget to update athe status, the admin can do that on behalf of the member.
  
