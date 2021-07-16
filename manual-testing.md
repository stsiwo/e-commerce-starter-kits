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


    
  


  ## Common

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

    
