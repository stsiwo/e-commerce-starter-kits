package com.iwaodev.integration.statistic;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.statistic.SaleDTO;
import com.iwaodev.application.dto.statistic.StatisticUserDTO;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.auth.AuthenticateTestUser;
import com.iwaodev.auth.AuthenticationInfo;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.user.UserTypeEnum;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.integration.address.AdminAddressEndpointTest;
import com.iwaodev.util.ResourceReader;
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
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.transaction.BeforeTransaction;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.Cookie;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
public class AdminStatisticUsersEndpointTest {

    private static final Logger logger = LoggerFactory.getLogger(AdminAddressEndpointTest.class);

    private String targetPath = "/statistics";

    @LocalServerPort
    private int port;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private BaseDatabaseSetup baseDatabaseSetup;

    @Autowired
    private AuthenticateTestUser authenticateTestUser;

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResourceReader resourceReader;

    private Cookie authCookie;

    private Cookie csrfCookie;

    private AuthenticationInfo authInfo;

    /**
     * insert base test data into mysql database
     *
     * - such as user_types, test user
     *
     **/
    @BeforeTransaction
    void verifyInitialDatabaseState() throws Exception {
        this.baseDatabaseSetup.setup(this.entityManager);

        // send authentication request before testing
        this.authInfo = this.authenticateTestUser.setup(
                this.entityManager,
                this.mvc,
                UserTypeEnum.ADMIN,
                this.port);

        this.authCookie = new Cookie("api-token", this.authInfo.getJwtToken());
        this.csrfCookie = new Cookie("csrf-token", this.authInfo.getCsrfToken());
    }

    @Test
    // the name of a bean start lowercase char so don't confused with its class
    // name.
    // #TODO: get this email value from test.properties. for now I don't know how to
    // do this. see note.md more details
    // stop using this @WithUserDetails. this does not work with TestRestTemplate
    // @WithUserDetails(value = "test_admin@test.com", userDetailsServiceBeanName =
    // "springSecurityUserDetailsService")
    // @Sql(scripts={"classpath:test.sql"})
    public void shouldAdminAccessToThisEndpoint() throws Exception {

        // arrange
        String targetUrl = "http://localhost:" + this.port + this.targetPath + "/users";

        // act & assert
        mvc.perform(
                        MockMvcRequestBuilders
                                .get(targetUrl)
                                .cookie(this.authCookie)
                                .cookie(this.csrfCookie)
                                .header("csrf-token", this.authInfo.getCsrfToken())
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    //@Sql(scripts = { "classpath:/integration/statistic/shouldAdminGetHourlyBaseSaleData.sql" })
    public void shouldAdminGetHourlyBaseUserData(/*@Value("classpath:/integration/user/shouldAdminGetAllOfItsOwnAddress.json") Resource dummyFormJsonFile*/) throws Exception {

        // make sure user_id in the sql match test admin user id

        // dummy form json
        //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
        //String dummyFormJsonString = dummyFormJson.toString();

        List<User> users = this.userRepository.findAll();

        logger.debug("users size: " + users.size());
        for (User user: users) {
            logger.debug("user name: " + user.getFirstName());
            logger.debug("user created_at: " + user.getCreatedAt().toString());
        }

        // arrange
        // don't forget start from the previous date (minus 1)
        LocalDateTime expectedDate = LocalDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonth(), LocalDateTime.now().getDayOfMonth(), 0, 0, 0);
        int hourIncrement = 1;
        String targetUrl = "http://localhost:" + this.port + this.targetPath + "/users";

        // act & assert
        ResultActions resultActions = mvc.perform(
                        MockMvcRequestBuilders
                                .get(targetUrl)
                                .cookie(this.authCookie)
                                .cookie(this.csrfCookie)
                                .header("csrf-token", this.authInfo.getCsrfToken())
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andDo(print())
                .andExpect(status().isOk());

        MvcResult result = resultActions.andReturn();
        JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
        StatisticUserDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode, StatisticUserDTO[].class);

        // assert
        assertThat(result.getResponse().getStatus()).isEqualTo(200);
        assertThat(responseBody.length).isGreaterThanOrEqualTo(1);
        for (StatisticUserDTO userDTO : responseBody) {
            logger.debug(userDTO.getName().toString());
            logger.debug(userDTO.getUsers().toString());
            //assertThat(userDTO.getName()).isEqualTo(expectedDate);
            //assertThat(userDTO.getUsers()).isEqualTo(0);
            expectedDate = expectedDate.plusHours(hourIncrement);
        }
    }

    @Test
    //@Sql(scripts = { "classpath:/integration/statistic/shouldAdminGetHourlyBaseSaleData.sql" })
    public void shouldAdminGetHourlyBaseUserDataWithQueryParam(/*@Value("classpath:/integration/user/shouldAdminGetAllOfItsOwnAddress.json") Resource dummyFormJsonFile*/) throws Exception {

        // make sure user_id in the sql match test admin user id

        // dummy form json
        //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
        //String dummyFormJsonString = dummyFormJson.toString();

        // arrange
        int targetYear = 2020;
        int targetMonth = 3;
        int targetStartDate = 3;
        int targetEndDate = 15;
        LocalDateTime expectedDate = LocalDateTime.of(targetYear, targetMonth, targetStartDate, 0, 0, 0);
        int hourIncrement = 1;
        String queryParam = String.format(
                "?startYear=%s&startMonth=%s&startDate=%s&endYear=%s&endMonth=%s&endDate=%s",
                targetYear, targetMonth, targetStartDate, targetYear, targetMonth, targetEndDate
        );
        String targetUrl = "http://localhost:" + this.port + this.targetPath + "/users" + queryParam;

        // act & assert
        ResultActions resultActions = mvc.perform(
                        MockMvcRequestBuilders
                                .get(targetUrl)
                                .cookie(this.authCookie)
                                .cookie(this.csrfCookie)
                                .header("csrf-token", this.authInfo.getCsrfToken())
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andDo(print())
                .andExpect(status().isOk());

        MvcResult result = resultActions.andReturn();
        JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
        StatisticUserDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode, StatisticUserDTO[].class);

        // assert
        assertThat(result.getResponse().getStatus()).isEqualTo(200);
        assertThat(responseBody.length).isGreaterThanOrEqualTo(24);
        for (StatisticUserDTO userDTO : responseBody) {
            //logger.debug(saleDTO.getName().toString());
            //logger.debug(expectedDate.toString());
            assertThat(expectedDate).isEqualTo(userDTO.getName());
            assertThat(0).isEqualTo(userDTO.getUsers());
            expectedDate = expectedDate.plusHours(hourIncrement);
        }
    }

    @Test
    @Sql(scripts = { "classpath:/integration/statistic/shouldAdminGetHourlyBaseUserDataWithTestData.sql" })
    public void shouldAdminGetHourlyBaseUserDataWithTestData(/*@Value("classpath:/integration/user/shouldAdminGetAllOfItsOwnAddress.json") Resource dummyFormJsonFile*/) throws Exception {

        // make sure user_id in the sql match test admin user id

        // dummy form json
        //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
        //String dummyFormJsonString = dummyFormJson.toString();

        // arrange
        int targetYear = 2021;
        int targetMonth = 8;
        int targetStartDate = 1;
        int targetEndDate = 3;
        LocalDateTime expectedDate = LocalDateTime.of(targetYear, targetMonth, targetStartDate, 0, 0, 0);
        int hourIncrement = 1;
        String queryParam = String.format(
                "?startYear=%s&startMonth=%s&startDate=%s&endYear=%s&endMonth=%s&endDate=%s",
                targetYear, targetMonth, targetStartDate, targetYear, targetMonth, targetEndDate
        );
        String targetUrl = "http://localhost:" + this.port + this.targetPath + "/users" + queryParam;

        // act & assert
        ResultActions resultActions = mvc.perform(
                        MockMvcRequestBuilders
                                .get(targetUrl)
                                .cookie(this.authCookie)
                                .cookie(this.csrfCookie)
                                .header("csrf-token", this.authInfo.getCsrfToken())
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andDo(print())
                .andExpect(status().isOk());

        MvcResult result = resultActions.andReturn();
        JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
        StatisticUserDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode, StatisticUserDTO[].class);

        // assert

        Integer firstUsers = 2; // check sql
        Integer secondUsers = 1; // check sql
        Integer thirdUsers = 1; // check sql
        Integer fourthUsers = 1; // check sql
        Integer fifthUsers = 4; // check sql
        Integer sixthUsers = 1; // check sql

        LocalDateTime firstDate = LocalDateTime.parse("2021-08-01 00:00:00", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        LocalDateTime secondDate = LocalDateTime.parse("2021-08-01 12:00:00", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        LocalDateTime thirdDate = LocalDateTime.parse("2021-08-01 13:00:00", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        LocalDateTime fourthDate = LocalDateTime.parse("2021-08-01 20:00:00", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        LocalDateTime fifthDate = LocalDateTime.parse("2021-08-02 12:00:00", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        LocalDateTime sixthDate = LocalDateTime.parse("2021-08-03 23:00:00", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        assertThat(result.getResponse().getStatus()).isEqualTo(200);
        assertThat(responseBody.length).isGreaterThanOrEqualTo(24);
        for (StatisticUserDTO userDTO : responseBody) {

            logger.debug(userDTO.getName().toString());
            logger.debug(userDTO.getUsers().toString());
            //if (firstDate.isEqual(userDTO.getName())) {
            //    assertThat(firstUsers).isEqualTo(userDTO.getUsers());
            //}
            //else if (secondDate.isEqual(userDTO.getName())) {
            //    assertThat(secondUsers).isEqualTo(userDTO.getUsers());
            //}
            //else if (thirdDate.isEqual(userDTO.getName())) {
            //    assertThat(thirdUsers).isEqualTo(userDTO.getUsers());
            //}
            //else if (fourthDate.isEqual(userDTO.getName())) {
            //    assertThat(fourthUsers).isEqualTo(userDTO.getUsers());
            //}
            //else if (fifthDate.isEqual(userDTO.getName())) {
            //    assertThat(fifthUsers).isEqualTo(userDTO.getUsers());
            //}
            //else if (sixthDate.isEqual(userDTO.getName())) {
            //    assertThat(sixthUsers).isEqualTo(userDTO.getUsers());
            //}
            //else {
            //    assertThat(expectedDate).isEqualTo(userDTO.getName());
            //    assertThat(0).isEqualTo(userDTO.getUsers());
            //}
            expectedDate = expectedDate.plusHours(hourIncrement);
        }
    }

    @Test
    //@Sql(scripts = { "classpath:/integration/statistic/shouldAdminGetHourlyBaseSaleData.sql" })
    public void shouldAdminGetDailyBaseSaleDataWithQueryParam(/*@Value("classpath:/integration/user/shouldAdminGetAllOfItsOwnAddress.json") Resource dummyFormJsonFile*/) throws Exception {

        // make sure user_id in the sql match test admin user id

        // dummy form json
        //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
        //String dummyFormJsonString = dummyFormJson.toString();

        // arrange
        int targetYear = 2020;
        int targetStartMonth = 3;
        int targetEndMonth = 5;
        int targetStartDate = 3;
        int targetEndDate = 15;
        LocalDateTime expectedDate = LocalDateTime.of(targetYear, targetStartMonth, targetStartDate, 0, 0, 0);
        int dayIncrement = 1;
        String queryParam = String.format(
                "?startYear=%s&startMonth=%s&startDate=%s&endYear=%s&endMonth=%s&endDate=%s",
                targetYear, targetStartMonth, targetStartDate, targetYear, targetEndMonth, targetEndDate
        );
        String targetUrl = "http://localhost:" + this.port + this.targetPath + "/users" + queryParam;

        // act & assert
        ResultActions resultActions = mvc.perform(
                        MockMvcRequestBuilders
                                .get(targetUrl)
                                .cookie(this.authCookie)
                                .cookie(this.csrfCookie)
                                .header("csrf-token", this.authInfo.getCsrfToken())
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andDo(print())
                .andExpect(status().isOk());

        MvcResult result = resultActions.andReturn();
        JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
        StatisticUserDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode, StatisticUserDTO[].class);

        // assert
        assertThat(result.getResponse().getStatus()).isEqualTo(200);
        assertThat(responseBody.length).isGreaterThan(10);
        for (StatisticUserDTO userDTO : responseBody) {
            //logger.debug(userDTO.getName().toString());
            //logger.debug(expectedDate.toString());
            assertThat(expectedDate).isEqualTo(userDTO.getName());
            assertThat(0).isEqualTo(userDTO.getUsers());
            expectedDate = expectedDate.plusDays(dayIncrement);
        }
    }

    @Test
    @Sql(scripts = { "classpath:/integration/statistic/shouldAdminGetDailyBaseUserDataWithTestData.sql" })
    public void shouldAdminGetDailyBaseUserDataWithTestData(/*@Value("classpath:/integration/user/shouldAdminGetAllOfItsOwnAddress.json") Resource dummyFormJsonFile*/) throws Exception {

        // make sure user_id in the sql match test admin user id

        // dummy form json
        //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
        //String dummyFormJsonString = dummyFormJson.toString();

        // arrange
        int targetYear = 2020;
        int targetStartMonth = 8;
        int targetEndMonth = 9;
        int targetStartDate = 1;
        int targetEndDate = 21;
        LocalDateTime expectedDate = LocalDateTime.of(targetYear, targetStartMonth, targetStartDate, 0, 0, 0);
        int dayIncrement = 1;
        String queryParam = String.format(
                "?startYear=%s&startMonth=%s&startDate=%s&endYear=%s&endMonth=%s&endDate=%s",
                targetYear, targetStartMonth, targetStartDate, targetYear, targetEndMonth, targetEndDate
        );
        String targetUrl = "http://localhost:" + this.port + this.targetPath + "/users" + queryParam;

        // act & assert
        ResultActions resultActions = mvc.perform(
                        MockMvcRequestBuilders
                                .get(targetUrl)
                                .cookie(this.authCookie)
                                .cookie(this.csrfCookie)
                                .header("csrf-token", this.authInfo.getCsrfToken())
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andDo(print())
                .andExpect(status().isOk());

        MvcResult result = resultActions.andReturn();
        JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
        StatisticUserDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode, StatisticUserDTO[].class);

        // assert

        Integer firstUsers = 5; // check sql
        Integer secondUsers = 4; // check sql
        Integer thirdUsers = 1; // check sql

        LocalDateTime firstDate = LocalDateTime.parse("2020-08-01 00:00:00", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")); // check order 1 on sql
        LocalDateTime secondDate = LocalDateTime.parse("2020-08-23 00:00:00", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")); // check order 2, 3 on sql
        LocalDateTime thirdDate = LocalDateTime.parse("2020-09-10 00:00:00", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")); // check order 4 on sql

        assertThat(result.getResponse().getStatus()).isEqualTo(200);
        assertThat(responseBody.length).isGreaterThan(10);
        for (StatisticUserDTO userDTO : responseBody) {

            if (firstDate.isEqual(userDTO.getName())) {
                assertThat(firstUsers).isEqualTo(userDTO.getUsers());
            }
            else if (secondDate.isEqual(userDTO.getName())) {
                assertThat(secondUsers).isEqualTo(userDTO.getUsers());
            }
            else if (thirdDate.isEqual(userDTO.getName())) {
                assertThat(thirdUsers).isEqualTo(userDTO.getUsers());
            } else {
                assertThat(expectedDate).isEqualTo(userDTO.getName());
                assertThat(0).isEqualTo(userDTO.getUsers());
            }
            expectedDate = expectedDate.plusDays(dayIncrement);
        }
    }

    @Test
    @Sql(scripts = { "classpath:/integration/statistic/shouldAdminGetMonthlyBaseUserDataWithTestData.sql" })
    public void shouldAdminGetMonthlyBaseUserDataWithTestData(/*@Value("classpath:/integration/user/shouldAdminGetAllOfItsOwnAddress.json") Resource dummyFormJsonFile*/) throws Exception {

        // make sure user_id in the sql match test admin user id

        // dummy form json
        //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
        //String dummyFormJsonString = dummyFormJson.toString();

        // arrange
        int targetStartYear = 2019;
        int targetEndYear = 2020;
        int targetStartMonth = 8;
        int targetEndMonth = 9;
        int targetStartDate = 1;
        int targetEndDate = 21;
        LocalDateTime expectedDate = LocalDateTime.of(targetStartYear, targetStartMonth, targetStartDate, 0, 0, 0);
        int monthIncrement = 1;
        String queryParam = String.format(
                "?startYear=%s&startMonth=%s&startDate=%s&endYear=%s&endMonth=%s&endDate=%s",
                targetStartYear, targetStartMonth, targetStartDate, targetEndYear, targetEndMonth, targetEndDate
        );
        String targetUrl = "http://localhost:" + this.port + this.targetPath + "/users" + queryParam;

        // act & assert
        ResultActions resultActions = mvc.perform(
                        MockMvcRequestBuilders
                                .get(targetUrl)
                                .cookie(this.authCookie)
                                .cookie(this.csrfCookie)
                                .header("csrf-token", this.authInfo.getCsrfToken())
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andDo(print())
                .andExpect(status().isOk());

        MvcResult result = resultActions.andReturn();
        JsonNode contentAsJsonNode = this.objectMapper.readValue(result.getResponse().getContentAsString(), JsonNode.class);
        StatisticUserDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode, StatisticUserDTO[].class);

        // assert

        Integer firstUsers = 5; // check sql
        Integer secondUsers = 4; // check sql
        Integer thirdUsers = 1; // check sql

        LocalDateTime firstDate = LocalDateTime.parse("2019-08-01 00:00:00", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")); // check order 1 on sql
        LocalDateTime secondDate = LocalDateTime.parse("2019-12-23 00:00:00", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")); // check order 2, 3 on sql
        LocalDateTime thirdDate = LocalDateTime.parse("2020-09-21 00:00:00", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")); // check order 4 on sql

        assertThat(result.getResponse().getStatus()).isEqualTo(200);
        assertThat(responseBody.length).isGreaterThan(10);
        for (StatisticUserDTO userDTO : responseBody) {

            //logger.debug(userDTO.getName().toString());
            //logger.debug(expectedDate.toString());
            if (firstDate.getYear() == userDTO.getName().getYear() && firstDate.getMonth() == userDTO.getName().getMonth()) {
                assertThat(firstUsers).isEqualTo(userDTO.getUsers());
            }
            else if (secondDate.getYear() == userDTO.getName().getYear() && secondDate.getMonth() == userDTO.getName().getMonth()) {
                assertThat(secondUsers).isEqualTo(userDTO.getUsers());
            }
            else if (thirdDate.getYear() == userDTO.getName().getYear() && thirdDate.getMonth() == userDTO.getName().getMonth()) {
                assertThat(thirdUsers).isEqualTo(userDTO.getUsers());
            } else {
                assertThat(expectedDate).isEqualTo(userDTO.getName());
                assertThat(0).isEqualTo(userDTO.getUsers());
            }
            expectedDate = expectedDate.plusMonths(monthIncrement);
        }
    }
}
