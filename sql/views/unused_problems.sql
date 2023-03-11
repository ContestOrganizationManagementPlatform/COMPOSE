
CREATE OR REPLACE VIEW unused_problems WITH (security_invoker)  AS
  SELECT
    *
  FROM
    full_problems
  WHERE NOT EXISTS (
    SELECT 1 FROM test_problems 
    WHERE
      test_problems.problem_id = full_problems.id AND
      test_problems.test_id IS NOT NULL
  );
  