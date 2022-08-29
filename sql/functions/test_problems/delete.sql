
CREATE OR REPLACE FUNCTION delete_test_problem(p_problem_id bigint)
RETURNS void
LANGUAGE plpgsql
AS $$
  DECLARE
    cur_problem_number int;
    cur_test_id bigint;
  BEGIN
    SELECT problem_number, test_id
    INTO cur_problem_number, cur_test_id
    FROM test_problems
    WHERE problem_id = p_problem_id;

    IF found THEN
      UPDATE test_problems
      SET problem_number = problem_number-1
      WHERE test_id = cur_test_id AND problem_number > cur_problem_number;

      DELETE FROM test_problems
      WHERE problem_id = p_problem_id;
    END IF;
  END
$$
