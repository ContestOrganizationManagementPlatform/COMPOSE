
CREATE OR REPLACE VIEW full_problems AS
  SELECT
    problems.*,
    users.full_name,
    users.initials || COUNT(*) OVER(PARTITION BY users.initials ORDER BY problems.id) AS front_id,
    topics.topics,
    topics.topics_short,
    tests.test_name AS test_name
  FROM
    problems
    LEFT JOIN users ON users.id = problems.author_id
    LEFT JOIN test_problems ON test_problems.problem_id = problems.id
    LEFT JOIN tests ON test_problems.test_id = tests.id
    LEFT JOIN (
      SELECT 
        problem_topics.problem_id, 
        string_agg(global_topics.topic, ', ') AS topics, 
        string_agg(global_topics.topic_short, ', ') AS topics_short
      FROM
        problem_topics
        JOIN global_topics ON problem_topics.topic_id = global_topics.id
      GROUP BY problem_topics.problem_id
    ) AS topics ON problems.id = topics.problem_id;

ALTER VIEW full_problems OWNER TO authenticated; -- necessary to get rls to work!
