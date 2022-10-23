
CREATE OR REPLACE VIEW full_problems AS
  SELECT
    problems.*,
    users.full_name,
    users.initials || COUNT(*) OVER(PARTITION BY users.initials ORDER BY problems.id) AS front_id,
    topics.topics,
    topics.topics_short,
    tests.test_name AS test_name,
    COALESCE(unresolved_count.count, 0) AS unresolved_count
  FROM
    problems
    LEFT JOIN users ON users.id = problems.author_id
    LEFT JOIN test_problems ON test_problems.problem_id = problems.id
    LEFT JOIN tests ON test_problems.test_id = tests.id

    -- make the topic into a comma separated string
    LEFT JOIN (
      SELECT 
        problem_topics.problem_id, 
        string_agg(global_topics.topic, ', ') AS topics, 
        string_agg(global_topics.topic_short, ', ') AS topics_short
      FROM
        problem_topics
        JOIN global_topics ON problem_topics.topic_id = global_topics.id
      GROUP BY problem_topics.problem_id
    ) AS topics ON problems.id = topics.problem_id

    -- count unresolved problems
    LEFT JOIN (
      SELECT 
        testsolve_answers.problem_id,
        COUNT(*) AS count
      FROM testsolve_answers
      WHERE
        testsolve_answers.resolved IS FALSE AND
        (testsolve_answers.feedback = '') IS FALSE
      GROUP BY testsolve_answers.problem_id
    ) AS unresolved_count ON problems.id = unresolved_count.problem_id;

ALTER VIEW full_problems OWNER TO authenticated; -- necessary to get rls to work!
