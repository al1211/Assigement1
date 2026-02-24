const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed; // sanitized & validated
    next();
  } catch (error) {
    const errorDetails = error.issues || error.details || [];
    return res.status(422).json({
      error: {
        name:"dhie",
        code: "VALIDATION_ERROR",
        message: "Invalid input data",
        details: errorDetails.map((err) => ({
          field: err.path.join("."),
          message: err.message
        }))
      }
    });
  }
};

export default validate