# Documentation of This Web Ecommerce App


## Preparation

  - the admin is required for the following configuration in order to use this app:

    1. create an account for Canada Post Developer Program and register for Small Business Program.
      - currently, test api key is enough to send request to Canada Post API since we only use rating.
    2. create an account for Stripe to handle payment.

    3. aws setup.
      - route53 
        - register and create a new domain.
      - ec2
        -  
      - ses
        - get out of sandbox to send email to anymous users 

    4. create an email with the domain you registered with aws

## Policies

  - refund policy:

      - 30 days after the delivery

  - supported countries:

      - domestic only (currently)

## Security

  ### Login Attempt 

    - the max number of login attempt is 10, and if exceeding this number, the user cannot login in 30mins.

  ### Payment


## Payment

  - we integrate Stripe as our payment system.

  - this app automatically manage payment and refund.

    - payment: when a customer purchase items, the payment is done via this app.

    - refund: when a customer want to cancel/return the items, they can send cancel/return reuquest to the admin. then the admin can decide the refund.

  ### Security

    - we try to implement more secure payment flow by following:
       1. enable Address Verfication (AVS) e.g, require customers to enter the postal code and the transaction is declined if the postal code does not match with the file.
        - this feature depends on the country where it is supported or not.

        - A payment can still be successful even if the CVC or postal code check fails. This is because card issuers take many signals into account when making a decision about whether to approve or decline a payment. In some cases, a card issuer may still approve a payment they consider legitimate, even if the CVC or postal code verification check fails.

      2. not explicitly block the card from outside Canada.

        - TODO: might need to fix this. what about the customer who owns a credit card issued in a foreign country, brings it to Canada? we should not accept this card as payment method since postal code is different unless he change the postal code of the card.
          - you might need to enable country field in billing address to solve this issue.

  ### Dispute

    - basic: https://stripe.com/docs/disputes#refunding-disputed-payments
    - read this: https://stripe.com/docs/disputes/responding

## Users

  ### User Active Status

     - you can freely change the status of any member.

     - the types are following:

       - Temporaly: a member who signed up but does not verify the email.
       - Active: a member who signed up and verified with the email.
       - Blacklist: a member who did suspicious behaviors. this member cannot login unless the admin chagnes the status to another one.
       - Deleted By Customer: a member who requests for the deletion of membership.

  ## User Type

    - ADMIN: the admin of this web app.
    - MEMBER: a customer who signs up this web app.
    - GUEST: a customer without any membership.

  ## Email Verification

    - we ask each member to verify its email address by sending the verification email.

    - the reason is to improve security and avoid degrade email sending reputation. However, the temporaly user can login, buy, and do the same thing as an active user. so this verification is optional.

  ## Deletion Request From A Member

    - any member can request for the deletion of his/her membership, but this is a temporary deletion. The admin must delete the account permanently.

      - the member cannot create an account with the email used to create the account before until the admin permanently deletes the account.

      - the member can restore the account if they want, but they need to contact with the admin and ask for restoration and must be before the admin delete the account permanently.

## Categories

  - a category name and path must be unique for each category.

  - if you want to remove a category, the category cannot have any product belonging to the category. In order to remove the category, you need to change the category of thoes products first.

## Products

  - product name and path must be unique for each product.

  - the max product price: $10000.00 (need to set the max in order to calculate the cheapest price of this product)

  - to publish your product, there are two conditions:
    1. release date must be after or equal to today.
    2. the product must have at least one product.

  - recommended product image size:
    - 800x800 is enough.
    - you don't need to put a huge image. it makes performance worse.

  ### Product Size

    - available product sizes:

      1. XS
      2. S
      3. M
      4. L
      5. XL

    - these sizes are just simple standard. if you need more accurate product size, use description or note with the product sizes.
      - e.g., XS: 10cm, S: 20cm and so on.

  ### Product Variant

    - a product is able to have as many variant (e.g., different color and size) as you like.

    - weight, length, width, and height are used for calculating shipping info (e.g., rating).

      - weight >= 0.01 kg
      - length >= 1 cm
      - width >= 1 cm
      - height >= 1 cm

  ### Product Price

    - the price must be >= 1.0

    - there are three types of the price:

      1. product base unit price: 
        - mandatory 
        - if you don't specify the product variant unit price for its variant, this base unit price is applied for the variant price.
      2. product variant unit price:
        - optional
        - if you specify the price, this is the price of the variant.
      3. product variant discount price: 
        - optional
        - if you enable the discount of a variant, you need to specify the discount price and its start and end date. the discount price is the price of the variant during the date.
        - the discount price must be cheaper than the price of the base unit price/variant unit price.

     e.g., 
        Product A
          - base unit price: $10.00
        Product Variant A_1
          - no variant unit price => this variant price is $10.00
        Product Variant A_2
          - variant unit price: $20.00 => this variant price is $20.00
        Product Variant A_3
          - variant unit price: $30.00 
          - disount price: $25.00 => this variant price is $25.00 during the discount period.


  ### Discount

    - a product variant can be discount if the following conditions are met:
      1. discount checkbox is checked.
      2. the current date is during the discount start date and end date (inclusive).
      
        ex)
          start date: 2021/07/17 
          end date: 2021/07/17
            => discount is available only 2021/07/17 

        ex)
          start date: 2021/07/17
          end date: 2021/07/20
            => discount is available during 2021/07/17 ~ 2021/07/20 (not 2021/07/16 and 2021/07/21)
## Shipping

  - the current version of this app does not fully support shipping feature. We only support the following features:

    1. calculate estimated shipping cost and delivery date based on the weight of the product.
      - this price is approximate so not precise.
      - if we add length/width/height to the calculation but if customers buy mutliple items, it is impossible to get the proper length/widht/height so we decided not to include those criteria.
      - we use Canada Post as a main postal service.
      - currently, we only estimate shipping cost and develiry date with 'regular parcel' without any options (e.g., no express or any other options).

  - the amdin is responsible for taking care of shipping.
    - packing the items
    - bring the items to Canada Post
    - issue the return label (if the admin want)
    - pay the fee
    - keep track of the delivery (also, update the order event (e.g., add 'DELIVERED') at admin page.)

## Orders

  ### Order Events

    - when guest user wants to do something (e.g., return/cancel the order), the admin communicate with them via email.
      - the admin is responsible to update the order status at the admin page (e.g., add cancel_request order event and so on)
    - when member uesr wants to do soemthing (e.g. return/cancel the order), the admin communicate with them via email/order management page.

    - type of order events:

      - DRAFT : created when a customer did the final confirm (e.g., create a payment intent in Stripe and the session start at front-end), 
        - addable by MEMBER/GUEST
        - next order event by ADMIN: ERROR
        - next order event by GUEST/MEMBER: none
        - undoable: false (e.g., cannot delete it)

        * note: this order event is automatically added by the app but display the specific user type (customer/amdin) on the screen.

      - SESSION_TIMEOUT : created when a customer's session is time out.
        - addable by MEMBER/GUEST
        - next order event by ADMIN: , ERROR
        - next order event by GUEST/MEMBER: none
        - undoable: false (e.g., cannot delete it)

        * note: this order event is automatically added by the app but display the specific user type (customer/amdin) on the screen.

      - ORDERED : created when a customer ordered successfully.
        - addable by MEMBER/GUEST
        - next order event by ADMIN: , ERROR
        - next order event by GUEST/MEMBER: none
        - undoable: false (e.g., cannot delete it)

        * note: this order event is automatically added by the app but display the specific user type (customer/amdin) on the screen.

      - PAYMENT_FAILED : created when a customer failed to pay.
        - addable by MEMBER/GUEST
        - next order event by ADMIN: , ERROR
        - next order event by GUEST/MEMBER: none
        - undoable: false (e.g., cannot delete it)

        * note: this order event is automatically added by the app but display the specific user type (customer/amdin) on the screen.

      - PAID : created when a customer ordered paid successfully.
        - addable by MEMBER/GUEST
        - next order event by ADMIN: SHIPPED, CANCEL_REQUEST, ERROR
        - next order event by GUEST/MEMBER: CALCEL_REQUEST 
        - undoable: false (e.g., cannot delete it)

        * note: this order event is automatically added by the app but display the specific user type (customer/amdin) on the screen.

      - CANCEL_REQUEST : created when a customer sent a cancel request. 
        - addable by MEMBER/ADMIN
        - next order event by ADMIN: RECEIVED_CANCEL_REQUEST, ERROR
        - next order event by GUEST/MEMBER: NONE
        - undoable: true (e.g., cannot delete it)

      - RECEIVED_CANCEL_REQUEST : created when the admin confirmed the cancel request.
        - addable by ADMIN
        - next order event by ADMIN: CANCELED, ERROR
        - next order event by GUEST/MEMBER: NONE
        - undoable: true (e.g., cannot delete it)

      - CANCELED : created when the admin canceled the order (e.g, refund).
        - addable by ADMIN
        - next order event by ADMIN: ERROR
        - next order event by GUEST/MEMBER: NONE
        - undoable: false (e.g., cannot delete it)

      - SHIPPED: created when the admin shipped the package.
        - addable by ADMIN
        - next order event by ADMIN: DELIVERED, RETURN_REQUEST, ERROR
        - next order event by GUEST/MEMBER: RETURN_REQUEST
        - undoable: true (e.g., cannot delete it)

      - RETURN_REQUEST: created when a customer sent a return request.
        - addable by MEMBER/ADMIN
        - next order event by ADMIN: RECEIVED_RETURN_REQUEST, ERROR
        - next order event by GUEST/MEMBER: none 
        - undoable: true (e.g., cannot delete it)


      - RECEIVED_RETURN_REQUEST: created when the admin confirmed the return request.
        - addable by ADMIN
        - next order event by ADMIN: RETURNED, ERROR
        - next order event by GUEST/MEMBER: none 
        - undoable: true (e.g., cannot delete it)

      - RETURNED: created when the admin confirmed the return request.
        - addable by ADMIN
        - next order event by ADMIN: ERROR
        - next order event by GUEST/MEMBER: none 
        - undoable: false (e.g., cannot delete it)

      - DELIVERED: created when the package is delivered.
        - addable by ADMIN
        - next order event by ADMIN: RETURN_REQUEST, ERROR
        - next order event by GUEST/MEMBER: RETURN_REQUEST 
        - undoable: true (e.g., cannot delete it)

      - ERROR: created when the admin add error on the order. 
        - addable by ADMIN
        - next order event by ADMIN: none 
        - next order event by GUEST/MEMBER none:
        - undoable: true (e.g., cannot delete it)


    - the admin can add any order events except for draft, ordered, and paid, but the order is matter. for example, you cannot add paid order event before shipping.

    - the member can only add either return/cancel requests.
      - the cancel request is only addable before shipping and after paid.
      - the return request is only addable after shipping.

      * if the user is not eligible to refund policy, the user cannot return the item.

  ### Return & Cancel Steps

    - when customers want to canel/return the item, here is typical steps that the admin should follow:

      - cancellation:

        * this should happen before the admin ship the order. Otherwise, it should be returned.
        1. the guest/member users submit a cancel request via email or the order managment page.
        2. the admin update order event (e.g., add the event called 'received_cancel_request' to give the customer your confirmation.
        3. then, the admin update order event (e.g., add the event called 'canceled'). this will cancel the payment and refund the payment to the customer.
          - this event is undoable (e.g., if you cancel the order, you cannot cancel the cancellation). 
        4. finally, the customer receive the refund processed by Stripe.

      - return:

        * this should happen after the admin ship the order. Otherwise, it should be cannceled.
        1. the guest/member users submit a return request via email or the order managment page.
        2. the admin update order event (e.g., add the event called 'received_return_request' to give the customer your confirmation.
        3. the admin send an email to ask the customer to return the package with the return label if you would like to receive the package back.
        3. after you received the package, the admin update order event (e.g., add the event called 'returned'). this will cancel the payment and refund the payment to the customer.
          - this event is undoable (e.g., if you cancel the order, you cannot cancel the cancellation). 
        4. finally, the customer receive the refund processed by Stripe.

## Email 

  - we will send an email to the appropriate user when the following events happens:

    - orders

      - to admin

        - when a new order was placed by a customer.
        - when a customer submit a cancel request.
        - when a customer submit a return request.

      - to customers

        - when a new order was placed by the customer as conformation.
        - when the admin shipped items. 
        - when the admin confirms a cancel request.
        - when the admin canceled an order.
        - when the admin confirms a return request.
        - when the admin returned an order.
    
    - reviews
      
      - to admin

        - when a member submit/update a review.
  
      - to customers

        - when the admin verified a review.

    - members

      - to memebrs

        - when a member request re-issue a verification email.
        - when a member request a forgot-password email.

  - additinally, our payment system (e.g., Stripe) automatically send an email when the following events:

    - to customers

      - when a payment was succeeded. it contains a receipt.
      - when a payment was refund. it contains a recipt.

  - the admin receives an email to the following email addresses:

    - basic email address.
    - company email address.
    

## Notifications

  - we will send a notification to the approprite user when the following events happens:

## Reviews

  - when the items was delivered successfully, the customer (only member) can submit the review about the product they bought.

    - the app automatically send an email to ask them to write a review.
    - every time the customer create/update a review, the admin must verify the review to be published.

## Cart Items

  - you can keep product variants in your cart to buy it.

  - max number of cart items is 5.
  - max number of quantity of a cart item is 10.
  
## Admin

  - 

    
