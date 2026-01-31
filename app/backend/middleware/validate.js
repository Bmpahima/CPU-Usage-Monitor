import { validationResult, matchedData } from "express-validator";

const format = ({ location, msg, param }) => ({
  field: `${location}.${param}`,
  message: msg,
});

export const validate = (rules) => async (req, res, next) => {
  await Promise.all(rules.map((r) => (r.run ? r.run(req) : r(req))));

  const result = validationResult(req).formatWith(format);
  if (!result.isEmpty()) {
    let inputValidationErrorMessage = "Input validation error:\n";

    console.log(result.errors);
    result.errors.forEach((err) => {
      inputValidationErrorMessage += err.msg + "\n";
    });

    return res.status(422).json({
      ok: false,
      message: inputValidationErrorMessage,
    });
  }

  req.validated = matchedData(req, {
    locations: ["body", "params", "query"],
    includeOptionals: true,
  });

  next();
};
