package com.iwaodev.integration.event.cartItem;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.UUID;

// MockMvc stuff
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.iwaodev.application.event.cartItem.CreateCartItemEventHandler;
import com.iwaodev.application.irepository.CartItemRepository;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.wishlistItem.event.MovedWishlistItemToCartItemEvent;
import com.iwaodev.exception.AppException;
import com.iwaodev.infrastructure.model.*;

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
public class CreateCartItemEventHandlerTest {

    private static final Logger logger = LoggerFactory.getLogger(CreateCartItemEventHandlerTest.class);

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
    private CreateCartItemEventHandler handler;

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
    @Sql(scripts = { "classpath:/integration/event/shouldMemberMoveWishlistItemToCart.sql" })
    public void shouldMemberMoveWishlistItemToCart(/**@Value("classpath:/integration/event/shouldAddSoldCountSuccessfullyWhenAddSoldCountEventHandlerCalled.json") Resource dummyFormJsonFile**/) throws Exception {

        // make sure user_id in the sql match test admin user id

        // arrange
        UUID dummyUserId = UUID.fromString("c7081519-16e5-4f92-ac50-1834001f12b9");
        Long dummyVariantId = 1L;
        // act & assert
        this.handler.handleEvent(new MovedWishlistItemToCartItemEvent(this,dummyUserId, dummyVariantId));

        /**
         * NOTE: 'save' inside this handler automatically update/reflect target entity.
         *
         * e.g., even if we call the this.orderRepository before this handler is handled, its variant sold count is updated.
         **/
        // assert
        CartItem targetCartItem = this.cartItemRepository.findByVariantIdAndUserId(dummyVariantId, dummyUserId).orElse(null);
        assertThat(targetCartItem).isNotNull();
    }

    @Test
    @Sql(scripts = { "classpath:/integration/event/shouldNotMemberMoveWishlistItemToCartSinceOutOfStock.sql" })
    public void shouldNotMemberMoveWishlistItemToCartSinceOutOfStock(/**@Value("classpath:/integration/event/shouldAddSoldCountSuccessfullyWhenAddSoldCountEventHandlerCalled.json") Resource dummyFormJsonFile**/) throws Exception {

        // make sure user_id in the sql match test admin user id

        // arrange
        UUID dummyUserId = UUID.fromString("c7081519-16e5-4f92-ac50-1834001f12b9");
        Long dummyVariantId = 1L;

        /**
         * NOTE: 'save' inside this handler automatically update/reflect target entity.
         *
         * e.g., even if we call the this.orderRepository before this handler is handled, its variant sold count is updated.
         **/
        // assert
        assertThatThrownBy(() -> {
            // act & assert
            this.handler.handleEvent(new MovedWishlistItemToCartItemEvent(this,dummyUserId, dummyVariantId));
        }).isInstanceOf(AppException.class).hasMessage("the variant does not have any stock.");
        CartItem targetCartItem = this.cartItemRepository.findByVariantIdAndUserId(dummyVariantId, dummyUserId).orElse(null);
        assertThat(targetCartItem).isNull();
    }
}
