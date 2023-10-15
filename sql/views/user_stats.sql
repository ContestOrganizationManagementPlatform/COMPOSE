CREATE OR REPLACE VIEW
  public.user_stats as
select
  users.id,
  users.discord_id,
  users.full_name as name,
  count(*) as problem_count
from
  problems
  left join users on users.id = problems.author_id
group by
  users.id;