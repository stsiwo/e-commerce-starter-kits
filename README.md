# e-commerce-starter-kits

## Description

An e-commerce web application integrated with [Stripe](https://stripe.com/en-ca) as a payment system and [Canada Post](https://www.canadapost-postescanada.ca/cpc/en/home.page) as a postal service.

## Goal

My goal is to develop a maintainable, testable, and scalable application as much as possible. I focus on OOP and architecture to achieve this goal. I explain how I implement it in the following sections.

## End-User Features

  - __Role Management__: guest, member, and admin roles.
  - __Wishlist Management__: members can save products for later.
  - __Cart Management__: guests/members can keep products for their checkout.
  - __Checkout & Online Payment__: guests/members can buy products online.
  - __Order History Management__: members can view their orders, and they can update an order event if applicable.
  - __Product Search__: guests/members can search/filter/sort products.
  - __Account Management__: members/admin can manage their account information (e.g., avatar, basic info, billing/shipping address, phone, and account deletion)
  - __Product Management__: the admin can CRUD products. 
  - __Category Management__: the admin can CRUD categories.
  - __Order Management__: the admin can manage all of the orders by customers.
  - __Review Management__: the admin can manage all of the reviews by customers
  - __Customer Management__: the admin can CRUD customers.
  - __Login Attempt Limitation__: prevent brute force attack.
  - __Email Verification__: protect email reputation.
  - __Notifications__: members/admin can receive in-app notifications when a crucial event happens  (e.g., a new order was placed, your order was shipped, and so on)
  - __Contact__: guests/members can use the contact form to send inquiries.
  - __Email__: guests/members/admin can receive emails when a crucial event happens (e.g., a new order was placed, your order was shipped, and so on)
  - __Rating__: guests/members can get the estimated shipping cost & delivery date when checkout (integration with Canada Post API).

## Developer Features

  - Daily Backup: automate daily backup with [this docker image](https://github.com/databacker/mysql-backup)
  - [Spring Boot Admin](https://github.com/codecentric/spring-boot-admin): admin web interface tool to manage my back-end API.  

## Tech Stack

### Front End

  - [ReactJS](https://reactjs.org/)
  - [Webpack](https://webpack.js.org/)
  - [Material-UI](https://material-ui.com/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Redux](https://redux.js.org/)
  - [Redux-Saga](https://redux-saga.js.org/)
  - [Jest](https://jestjs.io/)
  - [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
  - [Nginx](https://www.nginx.com/)

### Back End

  - [Open JDK 11](https://openjdk.java.net/projects/jdk/11/)
  - [Spring Boot](https://spring.io/projects/spring-boot)
  - [Hibernate](https://hibernate.org/)
  - [Lombok](https://projectlombok.org/)
  - [MapStruct](https://mapstruct.org/)
  - [AspectJ](https://www.eclipse.org/aspectj/)
  - [Flyway](https://flywaydb.org/)
  - [Spring Security](https://spring.io/projects/spring-security)
  - [Jacoco](https://www.eclemma.org/jacoco/)
  - [JUnit](https://junit.org/junit4/)
	

### Infrastructure

  - [AWS EC2](https://aws.amazon.com/ec2/?ec2-whats-new.sort-by=item.additionalFields.postDateTime&ec2-whats-new.sort-order=desc)
  - [AWS Route53](https://aws.amazon.com/route53/)
  - [AWS SNS](https://aws.amazon.com/sns/?whats-new-cards.sort-by=item.additionalFields.postDateTime&whats-new-cards.sort-order=desc)
  - [AWS SES](https://aws.amazon.com/ses/)
  - [AWS S3](https://aws.amazon.com/s3/)
  - [AWS CloudWatch](https://aws.amazon.com/cloudwatch/)
  - [AWS Lambda](https://aws.amazon.com/lambda/)
  - [Docker](https://www.docker.com/)
  - [Docker-Compose](https://docs.docker.com/compose/)
  - [MySQL](https://www.mysql.com/)

## Architecture

### Front End

I separate each responsibility into different modules:

  - UI Components: display UI to users.
  - Redux-Saga Workers: handle side effects (e.g., CRUD operation to back-end API).
  - Redux Store: keep the state.
  - Selectors: filter, sort, or calculate the state as UI components desire. 

![alt text](https://github.com/stsiwo/e-commerce-starter-kits/blob/main/front-end-architecture.png "Architecture Front End 1")

### Flow

Here is a typical flow of how each component interacts with the other.

  1. Users trigger an event and run the event handler, or we need initial prep (e.g., useEffect).
  2. Dispatch an action.
  3. If it does not need side effects, move to step 5.
  4. If we need to have side effects (e.g., CRUD operation to back-end API), use watchers and workers in Redux-Saga.
  5. The Redux store receives the updated data and updates the state.
  6. Any UI component, which subscribes to updated data, is updated through its selector where you can filter, sort, or calculate the state if necessary. 

## Refs

  - rechaptch management console: https://www.google.com/u/2/recaptcha/admin/site/459661075 (need to login as satoshi@iwaodev.com)

