package com.iwaodev.unit.infrastructure.model;

import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.unit.infrastructure.payment.PaymentServiceImplTest;
import org.hibernate.StaleObjectStateException;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.OptimisticLockException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("unittest")
public class UserTest {

    private static final Logger logger = LoggerFactory.getLogger(UserTest.class);

    @Autowired
    private UserRepository userRepository;

    /**
     * ref: https://stackoverflow.com/questions/27841055/how-can-i-test-optmistic-locking-using-junit-spring-and-jpa
     * @throws Exception
     */

    @Test
    public void shouldThrowOptimisticLockExceptionWhenMultipleUsersTryToUpdateSameUserEntity() throws Exception {
        //Open a transaction from a jUnit test method and read one row from a certain table.
        User targetUserAtMain = this.userRepository.getAdmin().orElseThrow(() -> new RuntimeException("admin not found"));
        targetUserAtMain.setFirstName("Main Thread");
        //Create a new thread and open another database transaction which will read the same row.
        //Update it, and save it to the database.
        //ExecutorService executorService = Executors.newSingleThreadExecutor();
        //executorService.submit(() -> {
        //    User targetUserAtAnother = this.userRepository.getAdmin().orElseThrow(() -> new RuntimeException("admin not found"));
        //    targetUserAtAnother.setFirstName("Another Thread");
        //    this.userRepository.save(targetUserAtAnother);
        //    logger.debug("another thread: done save");
        //});
        //executorService.shutdown();
        Thread anotherThread = new Thread(() -> {
            logger.debug("another thread: start running");
            User targetUserAtAnother = this.userRepository.getAdmin().orElseThrow(() -> new RuntimeException("admin not found"));
            targetUserAtAnother.setFirstName("Another Thread");
            this.userRepository.save(targetUserAtAnother);
            logger.debug("another thread: done save");
        });
        anotherThread.start();
        //Pause the main thread used by the jUnit test method.
        anotherThread.join();
        //Modify the data read at the beginning and try updating the row. As a result an optimistic lock exception should be thrown.
        logger.debug("main thread: start editting");

        assertThatThrownBy(() -> {
            this.userRepository.save(targetUserAtMain);
            logger.debug("main thread: done");
        }).isInstanceOf(ObjectOptimisticLockingFailureException.class);

        User expectedUser = this.userRepository.getAdmin().orElseThrow(() -> new RuntimeException("admin not found"));
        logger.debug(expectedUser.getFirstName());

    }
}
