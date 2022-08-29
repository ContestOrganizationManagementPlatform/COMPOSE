
CREATE OR REPLACE VIEW front_ids AS
  SELECT 
    problems.id AS problem_id, 
    users.initials || COUNT(*) OVER(PARTITION BY users.initials ORDER BY problems.id) AS front_id
  FROM
    problems
    LEFT JOIN users ON users.id = problems.author_id;

ALTER VIEW front_ids OWNER TO authenticated; -- necessary to get rls to work!
