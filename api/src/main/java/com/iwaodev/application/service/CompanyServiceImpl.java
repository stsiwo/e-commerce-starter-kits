package com.iwaodev.application.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.iwaodev.application.dto.company.CompanyDTO;
import com.iwaodev.application.dto.company.PublicCompanyDTO;
import com.iwaodev.application.irepository.UserRepository;
import com.iwaodev.application.iservice.CompanyService;
import com.iwaodev.application.mapper.CompanyMapper;
import com.iwaodev.exception.AppException;
import com.iwaodev.infrastructure.model.Company;
import com.iwaodev.infrastructure.model.Phone;
import com.iwaodev.infrastructure.model.User;
import com.iwaodev.ui.criteria.user.UserCompanyCriteria;

import com.iwaodev.util.Util;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;

@Service
@Transactional
public class CompanyServiceImpl implements CompanyService {

  private static final Logger logger = LoggerFactory.getLogger(CompanyServiceImpl.class);

  @Autowired
  private UserRepository repository;

  @Autowired
  private HttpServletRequest httpServletRequest;

  public List<CompanyDTO> get(UUID userId) throws Exception {
    logger.debug("start handling a request at UserCompanyServiceImpl");

    Optional<User> targetUserOption = this.repository.findById(userId);

    if (!targetUserOption.isPresent()) {
      logger.debug("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    // use this rather than the list method since @Mapping for the list does not
    // work.
    //
    /**
     * a user can have mutlipel companies but in this use case, only admin user can
     * have a single company so be careful.
     **/
    User targetEntity = targetUserOption.get();

    return targetEntity.getCompanies().stream().map(new Function<Company, CompanyDTO>() {

      @Override
      public CompanyDTO apply(Company company) {
        return CompanyMapper.INSTANCE.toCompanyDTO(company);
      }
    }).collect(Collectors.toList());

    // return
    // CompanyMapper.INSTANCE.toCompanyDTOList(targetUserOption.get().getCompanyes());

  }

  @Override
  public CompanyDTO update(UserCompanyCriteria criteria, UUID userId, Long companyId) throws Exception {

    // make sure criteria.companyId is assigned
    // - criteria.companyId does not have validation since it is shared with /post
    // endpoint.
    if (criteria.getCompanyId() == null) {
      criteria.setCompanyId(companyId);
    }

    // check if the target user exist
    Optional<User> targetUserOption = this.repository.findById(userId);

    if (!targetUserOption.isPresent()) {
      logger.debug("the given user does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given user does not exist.");
    }

    // check the user has the company of a given id
    boolean isTargetCompanyExist = targetUserOption.get().getCompanies().stream().anyMatch(company -> {
      return company.getCompanyId().equals(companyId);
    });

    if (!isTargetCompanyExist) {
      logger.debug("the given company does not exist");
      throw new AppException(HttpStatus.NOT_FOUND, "the given company does not exist.");
    }

    Company targetCompany = targetUserOption.get().findCompany(companyId);

    // version check for concurrency update
    String receivedVersion = this.httpServletRequest.getHeader("If-Match");
    if (receivedVersion == null || receivedVersion.isEmpty()) {
      throw new AppException(HttpStatus.BAD_REQUEST, "you are missing version (If-Match) header.");
    }
    if (!Util.checkETagVersion(targetCompany.getVersion(), receivedVersion)) {
      throw new AppException(HttpStatus.PRECONDITION_FAILED, "the data was updated by others. please refresh.");
    };

    // create updated entity
    // issue-k0rdIGEQ91U
    Company updateCompany = CompanyMapper.INSTANCE.toCompanyEntityFromCompanyCriteria(criteria);
    targetUserOption.get().updateCompany(companyId, updateCompany);

    // save it
    User targetUser;
    try {
      // don't forget flush otherwise version number is updated.
      targetUser = this.repository.saveAndFlush(targetUserOption.get());
    } catch (OptimisticLockingFailureException ex) {
      throw new AppException(HttpStatus.CONFLICT, "the data was updated by others. please refresh.");
    }

    logger.debug("after saved: " + targetUser.getVersion());

    return CompanyMapper.INSTANCE.toCompanyDTO(targetUser.findCompany(companyId));
  }

  @Override
  public PublicCompanyDTO publicGet() throws Exception {

    // get admin
    User admin = this.repository.getAdmin().orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "admin not found."));

    // get company
    Company company = admin.getCompanies().get(0);

    return CompanyMapper.INSTANCE.toPublicCompanyDTO(company);


  }

}
