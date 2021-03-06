package com.iwaodev.integration.event.order;

import com.iwaodev.application.event.order.SendReturnRequestSubmittedEmailEventHandler;
import com.iwaodev.application.event.order.SendReturnRequestWasConfirmedEmailEventHandler;
import com.iwaodev.application.irepository.OrderRepository;
import com.iwaodev.application.irepository.ProductRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.EmailService;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.order.event.OrderEventWasAddedByMemberEvent;
import com.iwaodev.domain.order.event.OrderEventWasAddedEvent;
import com.iwaodev.infrastructure.model.Order;
import com.iwaodev.infrastructure.model.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.transaction.BeforeTransaction;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

// this is alias to SpringJUnit4ClassRunner
// remove this since junit4 is not supported this Intellij IDE when run test individually.
//////@RunWith(SpringRunner.class)
/**
 * this allows you to use TestEntityManager instead of EntityManager.
 *
 * - if you use Real EntityManager, transaction does not work correctly. esp
 * there is no rollback.
 *
 * - you can't use @DataJpaTest since this includes @BootstrapWith which is
 * included in @SpringBootTest too. this complains that multiple use
 * of @Bootstrap when compile
 *
 **/
@AutoConfigureTestEntityManager
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Transactional(isolation = Isolation.READ_UNCOMMITTED)
@ActiveProfiles("integtest")
@AutoConfigureMockMvc
public class SendReturnRequestWasConfirmedEmailEventHandlerTest {

    private static final Logger logger = LoggerFactory.getLogger(SendReturnRequestSubmittedEmailEventHandlerTest.class);

    @LocalServerPort
    private int port;

    @Autowired
    private BaseDatabaseSetup baseDatabaseSetup;

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SendReturnRequestWasConfirmedEmailEventHandler handler;

    @MockBean
    private EmailService emailService;

    /**
     * insert base test data into mysql database
     *
     * - such as user_types, test user
     *
     **/
    @BeforeTransaction
    void verifyInitialDatabaseState() throws Exception {
        this.baseDatabaseSetup.setup(this.entityManager);
    }

    @Test
    @Sql(scripts = { "classpath:/integration/event/shouldNotSendReturnRequestWasConfirmedEmailIfOrderStatusIsNotReturnRequestWasConfirmed.sql" })
    public void shouldNotSendReturnRequestWasConfirmedEmailIfOrderStatusIsNotReturnRequestWasConfirmed() throws Exception {

        // make sure user_id in the sql match test admin user id

        // arrange
        UUID dummyOrderId = UUID.fromString("c8f8591c-bb83-4fd1-a098-3fac8d40e450");
        Optional<Order> dummyOrderOption = this.orderRepository.findById(dummyOrderId);
        Order dummyOrder = dummyOrderOption.get();

        // act & assert
        this.handler.handleEvent(new OrderEventWasAddedEvent(this, dummyOrder));

        /**
         * NOTE: 'save' inside this handler automatically update/reflect target entity.
         *
         * e.g., even if we call the this.orderRepository before this handler is handled, its variant sold count is updated.
         **/

        // assert
        Mockito.verify(this.emailService, Mockito.never()).send(Mockito.anyString(), Mockito.anyString(), Mockito.anyString(), Mockito.anyString());
    }

    @Test
    @Sql(scripts = { "classpath:/integration/event/shouldSendReturnRequestWasConfirmedEmail.sql" })
    public void shouldSendReturnRequestWasConfirmedEmail() throws Exception {

        // make sure user_id in the sql match test admin user id

        // arrange
        UUID dummyOrderId = UUID.fromString("c8f8591c-bb83-4fd1-a098-3fac8d40e450");
        Optional<Order> dummyOrderOption = this.orderRepository.findById(dummyOrderId);
        Order dummyOrder = dummyOrderOption.get();

        //User recipient = this.userRepository.findById(dummyRecipient).orElseThrow(() -> new Exception("recipient not found."));
        User recipient = this.userRepository.getAdmin().orElseThrow(() -> new Exception("admin not found."));

        // act & assert
        this.handler.handleEvent(new OrderEventWasAddedEvent(this, dummyOrder));

        /**
         * NOTE: 'save' inside this handler automatically update/reflect target entity.
         *
         * e.g., even if we call the this.orderRepository before this handler is handled, its variant sold count is updated.
         **/

        // assert
        Mockito.verify(this.emailService, Mockito.times(1))
                .send(
                        Mockito.eq(dummyOrder.getOrderEmail()),
                        Mockito.anyString(),
                        Mockito.eq(String.format("Your Return Request Was Confirmed (Order #: %s)", dummyOrder.getOrderNumber())),
                        Mockito.anyString()
                );
    }
}








