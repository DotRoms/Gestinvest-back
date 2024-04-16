export default (controller) => async (req, res, next) => {
  try {
    return await controller(req, res, next);
  } catch (err) {
    console.error(err);
    return res.json({ errorMessage: err.message });
  }
};
