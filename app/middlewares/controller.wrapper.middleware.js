export default (controller) => async (req, res, next) => {
  try {
    return await controller(req, res, next);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errorMessage: 'internal server error' });
  }
};
