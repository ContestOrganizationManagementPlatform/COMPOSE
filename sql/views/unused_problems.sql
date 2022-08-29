
CREATE OR REPLACE VIEW unused_problems AS
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

ALTER VIEW unused_problems OWNER TO authenticated; -- necessary to get rls to work!
