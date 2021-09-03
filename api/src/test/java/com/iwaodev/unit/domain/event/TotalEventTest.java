package com.iwaodev.unit.domain.event;

import com.iwaodev.application.event.EventHandler;
import com.iwaodev.application.event.notification.CreateOrderEventNotificationForMemberEventHandler;
import com.iwaodev.domain.order.event.*;
import com.iwaodev.domain.review.event.NewReviewWasSubmittedEvent;
import com.iwaodev.domain.review.event.ReviewWasUpdatedByMemberEvent;
import com.iwaodev.domain.review.event.ReviewWasVerifiedByAdminEvent;
import com.iwaodev.domain.user.event.GeneratedForgotPasswordTokenEvent;
import com.iwaodev.domain.user.event.GeneratedVerificationTokenEvent;
import com.iwaodev.domain.wishlistItem.event.MovedWishlistItemToCartItemEvent;
import com.iwaodev.unit.domain.event.order.OrderCanceledEventTest;
import com.iwaodev.util.TestUtil;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationEvent;
import org.springframework.test.context.ActiveProfiles;

import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

/**
 *
 * since it is difficult to test that events and event handlers under the transaction in test env (see other XXXEventTest for more details)
 *
 * this is a complementary for domain event and its hander testing.
 *
 * other tests (XXXEventTest): make sure the subscription of event handlers for specific domain event. but this is not perfect to cover the whole use case.
 * esp, when add additional event, never fail the test so to make sure the event is under the coverage of testing, I added this test.
 *
 * compare the all event (manually and with reflection) and make sure how many events are used in this test, also, make sure that when adding a new event, it also fail this test.
 *
 **/
//@RunWith(SpringRunner.class)
@SpringBootTest
@ActiveProfiles("unittest")
// @EnableTransactionManagement
// @Transactional(propagation = Propagation.REQUIRES_NEW)
public class TotalEventTest {

    private static final Logger logger = LoggerFactory.getLogger(OrderCanceledEventTest.class);

    @Autowired
    private TestUtil testUtil;

    @Test
    public void shouldHaveAllDomainEvents() throws Exception {
        // arrange
        Set<Class<? extends ApplicationEvent>> result = this.testUtil.getAllEvent();
        Set<Class> registeredEvents = new HashSet<>();

        for (Class<? extends ApplicationEvent> event: result) {
           logger.debug(event.getTypeName());
        }

        // orders
        registeredEvents.add(OrderCanceledEvent.class);
        registeredEvents.add(OrderEventWasAddedByMemberEvent.class);
        registeredEvents.add(OrderEventWasAddedEvent.class);
        registeredEvents.add(OrderFinalConfirmedEvent.class);
        registeredEvents.add(OrderReturnedEvent.class);
        registeredEvents.add(PaymentFailedEvent.class);
        registeredEvents.add(PaymentSucceededEvent.class);

        // reivews
        registeredEvents.add(NewReviewWasSubmittedEvent.class);
        registeredEvents.add(ReviewWasUpdatedByMemberEvent.class);
        registeredEvents.add(ReviewWasVerifiedByAdminEvent.class);

        // users
        registeredEvents.add(GeneratedForgotPasswordTokenEvent.class);
        registeredEvents.add(GeneratedVerificationTokenEvent.class);

        // wishlist
        registeredEvents.add(MovedWishlistItemToCartItemEvent.class);

        assertThat(registeredEvents.size()).isEqualTo(result.size());
        assertThat(registeredEvents.containsAll(result) && result.containsAll(registeredEvents)).isTrue();
    }
}
