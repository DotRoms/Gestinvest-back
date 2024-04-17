export default (controller) => async (req, res, next) => {
  try {
    return await controller(req, res, next);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ errorMessage: err.message });
  }
};
