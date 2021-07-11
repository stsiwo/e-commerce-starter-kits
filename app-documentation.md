# Documentation of This Web Ecommerce App


## Policies

  - refund policy:

      - 30 days after the delivery

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

  ### Product Price

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

## Shipping

  - the current version of this app does not fully support shipping feature. We only support the following features:

    1. calculate estimated shipping cost and delivery date based on the weight of the product.
      - this price is approximate so not precise.
      - if we add length/width/height to the calculation but if customers buy mutliple items, it is impossible to get the proper length/widht/height so we decided not to include those criteria.

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
      - <put_list_of_order_event_here>

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


## Reviews

  - when the items was delivered successfully, the customer (only member) can submit the review about the product they bought.

    - the app automatically send an email to ask them to write a review.
    - every time the customer create/update a review, the admin must verify the review to be published.
  
## Admin

  - 

    
