
CREATE TABLE users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    discord text,
    initials text
);

CREATE TABLE user_roles (
    user_id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    role int4
);

CREATE TABLE problems (
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

CREATE TABLE tournaments (
    id int8 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    tournament_name text NOT NULL,
    tournament_date date
);

CREATE TABLE tests (
    id int8 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    test_name text NOT NULL,
    test_description text,
    tournament_id int8 REFERENCES public.tournaments(id) ON DELETE CASCADE
);

CREATE TABLE test_problems (
    relation_id int8 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    problem_id int8 REFERENCES public.problems(id) ON DELETE CASCADE,
    test_id int8 REFERENCES public.tests(id) ON DELETE CASCADE NOT NULL,
    problem_number int4
);

CREATE TABLE test_coordinators (
    relation_id int8 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    coordinator_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    test_id int8 REFERENCES public.tests(id) ON DELETE CASCADE
);

CREATE TABLE global_topics (
    id int8 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    topic text,
    topic_short text
);

CREATE TABLE problem_topics (
    id int8 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    problem_id int8 REFERENCES public.problems(id) ON DELETE CASCADE,
    topic_id int8 REFERENCES public.global_topics(id) ON DELETE CASCADE
);


