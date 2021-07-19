package com.iwaodev.integration.event.cartItem;

import com.iwaodev.application.event.cartItem.CreateCartItemEventHandler;
import com.iwaodev.application.event.cartItem.RemoveCartItemIfStockZeroEventHandler;
import com.iwaodev.application.irepository.CartItemRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.order.event.PaymentSucceededEvent;
import com.iwaodev.domain.wishlistItem.event.MovedWishlistItemToCartItemEvent;
import com.iwaodev.exception.AppException;
import com.iwaodev.infrastructure.model.CartItem;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.transaction.BeforeTransaction;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

// this is alias to SpringJUnit4ClassRunner
////@RunWith(SpringRunner.class)

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
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Transactional(isolation = Isolation.READ_UNCOMMITTED)
@ActiveProfiles("integtest")
@AutoConfigureMockMvc
public class RemoveCartItemIfStockZeroEventHandlerTest {

    private static final Logger logger = LoggerFactory.getLogger(RemoveCartItemIfStockZeroEventHandlerTest.class);

    @LocalServerPort
    private int port;

    @Autowired
    private BaseDatabaseSetup baseDatabaseSetup;

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private RemoveCartItemIfStockZeroEventHandler handler;

    /**
     * insert base test data into mysql database
     *
     * - such as user_types, test user
     *
     **/
    @BeforeTransaction
    void verifyInitialDatabaseState() throws Exception {
        logger.info("start calling setup before - satoshi");

        this.baseDatabaseSetup.setup(this.entityManager);
    }

    @Test
    @Sql(scripts = { "classpath:/integration/event/shouldRemoveAllCartItemOfVariantsSinceOutOfStock.sql" })
    public void shouldRemoveAllCartItemOfVariantsSinceOutOfStock(/**@Value("classpath:/integration/event/shouldAddSoldCountSuccessfullyWhenAddSoldCountEventHandlerCalled.json") Resource dummyFormJsonFile**/) throws Exception {

        // make sure user_id in the sql match test admin user id

        // arrange
        String dummyStripePaymentIntent = "dummy_stripe_payment_intent_1";
        Long dummyVariantId1 = 9L; // those are supporsed to be deleted.
        Long dummyVariantId2 = 14L;

        // act & assert
        this.handler.handleEvent(new PaymentSucceededEvent(this, dummyStripePaymentIntent, null ));

        /**
         * NOTE: 'save' inside this handler automatically update/reflect target entity.
         *
         * e.g., even if we call the this.orderRepository before this handler is handled, its variant sold count is updated.
         **/
        // assert
        List<CartItem> targetCartItems = this.cartItemRepository.findAll();
        for (CartItem cartItem: targetCartItems) {
            assertThat(cartItem.getVariant().getVariantId()).isNotEqualTo(dummyVariantId1);
            assertThat(cartItem.getVariant().getVariantId()).isNotEqualTo(dummyVariantId2);
        }
    }

}
