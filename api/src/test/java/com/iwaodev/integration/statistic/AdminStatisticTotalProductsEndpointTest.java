package com.iwaodev.integration.statistic;

// this is alias to SpringJUnit4ClassRunner
////@RunWith(SpringRunner.class)

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.statistic.StatisticTotalProductDTO;
import com.iwaodev.application.dto.statistic.StatisticTotalSaleDTO;
import com.iwaodev.application.dto.statistic.StatisticTotalUserDTO;
import com.iwaodev.auth.AuthenticateTestUser;
import com.iwaodev.auth.AuthenticationInfo;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.statistic.TotalProductBaseEnum;
import com.iwaodev.domain.statistic.TotalSaleBaseEnum;
import com.iwaodev.domain.statistic.TotalUserBaseEnum;
import com.iwaodev.domain.user.UserTypeEnum;
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
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;

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
public class AdminStatisticTotalProductsEndpointTest {

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
        String targetUrl = "http://localhost:" + this.port + this.targetPath + "/total/products";

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
    //@Sql(scripts = { "classpath:/integration/statistic/shouldAdminGetHourlyBaseProductData.sql" })
    public void shouldAdminGetEmptyTodayBaseTotalProductData(/*@Value("classpath:/integration/user/shouldAdminGetAllOfItsOwnAddress.json") Resource dummyFormJsonFile*/) throws Exception {

        // make sure user_id in the sql match test admin user id

        // dummy form json
        //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
        //String dummyFormJsonString = dummyFormJson.toString();

        // arrange
        // don't forget start from the previous date (minus 1)
        LocalDateTime expectedDate = LocalDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonth(), LocalDateTime.now().getDayOfMonth(), 0, 0, 0);
        String targetUrl = "http://localhost:" + this.port + this.targetPath + "/total/products";

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
        StatisticTotalProductDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode, StatisticTotalProductDTO[].class);

        // assert
        assertThat(result.getResponse().getStatus()).isEqualTo(200);
        assertThat(responseBody.length).isGreaterThanOrEqualTo(0);
        for (StatisticTotalProductDTO totalProductDTO : responseBody) {
            assertThat(totalProductDTO.getName()).isEqualTo(expectedDate);
            assertThat(totalProductDTO.getProducts()).isEqualTo(BigDecimal.valueOf(0.00));
        }
    }

    @Test
    @Sql(scripts = { "classpath:/integration/statistic/shouldAdminGetTodayBaseTotalProductDataWithTestData.sql" })
    public void shouldAdminGetTodayBaseTotalProductDataWithTestData(/*@Value("classpath:/integration/user/shouldAdminGetAllOfItsOwnAddress.json") Resource dummyFormJsonFile*/) throws Exception {

        // make sure user_id in the sql match test admin user id

        // dummy form json
        //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
        //String dummyFormJsonString = dummyFormJson.toString();

        // arrange
        // don't forget start from the previous date (minus 1)
        LocalDateTime expectedDate = LocalDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonth(), LocalDateTime.now().getDayOfMonth(), 0, 0, 0);
        String targetUrl = "http://localhost:" + this.port + this.targetPath + "/total/products";

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
        StatisticTotalProductDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode, StatisticTotalProductDTO[].class);

        Integer totalAmountForOrder1 = 5; // check order 1 on sql
        Integer totalAmountForOrder2 = 5;// check order 2 on sql
        Integer totalAmountForOrder3 = 5;  // check order 3 on sql
        Integer totalAmountForOrder4 = 5; // check order 4 on sql

        Integer totalCostForFirst = totalAmountForOrder1;
        Integer totalCostForSecond = totalAmountForOrder2;
        Integer totalCostForThird = totalAmountForOrder3 + totalAmountForOrder4;

        LocalDateTime firstDateTime = LocalDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonth(), LocalDateTime.now().getDayOfMonth(), 0, 0, 0);
        LocalDateTime secondDateTime = LocalDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonth(), LocalDateTime.now().getDayOfMonth(), 1, 0, 0);
        LocalDateTime thirdDateTime = LocalDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonth(), LocalDateTime.now().getDayOfMonth(), 2, 0, 0);

        // assert
        assertThat(result.getResponse().getStatus()).isEqualTo(200);
        assertThat(responseBody.length).isGreaterThanOrEqualTo(1);
        for (StatisticTotalProductDTO totalProductDTO : responseBody) {
            if (totalProductDTO.getName().equals(firstDateTime)) {
                assertThat(totalProductDTO.getProducts()).isEqualTo(totalCostForFirst);
            }
            else if (totalProductDTO.getName().equals(secondDateTime)) {
                assertThat(totalProductDTO.getProducts()).isEqualTo(totalCostForSecond);
            }
            else if (totalProductDTO.getName().equals(thirdDateTime)) {
                assertThat(totalProductDTO.getProducts()).isEqualTo(totalCostForThird);
            }
        }
    }

    @Test
    @Sql(scripts = { "classpath:/integration/statistic/shouldAdminGetTodayBaseTotalProductDataWithTestDataWithAmericaVancouverTimeZone.sql" })
    public void shouldAdminGetTodayBaseTotalProductDataWithTestDataWithAmericaVancouverTimeZone(/*@Value("classpath:/integration/user/shouldAdminGetAllOfItsOwnAddress.json") Resource dummyFormJsonFile*/) throws Exception {

        // make sure user_id in the sql match test admin user id

        // dummy form json
        //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
        //String dummyFormJsonString = dummyFormJson.toString();

        // arrange
        // don't forget start from the previous date (minus 1)
        String targetTimeZone = "America/Vancouver";
        ZonedDateTime expectedStartDate = ZonedDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonthValue(), LocalDateTime.now().getDayOfMonth(), 0, 0, 0, 0, ZoneId.of(targetTimeZone));
        ZonedDateTime expectedUTCStartDate = expectedStartDate.withZoneSameInstant(ZoneOffset.UTC);
        ZonedDateTime expectedEndDate = ZonedDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonthValue(), LocalDateTime.now().getDayOfMonth(), LocalDateTime.now().getHour(), LocalDateTime.now().getMinute(), LocalDateTime.now().getSecond(), 0, ZoneId.of(targetTimeZone));
        ZonedDateTime expectedUTCEndDate = expectedEndDate.withZoneSameInstant(ZoneOffset.UTC);
        String queryString = String.format("?startDate=%s&endDate=%s&base=%s", expectedUTCStartDate, expectedUTCEndDate, TotalSaleBaseEnum.TODAY);
        String targetUrl = "http://localhost:" + this.port + this.targetPath + "/total/products" + queryString;

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
        StatisticTotalProductDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode, StatisticTotalProductDTO[].class);

        Integer totalAmountForOrder1 = 5; // check order 1 on sql
        Integer totalAmountForOrder2 = 5;// check order 2 on sql
        Integer totalAmountForOrder3 = 5;  // check order 3 on sql
        Integer totalAmountForOrder4 = 5; // check order 4 on sql

        Integer totalCostForFirst = totalAmountForOrder1;
        Integer totalCostForSecond = totalAmountForOrder2;
        Integer totalCostForThird = totalAmountForOrder3 + totalAmountForOrder4;

        LocalDateTime firstDateTime = LocalDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonth(), LocalDateTime.now().getDayOfMonth(), 0, 0, 0);
        LocalDateTime secondDateTime = LocalDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonth(), LocalDateTime.now().getDayOfMonth(), 1, 0, 0);
        LocalDateTime thirdDateTime = LocalDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonth(), LocalDateTime.now().getDayOfMonth(), 2, 0, 0);

        // assert
        assertThat(result.getResponse().getStatus()).isEqualTo(200);
        assertThat(responseBody.length).isGreaterThanOrEqualTo(1);
        for (StatisticTotalProductDTO totalProductDTO : responseBody) {
            if (totalProductDTO.getName().equals(firstDateTime)) {
                assertThat(totalProductDTO.getProducts()).isEqualTo(totalCostForFirst);
            }
            else if (totalProductDTO.getName().equals(secondDateTime)) {
                assertThat(totalProductDTO.getProducts()).isEqualTo(totalCostForSecond);
            }
            else if (totalProductDTO.getName().equals(thirdDateTime)) {
                assertThat(totalProductDTO.getProducts()).isEqualTo(totalCostForThird);
            }
        }
    }

    @Test
    @Sql(scripts = { "classpath:/integration/statistic/shouldAdminGetThisMonthBaseTotalProductDataWithTestData.sql" })
    public void shouldAdminGetThisMonthBaseTotalProductDataWithTestData(/*@Value("classpath:/integration/user/shouldAdminGetAllOfItsOwnAddress.json") Resource dummyFormJsonFile*/) throws Exception {

        // make sure user_id in the sql match test admin user id

        // dummy form json
        //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
        //String dummyFormJsonString = dummyFormJson.toString();

        // arrange
        // don't forget start from the previous date (minus 1)
        String targetTimeZone = "UTC";
        ZonedDateTime expectedStartDate = ZonedDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonthValue(), 1, 0, 0, 0, 0, ZoneId.of(targetTimeZone));
        ZonedDateTime expectedUTCStartDate = expectedStartDate.withZoneSameInstant(ZoneOffset.UTC);
        ZonedDateTime expectedEndDate = ZonedDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonthValue(), LocalDateTime.now().getDayOfMonth(), LocalDateTime.now().getHour(), LocalDateTime.now().getMinute(), LocalDateTime.now().getSecond(), 0, ZoneId.of(targetTimeZone));
        ZonedDateTime expectedUTCEndDate = expectedEndDate.withZoneSameInstant(ZoneOffset.UTC);
        String queryString = String.format("?startDate=%s&endDate=%s&base=%s", expectedUTCStartDate, expectedUTCEndDate, TotalSaleBaseEnum.THIS_MONTH);
        String targetUrl = "http://localhost:" + this.port + this.targetPath + "/total/products" + queryString;

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
        StatisticTotalProductDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode, StatisticTotalProductDTO[].class);

        Integer totalAmountForOrder1 = 5; // check order 1 on sql
        Integer totalAmountForOrder2 = 5;// check order 2 on sql
        Integer totalAmountForOrder3 = 5;  // check order 3 on sql
        Integer totalAmountForOrder4 = 5; // check order 4 on sql

        Integer totalCostForFirst = totalAmountForOrder1;
        Integer totalCostForSecond = totalAmountForOrder2;
        Integer totalCostForThird = totalAmountForOrder3 + totalAmountForOrder4;

        LocalDateTime firstDateTime = LocalDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonth(), 1, 0, 0, 0);
        LocalDateTime secondDateTime = LocalDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonth(), 15, 0, 0, 0);
        LocalDateTime thirdDateTime = LocalDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonth(), 20, 0, 0, 0);

        // assert
        assertThat(result.getResponse().getStatus()).isEqualTo(200);
        assertThat(responseBody.length).isGreaterThanOrEqualTo(3);
        for (StatisticTotalProductDTO totalProductDTO : responseBody) {
            if (totalProductDTO.getName().equals(firstDateTime)) {
                assertThat(totalProductDTO.getProducts()).isEqualTo(totalCostForFirst);
            }
            else if (totalProductDTO.getName().equals(secondDateTime)) {
                assertThat(totalProductDTO.getProducts()).isEqualTo(totalCostForSecond);
            }
            else if (totalProductDTO.getName().equals(thirdDateTime)) {
                assertThat(totalProductDTO.getProducts()).isEqualTo(totalCostForThird);
            }
        }
    }

    @Test
    @Sql(scripts = { "classpath:/integration/statistic/shouldAdminGetThisYearBaseTotalProductDataWithTestData.sql" })
    public void shouldAdminGetThisYearBaseTotalProductDataWithTestData(/*@Value("classpath:/integration/user/shouldAdminGetAllOfItsOwnAddress.json") Resource dummyFormJsonFile*/) throws Exception {

        // make sure user_id in the sql match test admin user id

        // dummy form json
        //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
        //String dummyFormJsonString = dummyFormJson.toString();

        // arrange
        // don't forget start from the previous date (minus 1)

        String targetTimeZone = "UTC";
        ZonedDateTime expectedStartDate = ZonedDateTime.of(LocalDateTime.now().getYear(), 1, 1, 0, 0, 0, 0, ZoneId.of(targetTimeZone));
        ZonedDateTime expectedUTCStartDate = expectedStartDate.withZoneSameInstant(ZoneOffset.UTC);
        ZonedDateTime expectedEndDate = ZonedDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonthValue(), LocalDateTime.now().getDayOfMonth(), LocalDateTime.now().getHour(), LocalDateTime.now().getMinute(), LocalDateTime.now().getSecond(), 0, ZoneId.of(targetTimeZone));
        ZonedDateTime expectedUTCEndDate = expectedEndDate.withZoneSameInstant(ZoneOffset.UTC);
        String queryString = String.format("?startDate=%s&endDate=%s&base=%s", expectedUTCStartDate, expectedUTCEndDate, TotalSaleBaseEnum.THIS_YEAR);

        String targetUrl = "http://localhost:" + this.port + this.targetPath + "/total/products" + queryString;

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
        StatisticTotalProductDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode, StatisticTotalProductDTO[].class);

        Integer totalAmountForOrder1 = 5; // check order 1 on sql
        Integer totalAmountForOrder2 = 5;// check order 2 on sql
        Integer totalAmountForOrder3 = 5;  // check order 3 on sql
        Integer totalAmountForOrder4 = 5; // check order 4 on sql

        Integer totalCostForFirst = totalAmountForOrder1;
        Integer totalCostForSecond = totalAmountForOrder2;
        Integer totalCostForThird = totalAmountForOrder3 + totalAmountForOrder4;

        LocalDateTime firstDateTime = LocalDateTime.of(LocalDateTime.now().getYear(), 1, 1, 0, 0, 0);
        LocalDateTime secondDateTime = LocalDateTime.of(LocalDateTime.now().getYear(), 3, 15, 0, 0, 0);
        LocalDateTime thirdDateTime = LocalDateTime.of(LocalDateTime.now().getYear(), 4, 20, 0, 0, 0);

        // assert
        assertThat(result.getResponse().getStatus()).isEqualTo(200);
        assertThat(responseBody.length).isGreaterThanOrEqualTo(3);
        for (StatisticTotalProductDTO totalProductDTO : responseBody) {
            logger.debug(totalProductDTO.getName().toString());
            logger.debug(totalProductDTO.getProducts().toString());
            if (totalProductDTO.getName().getMonth().equals(firstDateTime.getMonth())) {
                assertThat(totalProductDTO.getProducts()).isEqualTo(totalCostForFirst);
            }
            else if (totalProductDTO.getName().getMonth().equals(secondDateTime.getMonth())) {
                assertThat(totalProductDTO.getProducts()).isEqualTo(totalCostForSecond);
            }
            else if (totalProductDTO.getName().getMonth().equals(thirdDateTime.getMonth())) {
                assertThat(totalProductDTO.getProducts()).isEqualTo(totalCostForThird);
            }
        }
    }
}
