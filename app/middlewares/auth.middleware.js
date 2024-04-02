import jwt from 'jsonwebtoken';

const auth = {
  isAuth(req, res, next) {
    // On récupère le token depuis les cookies
    const { token } = req.cookies;

    // On vérifie la signature du token
    if (token) {
      jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err) => {
        if (err) {
          res.status(400).clearCookie('token').json({ errorMessage: 'Session expirée, veuillez vous reconnecter' });
          return;
        }
        next();
      });
    } else {
      next();
    }
  },
};

export default auth;
