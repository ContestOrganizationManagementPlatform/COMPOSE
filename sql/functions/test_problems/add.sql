
CREATE OR REPLACE FUNCTION add_test_problem(p_problem_id bigint, p_test_id bigint)
RETURNS void
LANGUAGE plpgsql
AS $$
  DECLARE
    cur_max int;
  BEGIN
    SELECT max(test_problems.problem_number)
    INTO cur_max
    FROM test_problems
    WHERE test_problems.test_id = p_test_id;

    -- prevent null if there are no problems
    cur_max = coalesce(cur_max, -1);

    cur_max = cur_max+1;

    INSERT INTO test_problems (problem_id, test_id, problem_number)
    VALUES (p_problem_id, p_test_id, cur_max);
  END
$$
