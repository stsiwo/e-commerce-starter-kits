package com.iwaodev.infrastructure.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.iwaodev.domain.user.UserActiveEnum;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@Entity(name = "users")
public class User {

  private static final Logger logger = LoggerFactory.getLogger(User.class);
  @Id
  @Column(name = "user_id")
  @GeneratedValue
  @Type(type = "uuid-char")
  private UUID userId;

  @Column(name = "first_name")
  private String firstName;

  @Column(name = "last_name")
  private String lastName;

  @Column(name = "email")
  private String email;

  @Column(name = "password")
  /**
   * use Spring Security instead
   *
   * @ColumnTransformer( read = "AES_DECRYPT( password , 'secret')", write =
   * "AES_ENCRYPT( ?, 'secret' )" )
   **/
  private String password;

  @Column(name = "avatar_image_path")
  private String avatarImagePath;

  @Column(name = "is_deleted")
  private Boolean isDeleted;

  @Column(name = "deleted_account_date")
  private LocalDateTime deletedAccountDate;

  @Column(name = "deleted_account_reason")
  private String deletedAccountReason;

  @ManyToOne
  @JoinColumn(name = "user_type_id", foreignKey = @ForeignKey(name = "FK_users__user_types"), insertable = true, updatable = false)
  private UserType userType;

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @Column(name = "stripe_customer_id")
  private String stripeCustomerId;

  @Enumerated(EnumType.STRING)
  @Column(name = "active")
  private UserActiveEnum active;

  @Column(name = "verification_token")
  private String verificationToken;

  @Column(name = "verification_token_expiry_date")
  private LocalDateTime verificationTokenExpiryDate;

  @Column(name = "forgot_password_token")
  private String forgotPasswordToken;

  @Column(name = "forgot_password_token_expiry_date")
  private LocalDateTime forgotPasswordTokenExpiryDate;

  // ignore this setter since need to customize for bidirectional relationship
  @Setter( value = AccessLevel.NONE)
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Phone> phones = new ArrayList<>();

  // ignore this setter since need to customize for bidirectional relationship
  @Setter( value = AccessLevel.NONE)
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Address> addresses = new ArrayList<>();

  // ignore this setter since need to customize for bidirectional relationship
  @Setter( value = AccessLevel.NONE)
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Company> companies = new ArrayList<>();

  /**
   * the value of mappedBy is variable name of the other one
   * 
   * - ex) users: a variable name which must exist in User class
   **/

  // ignore this setter since need to customize for bidirectional relationship
  @Setter( value = AccessLevel.NONE)
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = false)
  private List<Review> reviews = new ArrayList<>();

  // ignore this setter since need to customize for bidirectional relationship
  @Setter( value = AccessLevel.NONE)
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<CartItem> cartItems = new ArrayList<>();

  // ignore this setter since need to customize for bidirectional relationship
  @Setter( value = AccessLevel.NONE)
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<WishlistItem> wishlistItems = new ArrayList<>();

  // ignore this setter since need to customize for bidirectional relationship
  @Setter( value = AccessLevel.NONE)
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = false)
  private List<Order> orders = new ArrayList<>();

  // ignore this setter since need to customize for bidirectional relationship
  @Setter( value = AccessLevel.NONE)
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = false)
  private List<OrderEvent> orderEvents = new ArrayList<>();

  // constructor
  public User(String firstName, String lastName, String email, String password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }

  public Phone findPhone(Long phoneId) {
    return this.phones.stream().filter(phone -> {
      return phone.getPhoneId().equals(phoneId);
    }).findFirst().get();
  }

  public Phone getLastestPhone() {
    return this.phones.get(this.phones.size() - 1);
  }

  public void setPhones(List<Phone> phones) {
    this.phones = phones;

    // need this to make reverse relationship (from phone to user)
    // otherwise, 'user_id' on Phone table is not assigned and you got error.
    for (Phone phone : phones) {
      phone.setUser(this);
    }
  }

  public void addPhone(Phone phone) {
    this.phones.add(phone);
    phone.setUser(this); // don't forget this
  }

  public void removePhone(Phone phone) {
    this.phones.remove(phone);
    phone.setUser(null);
  }

  public void removePhoneById(Long phoneId) {

    Phone targetPhone = this.findPhone(phoneId);

    if (targetPhone != null)
      this.removePhone(targetPhone);
  }

  public void setAddresses(List<Address> addresses) {
    this.addresses = addresses;
    // need this to make reverse relationship (from address to user)
    // otherwise, 'user_id' on Address table is not assigned and you got error.
    for (Address address : addresses) {
      address.setUser(this);
    }
  }

  public void removeAddress(Address address) {
    this.addresses.remove(address);
    address.setUser(null);
  }

  public void removeAddressById(Long addressId) {

    Address targetAddress = this.findAddress(addressId);

    if (targetAddress != null)
      this.removeAddress(targetAddress);
  }

  public Address findAddress(Long addressId) {
    return this.addresses.stream().filter(address -> {
      return address.getAddressId().equals(addressId);
    }).findFirst().get();
  }

  public Address getLastestAddress() {
    return this.addresses.get(this.addresses.size() - 1);
  }

  public void addAddress(Address address) {
    this.addresses.add(address);
    address.setUser(this); // don't forget this
  }

  public Company findCompany(Long companyId) {
    return this.companies.stream().filter(company -> {
      return company.getCompanyId().equals(companyId);
    }).findFirst().get();
  }

  public void removeCompany(Company company) {
    this.companies.remove(company);
    company.setUser(null);
  }

  public void addCompany(Company company) {
    this.companies.add(company);
    company.setUser(this); // don't forget this
  }

  public void removeCompanyById(Long companyId) {
    Company targetCompany = this.findCompany(companyId);

    if (targetCompany != null)
      this.removeCompany(targetCompany);
  }

  public void setCompanies(List<Company> companies) {
    this.companies = companies;
    // need this to make reverse relationship (from company to user)
    // otherwise, 'user_id' on Company table is not assigned and you got error.
    for (Company company : companies) {
      company.setUser(this);
    }
  }

  /**
   * update an existing company.
   *
   **/
  public void updateCompany(Long companyId, Company nextCompany) {
    this.removeCompanyById(companyId);
    this.addCompany(nextCompany);
  }

  public void setReviews(List<Review> reviews) {
    this.reviews = reviews;

    for (Review review : reviews) {
      review.setUser(this);
    }
  }

  public void addReview(Review review) {
    this.reviews.add(review);
    review.setUser(this);
  }

  public void removeReview(Review review) {
    this.reviews.remove(review);
    review.setUser(null);
  }

  public void setCartItems(List<CartItem> cartItems) {
    this.cartItems = cartItems;

    for (CartItem cartItem : cartItems) {
      cartItem.setUser(this);
    }
  }

  public void addCartItem(CartItem cartItem) {
    this.cartItems.add(cartItem);
    cartItem.setUser(this);
  }

  public void removeCartItem(CartItem cartItem) {
    this.cartItems.remove(cartItem);
    cartItem.setUser(null);
  }

  public void removeSelectedCartItems() {

    List<CartItem> selectedCartItems = this.cartItems.stream().filter(cartItem -> cartItem.getIsSelected()).collect(Collectors.toList());

    for (CartItem cartItem : selectedCartItems) {
      this.cartItems.remove(cartItem);
    }
  }

  public List<WishlistItem> getWishlistItems() {
    return wishlistItems;
  }

  public void setWishlistItems(List<WishlistItem> wishlistItems) {
    this.wishlistItems = wishlistItems;

    for (WishlistItem wishlistItem : wishlistItems) {
      wishlistItem.setUser(this);
    }
  }

  public void addWishlistItem(WishlistItem wishlistItem) {
    this.wishlistItems.add(wishlistItem);
    wishlistItem.setUser(this);
  }

  public void removeWishlistItem(WishlistItem wishlistItem) {
    this.wishlistItems.remove(wishlistItem);
    wishlistItem.setUser(null);
  }

  public void setOrders(List<Order> orders) {
    this.orders = orders;

    for (Order order : orders) {
      order.setUser(this);
    }
  }

  public void addOrder(Order order) {
    this.orders.add(order);
    order.setUser(this);
  }

  public void removeOrder(Order order) {
    this.orders.remove(order);
    order.setUser(null);
  }

  public void setOrderEvents(List<OrderEvent> orderEvents) {
    this.orderEvents = orderEvents;

    for (OrderEvent orderEvent : orderEvents) {
      orderEvent.setUser(this);
    }
  }

  public void addOrderEvent(OrderEvent orderEvent) {
    this.orderEvents.add(orderEvent);
    orderEvent.setUser(this);
  }

  public void removeOrderEvent(OrderEvent orderEvent) {
    this.orderEvents.remove(orderEvent);
    orderEvent.setUser(null);
  }

  public boolean hasStripeCustomerId() {
    return this.stripeCustomerId != null;
  }

  // business behaviors
  //public Address getSenderAddressOfAdmin() throws InvalidUserTypeException, NotFoundException {
  //  if (this.userType.getUserType() != UserTypeEnum.ADMIN) {
  //    throw new InvalidUserTypeException("user type except for ADMIN should not access this method.");  
  //  } 
  //  Optional<Address> senderAddressOption = this.addresses.stream().filter(address -> address.getIsSenderAddress()).findFirst();
  //  if (senderAddressOption.isEmpty()) {
  //    throw new NotFoundException("admin user does not have sender address.");
  //  }
  //  return senderAddressOption.get();
  //}

  public String getSelectedPhoneNumber() {
    // could be null
    Optional<Phone> selectedPhoneOption = this.phones.stream().filter(phone -> phone.getIsSelected()).findFirst();
    return (selectedPhoneOption.isEmpty()) ? "" : selectedPhoneOption.get().getPhoneNumber();
  }

  public String getSelectedPhoneNumberWithCountryCode() {
    // could be null
    Optional<Phone> selectedPhoneOption = this.phones.stream().filter(phone -> phone.getIsSelected()).findFirst();
    return (selectedPhoneOption.isEmpty()) ? "" : selectedPhoneOption.get().getCountryCode() + " " +  selectedPhoneOption.get().getPhoneNumber();
  }

  /**
   * toggle primary (selected) phone.
   *
   * make 'isSelected' true on target phone, otherwise, make it false.
   *
   **/
  public void togglePhoneSelection(Long targetPhoneId) {
    for (Phone phone: this.phones) {
      if (phone.getPhoneId().equals(targetPhoneId)) {
        phone.setIsSelected(true);  
      } else {
        phone.setIsSelected(false);
      } 
    }
  }

  /**
   * toggle primary billing address.
   *
   * make 'isBillingAddress' true on target phone, otherwise, make it false.
   *
   **/
  public void toggleBillingAddress(Long targetAddressId) {
    for (Address address: this.addresses) {
      if (address.getAddressId().equals(targetAddressId)) {
        address.setIsBillingAddress(true);  
      } else {
        address.setIsBillingAddress(false);
      } 
    }
  }

  /**
   * toggle primary shipping address.
   *
   * make 'isShippingAddress' true on target phone, otherwise, make it false.
   *
   **/
  public void toggleShippingAddress(Long targetAddressId) {
    for (Address address: this.addresses) {
      if (address.getAddressId().equals(targetAddressId)) {
        address.setIsShippingAddress(true);  
      } else {
        address.setIsShippingAddress(false);
      } 
    }
  }
  /**
   * refresh/generate verification token.
   * 
   **/
  public void refreshVerificationToken() {

    /**
     * generte/refresh a verification token to activate this account
     * 
     **/
    String token = UUID.randomUUID().toString();

    // 1 hour
    LocalDateTime oneHourAfterDateTime = LocalDateTime.now().plusHours(1L);

    logger.info("verification token expiry date: ");
    logger.info(oneHourAfterDateTime.toString());

    this.setVerificationToken(token);
    this.setVerificationTokenExpiryDate(oneHourAfterDateTime);
  }

  /**
   * check if verification token is expired or not.
   * 
   **/
  public boolean isVerificationTokenExpired() {
    if (this.verificationTokenExpiryDate.isBefore(LocalDateTime.now())) {
      return true;
    }
    return false;
  }

  /**
   * verify token
   **/
  public boolean verifyVerificationToken(String verificationToken) {
    if (this.verificationToken.equals(verificationToken) && !this.isVerificationTokenExpired()) {
      return true;
    }
    return false;
  }

  /**
   * refresh/generate forgotPassword token.
   * 
   **/
  public void refreshForgotPasswordToken() {

    /**
     * generte/refresh a forgotPassword token to activate this account
     * 
     **/
    String token = UUID.randomUUID().toString();

    // 10 mins
    LocalDateTime oneHourAfterDateTime = LocalDateTime.now().plusMinutes(10L);

    this.setForgotPasswordToken(token);
    this.setForgotPasswordTokenExpiryDate(oneHourAfterDateTime);
  }

  /**
   * check if forgotPassword token is expired or not.
   * 
   **/
  public boolean isForgotPasswordTokenExpired() {
    if (this.forgotPasswordTokenExpiryDate.isBefore(LocalDateTime.now())) {
      return true;
    }
    return false;
  }

  /**
   * verify token
   **/
  public boolean verifyForgotPasswordToken(String forgotPasswordToken) {
    if (this.forgotPasswordToken.equals(forgotPasswordToken) && !this.isForgotPasswordTokenExpired()) {
      return true;
    }
    return false;
  }

  /**
   * check this user is already active or not
   **/
  public boolean isActive() {
    return this.active.equals(UserActiveEnum.ACTIVE);
  }

  /**
   * switch from AggregateRoot Event to Spring Events.
   *
   * see note.md more detail.
   *
   **/

  // domain event
 // 
 // /**
 //  *  an event which a guest user signed up.
 //  **/
 // public User generatedVerificationToken() {
 //   this.registerEvent(new GeneratedVerificationTokenEvent(this));
 //   return this;
 // }

 // public User generatedForgotPasswordToken() {
 //   this.registerEvent(new GeneratedForgotPasswordTokenEvent(this));
 //   return this;
 // }
}
