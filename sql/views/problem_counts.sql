
CREATE OR REPLACE VIEW problem_counts AS
  SELECT 
    global_topics.topic AS category,
    COUNT(*) AS problem_count
  FROM
    problem_topics
    LEFT JOIN global_topics ON global_topics.id = problem_topics.topic_id
  GROUP BY global_topics.topic
  UNION ALL
  SELECT 
    '*' AS category, 
    COUNT(*) AS problem_count
  FROM
    problems;

ALTER VIEW problem_counts OWNER TO authenticated; -- necessary to get rls to work!
