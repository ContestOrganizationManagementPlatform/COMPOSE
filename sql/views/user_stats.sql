create or replace view
  public.user_stats as
select
  users.id,
  users.discord_id,
  users.full_name as name,
  count(*) as problem_count,
  sum(full_problems.unresolved_count) as unresolved_count
from
  full_problems
  left join users on users.id = full_problems.author_id
group by
  users.id;