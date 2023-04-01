/**
 * @param {{
 *   userService: UserService,
 *   method: string,
 *   path: string,
 *   request: {
 *     body: {
 *       users: [{nickname: string, email:string}],
 *     },
 *   },
 * }} ctx
 * @returns {Promise<void>}
 * @constructor
 */
export const PutUsersController = async (ctx) => {
  const { method, path } = ctx;
  const { users } = ctx.request.body;
  if (!/^PUT \/users$/.test(`${method} ${path}`)) {
    return;
  }

  // const results = await Promise.all(users.map((user) => ctx.userService.add(user)));
  const results = await ctx.userService.addMultiple(users);

  ctx.body = {
    results,
  };
};
