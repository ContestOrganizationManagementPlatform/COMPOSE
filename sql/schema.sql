
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    discord text,
    email text,
    initials text,
    math_comp_background text,
    amc_score int2
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    role int4
);

CREATE TABLE IF NOT EXISTS problems (
    id int8 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at timestamptz DEFAULT now(),
    author_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL DEFAULT uid(),
    problem_latex text,
    answer_latex text,
    solution_latex text,
    difficulty int4,
    sub_topics text,
    nickname text,
    comment_latex text,
    edited_at timestamptz
);

CREATE TABLE IF NOT EXISTS tournaments (
    id int8 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    tournament_name text NOT NULL,
    tournament_date date
);

CREATE TABLE IF NOT EXISTS tests (
    id int8 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    test_name text NOT NULL,
    test_description text,
    tournament_id int8 REFERENCES public.tournaments(id) ON DELETE CASCADE,
    test_version text
);

CREATE TABLE IF NOT EXISTS test_problems (
    relation_id int8 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    problem_id int8 REFERENCES public.problems(id) ON DELETE CASCADE,
    test_id int8 REFERENCES public.tests(id) ON DELETE CASCADE NOT NULL,
    problem_number int4
);

CREATE TABLE IF NOT EXISTS test_coordinators (
    relation_id int8 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    coordinator_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    test_id int8 REFERENCES public.tests(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS global_topics (
    id int8 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    topic text,
    topic_short text
);

CREATE TABLE IF NOT EXISTS problem_topics (
    id int8 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    problem_id int8 REFERENCES public.problems(id) ON DELETE CASCADE,
    topic_id int8 REFERENCES public.global_topics(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS testsolvers (
    id int8 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    test_id int8 REFERENCES public.tests(id) ON DELETE CASCADE NOT NULL,
    solver_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE IF NOT EXISTS testsolves (
    id int8 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    test_id int8 REFERENCES public.tests(id) ON DELETE CASCADE NOT NULL,
    solver_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    start_time timestamptz,
    end_time timestamptz,
    feedback text,
    completed bool NOT NULL DEFAULT true,
    test_version text -- version of the test when the testsolve was completed
);

CREATE TABLE IF NOT EXISTS testsolve_answers (
    id int8 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    testsolve_id int8 REFERENCES public.testsolves(id) ON DELETE CASCADE NOT NULL,
    problem_id int8 REFERENCES public.problems(id) ON DELETE SET NULL,
    answer text,
    feedback text,
    correct bool,
    resolved bool NOT NULL DEFAULT false
);

-- add resolved, difficulty
ALTER TABLE testsolve_answers
    ADD COLUMN IF NOT EXISTS difficulty int4,
    ADD COLUMN IF NOT EXISTS resolved bool
    