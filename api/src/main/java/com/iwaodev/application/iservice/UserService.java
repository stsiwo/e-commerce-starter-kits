package com.iwaodev.application.iservice;

import java.util.UUID;

import com.iwaodev.application.dto.user.UserDTO;
import com.iwaodev.domain.user.UserSortEnum;
import com.iwaodev.ui.criteria.UserCriteria;
import com.iwaodev.ui.criteria.UserDeleteTempCriteria;
import com.iwaodev.ui.criteria.UserQueryStringCriteria;

import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {

  public Page<UserDTO> getAll(UserQueryStringCriteria criteria, Integer page, Integer limit, UserSortEnum sort);

  public UserDTO getById(UUID id);

  public UserDTO update(UserCriteria criteria, UUID id);

  public void delete(UUID id);

  public void tempDelete(UserDeleteTempCriteria criteria, UUID id);

  public String uploadAvatarImage(UUID userId, MultipartFile file);

  public void removeAvatarImage(UUID userId);

  public byte[] getAvatarImage(UUID userId, String imageName);

  /**
   * check a user try to access its own data or other's data.
   *  - if same, return true.
   *  - if not, return false
   **/
  @Deprecated
  public boolean isSameAsAuthenticatedUser(User authUser, UUID id);

}
