CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
AS $$
    begin
        insert into public.users (id)
        values (new.id, null, new.email, null);
        return new;
    end;
$$
