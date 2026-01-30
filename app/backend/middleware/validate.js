import { validationResult, matchedData } from "express-validator";

const format = ({ location, msg, param }) => ({
  field: `${location}.${param}`,
  message: msg,
});

export const validate = (rules) => async (req, res, next) => {
  await Promise.all(rules.map((r) => (r.run ? r.run(req) : r(req))));

  const result = validationResult(req).formatWith(format);
  if (!result.isEmpty()) {
    return res.status(422).json({
      ok: false,
      message: "Input validation error.",
      validationsErrors: result.array({ onlyFirstError: true }),
    });
  }

  req.validated = matchedData(req, {
    locations: ["body", "params", "query"],
    includeOptionals: true,
  });

  next();
};
