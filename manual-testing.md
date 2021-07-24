# Final Manual Testing For Front End

  - final testing before release.

  ## Checkout Page

    ### Customer Basic Information Section:

    - [] input validation (e.g., not empty, invalid format)
    - [] confirm validation (e.g., make sure all of inputs are filled to move to the next section)

    ### Customer Contact Information Section:

    - [] phone validation (refer to Phone Validation)
    - [] address validation (refer to Address Validation)
    - [] confirm validation (e.g., make sure primary phone, shipping address, and billing address are selected)

    ### Order Items Section:

    - [] cart item box validation (refer to Card Item Validation for each cart Item)
    - [] subtotal matches with the total price of selected cart items
    - [] the quantity change reflect to the subtotal
    - [] the selection change reflect to the subtotal
    - [] show a link to product search if there is no cart item available

    ### Final Confirm Section:

    - [] rating info is display correctly. 
    - [] edit buttons guide the user to the proper section
    - [] subtotal matches with subtotal of the order items.

    ### Payment

    - [] session time out if don't complete a payment in 5 mins
    - [] if the customer abort the session (e.g., moves to another page), reset all checkout state and the session.
    - [] when payment done regardless of the result, reset all checkout state and the session.
    - [] when payment succeeded, make sure the cart item is removed from the cart.
    - [] when payment succeeded, make sure the product variant stock is decreased by the quantity.
    


  ## Products & Variants

    - [] make sure 
    

 ## Orders

  ### Admin

    #### GridView

    - [] order pagination 
    - [] display correct & formatted data on each cell.

    #### Edit

    - [] can edit an existing order event. ('note' field only)
    - [] can delete an existing order if the one is deletable.
    
      ##### Timeline

        - [] any latest order event cannot be DRAFT/ORDERED after the checkout. (e.g., it must be either SESSION_TIMEOUT, PAYMENT_FAILED, PAID)
        - [] the admin can add/delete/update appropriate order event based on the latest order event (see app-document.md#ORDERS more detail)
        - [] only the latest order event can be deleted if the order event is undoable.

  ## Members

    - [] members can add either CANCEL_REQUEST/RETURN_REQUEST
    - [] CANCEL_REQUEST order event can be added only when the latest (previous) order event is PAID
    - [] RETURN_REQUEST order event can be added only when the latest (previous) order event is SHIPPED/DELIVERED
    - [] members cannot edit existing order events
  
  ## Users

  ## Common

    ### Sign Up
     
    - [] input validation (e.g., email, password, name and so on)
    - [] receive a verification email from the app
    - [] can verify when click the link of the verification email.
    - [] if customer click the link of the verification email when he does not log in, the app should ask him to login first, then verify.
    - [] re-verify process if the verification token expired.
    - [] can sign up with verified status.
   
    ### Login 

    - [] input validation
    - [] the max login attempt is 10
    - [] if a user exceeds the max login attemp, he has to wait in 30mins.
    - [] a user can login.

    ### Forgot & Reset Password 

    - [] input validation (e.g., email) when sending the request
    - [] the user receives the reset password email when he sends the request.
    - [] re-forgot & reset password process if the token expired
    - [] input validation (e.g., password) when sending the reeset password
    - [] can reset password.
    

    ### Phone Validation

    - [] crud operation on phone management
    - [] max 3 phone
    - [] switch primary phone 

    ### Address Validation

    - [] crud operation on address management
    - [] max 3 address
    - [] switch shipping address 
    - [] switch billing address 

    ### Cart Item Validation

    - [] the displayed price must be the 'currentPrice' of a product variant.
    - [] can delete a cart item
    - [] toggle selection.

    
