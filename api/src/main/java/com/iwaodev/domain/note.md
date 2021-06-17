# Domain Validation Rules

## Category

  - not null
    - id
    - name
    - description
    - path

  - categoryName must be unique. -> useRepository
  - categoryPath must be unique. -> useRepository

## Notification

  - not null
   - id
   - title
   - description
   - issuer (if it is not guest)
   - recipient (since this is either admin/member)
   - isRead
   - notificationType

  - issuer and recipient must follow the its type. (done)

## Order

  - not null.
    - id
    - orderNumber
    - orderFirstName
    - orderLastName
    - orderEmail
    - orderPhone
    - stripePaymentIntentId
    - currency
    - shippingAddress 
    - billingAddress

  - orderEvents > 0
  - user must be null if guest
  - use must be not null if member
  - orderDetails > 0
  - note can be modified by only admin

  - status must be addable as next event (see Order domain to know which event is when addable.)
    -> do i need to validate this?  
  - undoable must depends on the event.
    -> do i need to vali

## OrderDetail

  - not null.
    - id
    - pruductQuantity
    - productUnitPrice
    - productColor
    - productSize
    - productName
    - order
    - productVariant (when creating but if the product is deleted later, this can be null)
    - product (when creating but if the product is deleted later, this can be null)
    - createdAt (delegate this to hibernate so skip this validation)

  - quantity must be >= 1
  - price must be >= 1

## OrderEvent

  - not null
    - id
    - undoable (if this event is deletable by admin)
    - status
    - createdAt (delegate this to hibernate so skip this validation)
    - order
    - user (if it is member/admin. if it is guest, it is null)
    

## Product

  - not null
    - id
    - name
    - description
    - path 
    - baseUnitPrice
    - public
    - category
    - releaseDate 
    - productImages (the 1st primary image must exist)

  - public can be true only if the product has variant at least one and releaseDate passed.
  - price must be greater than or equal $1
  - path must be unqiue --> use repository 
  - if isDiscount = true
    - discount price is not null
    - disount start date and before end date.

## ProductVariant

  - not null
    - id
    - stock
    - color 
    - size
    - weight (default 0.5 kg)
    - height (default 5 cm)
    - length (default 5 cm)
    - width (default 5 cm)

  - stock >= 0 
  - if isDiscount = true
    - discount price is not null
    - disount start date and before end date.
  - color & size combination must be unique  -> use repository

  // price logic (no relation to validation)

  - if unit price is null, the variant price is the price of the product (baseunitprice)
  - if the variant has unit price, the variant price the price.
  - price precedence (if all prices are set):
    1. variant discount price
    2. product discount price
    3. variant unit price
    4. product unit price 

## User

  not null:
    - id 
    - firstName
    - lastName
    - email
    - password
    - userType
    - active

  - password must follow:
    - at least 8 chars 
    - must include lower/upper case 
    - no space (leading/trailing/middle)

  -  address country
    - must be 2 chars
    - currently only support domestic (canada only)

  - email unique

  - and address & phone validation (see its criteria class)

  - max phone & address number is 3

## CartItem (Member Only)

  - not null
    - id
    - user 
    - variant
    - isSelected
    - quantity

  - The quantity must be greater than or equal 1
  - max cartItems = 5

## Wishlist (Member Only)

  - not null
    - id
    - user
    - variant

## Review 

  - not null
    - id
    - point
    - title
    - description
    - isVerified
    - note (only admin can do crud)

  - 0 <= review jpoint <= 5
  - admin can turn isVerified true. 
  - note can be modified by only admin

## Company

  - see criteria and follow the validation

## Note

  ## How to Validate Uniqueness with DB

    - there is no pre-defined way (e.g., annotation) to validate this.
    - you need to create function with the repository and check it already exist or not.

    -> workaround: use repository (autowired) and check the uniqueness.

  ## How to Validate Auto-Increment Id

    - we don't have an id before persist. esp creating.

    -> workaround: use 'validateWhenUpdate' to make sure it has id.

# Email Implementation

  ## When to Send Email

    - user signup email.
    - forgot-password email.
    - email verification email.
    - order completed email.
      - (guest)
        - the admin contact via contact@domain.com directly. and the admin need to update the order status.
        - e.g.,) if the guest customer wants to cancel the order, the admin must add 'cancel_request' on behalf of the guest user since all guest user cannot access order management console.
      - (member)
        - the member can user order management or contact via contact@domain.com
        - if the member forget to update athe status, the admin can do that on behalf of the member.

    - order shipped email
    - order cancel request received email
    - order return request received email
    - order canceled email (refund)
    - order returned email (refund)
    - please review email (after delivery)


  
