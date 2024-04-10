import 'dotenv/config';
import authController from '../controllers/authController.js';

// describe('authController signup function', () => {
//   it('should return success message for valid signup', async () => {
//     const req = { body: { email: 'test.test@test.test', password: 'Test1234@', confirmation: 'Test1234@' } };
//     const res = {
//       status() {
//         return this;
//       },
//       json() {
//         return this;
//       }
//     };

//     await authController.signup(req, res);
//     console.log('ici');
//     expect(res.status).toHaveBeenCalledWith(201);
//     expect(res.json).toHaveBeenCalledWith({ successMessage: expect.any(String) });
//   });

//   // Add more test cases for different scenarios
// });

describe('authController login function', () => {
  it('should return token for valid login', async () => {
    const req = { body: { email: 'test.test@test.test', password: 'Test1234@' } };
    const res = {
      status: () => ({ json: () => {} }),
      json: () => {}
    };

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ token: expect.any(String), user: expect.any(String) });
  });

// Add more test cases for different scenarios
});
