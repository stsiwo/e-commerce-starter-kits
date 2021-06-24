package com.iwaodev.application.iservice;

import java.util.UUID;

import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.domain.user.UserSortEnum;
import com.iwaodev.ui.criteria.user.UserCriteria;
import com.iwaodev.ui.criteria.user.UserDeleteTempCriteria;
import com.iwaodev.ui.criteria.user.UserQueryStringCriteria;
import com.iwaodev.ui.criteria.user.UserStatusCriteria;

import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {

  public Page<UserDTO> getAll(UserQueryStringCriteria criteria, Integer page, Integer limit, UserSortEnum sort) throws Exception;

  public UserDTO getById(UUID id) throws Exception;

  public UserDTO update(UserCriteria criteria, UUID id) throws Exception;

  public UserDTO updateStatus(UserStatusCriteria criteria) throws Exception;

  public void delete(UUID id) throws Exception;

  public void tempDelete(UserDeleteTempCriteria criteria, UUID id) throws Exception;

  public String uploadAvatarImage(UUID userId, MultipartFile file) throws Exception;

  public void removeAvatarImage(UUID userId) throws Exception;

  public byte[] getAvatarImage(UUID userId, String imageName) throws Exception;

  /**
   * check a user try to access its own data or other's data.
   *  - if same, return true.
   *  - if not, return false
   **/
  @Deprecated
  public boolean isSameAsAuthenticatedUser(User authUser, UUID id) throws Exception;

}
