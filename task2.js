/**
 * ---------------------------
 * Current Process
 * ---------------------------
 * 1. find user.
 *    if user exists:
  *    check directory if user is stored in directory
  *      return an object with a boolean flag of is_registered
 * 2. if user does not exist
 *    Enroll user (user is not registered in directory)
 * 4. if user is not registered in directory
 *    register user
 *
 * ---------------------------
 * Optimized process
 * ---------------------------
 * The register function is currently doing more than needed, so we
 * split its concerns into --enroll-- and --register-- functions
 *
 * 1. find a user. If it doesn't exist, enroll user.
 * 2. Now that we have a user, find user in directory. if it doesn't exist:
 *    create in directory and update User table
 * 3. return user
 */
user.enroll = async function () {
  try {
    const creds = await Enrolment.enrollUser(AdminUsername, AdminPassword);
    const { private_key, public_key } = GPG.generateKeypair();

    const userPayload = new this({
      name: 'John Doe',
      identity: {
        type: creds['type'],
        certificate: creds['certificate'],
        private_key: creds['privateKey'],
        public_key: creds['publicKey']
      },
      keypair: { private_key, public_key }
    });

    return await userPayload.save();
  } catch(err) {
    throw new Error('Unable to enroll user', err.stack);
  }
};

user.register = async function () {
  try {
    const enrollee = await this.findOne({}) || await this.enroll();
    let user = await Directory.getUser(enrollee.id);

    if (!user) {
      user = await Directory.createUser(enrollee);

      const payload = { name: user.name }
      const options = {
        upsert: true,
        setDefaultsOnInsert: true,
        userFindAndModify: false
      };
      await User.findOneAndUpdate({ _id: user.id }, payload, options);
    }

    return user;
  } catch(err) {
    throw new Error('Unable to register user', err.stack);
  }
};
