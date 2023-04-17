
CREATE OR REPLACE FUNCTION reorder_test_problem(p_problem_id bigint, p_new_number int, cur_test_id bigint)
RETURNS void
LANGUAGE plpgsql
AS $$
  DECLARE
    old_problem_number int;
  BEGIN
    SELECT problem_number
    INTO old_problem_number
    FROM test_problems
    WHERE problem_id = p_problem_id AND test_id = cur_test_id;

    IF found THEN
      IF p_new_number > old_problem_number THEN
        UPDATE test_problems
        SET problem_number = problem_number-1
        WHERE test_id = cur_test_id AND problem_number > old_problem_number AND problem_number <= p_new_number;
      ELSE
        UPDATE test_problems
        SET problem_number = problem_number+1
        WHERE test_id = cur_test_id AND problem_number >= p_new_number AND problem_number < old_problem_number;
      END IF;
      
      UPDATE test_problems
      SET problem_number = p_new_number
      WHERE problem_id = p_problem_id AND test_id = cur_test_id;
    END IF;
  END
$$
