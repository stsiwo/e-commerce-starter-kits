package com.iwaodev.integration.statistic;

// this is alias to SpringJUnit4ClassRunner
////@RunWith(SpringRunner.class)

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iwaodev.application.dto.statistic.StatisticTopProductDTO;
import com.iwaodev.application.dto.statistic.StatisticTotalProductDTO;
import com.iwaodev.auth.AuthenticateTestUser;
import com.iwaodev.auth.AuthenticationInfo;
import com.iwaodev.data.BaseDatabaseSetup;
import com.iwaodev.domain.statistic.TotalProductBaseEnum;
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
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

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
public class AdminStatisticTopProductsEndpointTest {

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
        String targetUrl = "http://localhost:" + this.port + this.targetPath + "/top/products";

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
    @Sql(scripts = { "classpath:/integration/statistic/shouldAdminGetTopProductDataWithTestData.sql" })
    public void shouldAdminGetTopProductDataWithTestData(/*@Value("classpath:/integration/user/shouldAdminGetAllOfItsOwnAddress.json") Resource dummyFormJsonFile*/) throws Exception {

        // make sure user_id in the sql match test admin user id

        // dummy form json
        //JsonNode dummyFormJson = this.objectMapper.readTree(this.resourceReader.asString(dummyFormJsonFile));
        //String dummyFormJsonString = dummyFormJson.toString();

        // arrange
        // don't forget start from the previous date (minus 1)
        String targetUrl = "http://localhost:" + this.port + this.targetPath + "/top/products";

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
        StatisticTopProductDTO[] responseBody = this.objectMapper.treeToValue(contentAsJsonNode, StatisticTopProductDTO[].class);

        Integer productOneTotalSoldCount = 50 + 2 + 9 + 12 + 10; // 83.  see sql
        Integer productTwoTotalSoldCount = 11 + 3 + 1 + 50; // 65. see sql
        Integer productThreeTotalSoldCount = 1 + 3 + 0 + 0; // 4. see sql
        Integer productFourTotalSoldCount = 11 + 8 + 10 + 20; // 49. see sql
        Integer productFiveTotalSoldCount = 0 + 2 + 20 + 10; // 32. see sql

        Map<Integer, Integer> expectedResultMap = new HashMap<>();
        //expectedResultMap.put(0, UUID.fromString("9e3e67ca-d058-41f0-aad5-4f09c956a81f"));
        //expectedResultMap.put(1, UUID.fromString("773f1fc7-c037-447a-a5b2-f790ea2302e5"));
        //expectedResultMap.put(3, UUID.fromString("a362bbc3-5c70-4e82-96d3-5fa1e3103332"));
        //expectedResultMap.put(4, UUID.fromString("de7e767d-cd0c-4705-b633-353b2340715b"));
        //expectedResultMap.put(2, UUID.fromString("db600487-5142-4121-8b3f-237c2d883c14"));
        expectedResultMap.put(0, productOneTotalSoldCount);
        expectedResultMap.put(1, productTwoTotalSoldCount);
        expectedResultMap.put(4, productThreeTotalSoldCount);
        expectedResultMap.put(2, productFourTotalSoldCount);
        expectedResultMap.put(3, productFiveTotalSoldCount);

        // assert
        assertThat(result.getResponse().getStatus()).isEqualTo(200);
        assertThat(responseBody.length).isGreaterThanOrEqualTo(5);

        for (int i = 0; i < responseBody.length; i++) {
            if (i + 1 < responseBody.length) {
                assertThat(responseBody[i].getProductId()).isNotNull();
                assertThat(responseBody[i].getProductName()).isNotNull();
                assertThat(expectedResultMap.get(i)).isEqualTo(responseBody[i].getSoldCount());
                assertThat(responseBody[i].getSoldCount()).isGreaterThanOrEqualTo(responseBody[i+1].getSoldCount());
            }
        }
    }
}
