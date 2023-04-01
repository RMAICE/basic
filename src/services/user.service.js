import { UserListRepo } from '../repo/user-list.repo';

export class UserService {
  /**
   * @param {RepositoryService} repositoryService
   * @param {EmailService} emailService
   */
  constructor({ repositoryService, emailService }) {
    this.repositoryService = repositoryService;
    this.emailService = emailService;
  }

  /**
   *
   * @param {string} nickname
   * @param {string} email
   * @returns {Promise<Object>}
   */
  async add({ nickname, email }) {
    return this.repositoryService.transaction([UserListRepo], async ({ userList }) => {
      const userId = await userList.insert({ nickname });
      const emailId = await this.emailService.add({ email });

      return { userId, emailId };
    });
  }

  addMultiple(users) {
    return this.repositoryService.transaction([UserListRepo], async ({ userList }) => {
      const [userIds, emailIds] = await Promise.all([
        Promise.all(users.map(({ nickname }) => userList.insert({ nickname }))),
        Promise.all(users.map(({ email }) => this.emailService.add({ email }))),
      ]);

      return userIds.map((userId, i) => ({ userId, emailId: emailIds[i] }));
    });
  }
}
