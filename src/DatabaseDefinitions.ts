export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	public: {
		Tables: {
			global_topics: {
				Row: {
					id: number;
					topic: string | null;
					topic_short: string | null;
				};
				Insert: {
					id?: never;
					topic?: string | null;
					topic_short?: string | null;
				};
				Update: {
					id?: never;
					topic?: string | null;
					topic_short?: string | null;
				};
				Relationships: [];
			};
			problem_topics: {
				Row: {
					id: number;
					problem_id: number | null;
					topic_id: number | null;
				};
				Insert: {
					id?: never;
					problem_id?: number | null;
					topic_id?: number | null;
				};
				Update: {
					id?: never;
					problem_id?: number | null;
					topic_id?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "problem_topics_problem_id_fkey";
						columns: ["problem_id"];
						referencedRelation: "problems";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "problem_topics_problem_id_fkey";
						columns: ["problem_id"];
						referencedRelation: "front_ids";
						referencedColumns: ["problem_id"];
					},
					{
						foreignKeyName: "problem_topics_problem_id_fkey";
						columns: ["problem_id"];
						referencedRelation: "full_problems";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "problem_topics_problem_id_fkey";
						columns: ["problem_id"];
						referencedRelation: "unused_problems";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "problem_topics_topic_id_fkey";
						columns: ["topic_id"];
						referencedRelation: "global_topics";
						referencedColumns: ["id"];
					}
				];
			};
			problems: {
				Row: {
					answer_latex: string | null;
					archived: boolean;
					author_id: string;
					comment_latex: string | null;
					created_at: string | null;
					difficulty: number | null;
					edited_at: string | null;
					id: number;
					nickname: string | null;
					problem_latex: string | null;
					solution_latex: string | null;
					sub_topics: string | null;
				};
				Insert: {
					answer_latex?: string | null;
					archived?: boolean;
					author_id?: string;
					comment_latex?: string | null;
					created_at?: string | null;
					difficulty?: number | null;
					edited_at?: string | null;
					id?: never;
					nickname?: string | null;
					problem_latex?: string | null;
					solution_latex?: string | null;
					sub_topics?: string | null;
				};
				Update: {
					answer_latex?: string | null;
					archived?: boolean;
					author_id?: string;
					comment_latex?: string | null;
					created_at?: string | null;
					difficulty?: number | null;
					edited_at?: string | null;
					id?: never;
					nickname?: string | null;
					problem_latex?: string | null;
					solution_latex?: string | null;
					sub_topics?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "problems_author_id_fkey";
						columns: ["author_id"];
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "problems_author_id_fkey";
						columns: ["author_id"];
						referencedRelation: "user_stats";
						referencedColumns: ["id"];
					}
				];
			};
			test_coordinators: {
				Row: {
					coordinator_id: string | null;
					relation_id: number;
					test_id: number | null;
				};
				Insert: {
					coordinator_id?: string | null;
					relation_id?: never;
					test_id?: number | null;
				};
				Update: {
					coordinator_id?: string | null;
					relation_id?: never;
					test_id?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "test_coordinators_coordinator_id_fkey";
						columns: ["coordinator_id"];
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "test_coordinators_coordinator_id_fkey";
						columns: ["coordinator_id"];
						referencedRelation: "user_stats";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "test_coordinators_test_id_fkey";
						columns: ["test_id"];
						referencedRelation: "tests";
						referencedColumns: ["id"];
					}
				];
			};
			test_coordinators_copy: {
				Row: {
					coordinator_id: string | null;
					relation_id: number;
					test_id: number | null;
				};
				Insert: {
					coordinator_id?: string | null;
					relation_id?: number;
					test_id?: number | null;
				};
				Update: {
					coordinator_id?: string | null;
					relation_id?: number;
					test_id?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "test_coordinators_copy_coordinator_id_fkey";
						columns: ["coordinator_id"];
						referencedRelation: "users_copy";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "test_coordinators_copy_test_id_fkey";
						columns: ["test_id"];
						referencedRelation: "tests_copy";
						referencedColumns: ["id"];
					}
				];
			};
			test_feedback_questions: {
				Row: {
					id: number;
					question: string | null;
					test_id: number;
				};
				Insert: {
					id?: never;
					question?: string | null;
					test_id: number;
				};
				Update: {
					id?: never;
					question?: string | null;
					test_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: "test_feedback_questions_test_id_fkey";
						columns: ["test_id"];
						referencedRelation: "tests";
						referencedColumns: ["id"];
					}
				];
			};
			test_problems: {
				Row: {
					problem_id: number | null;
					problem_number: number | null;
					relation_id: number;
					test_id: number;
				};
				Insert: {
					problem_id?: number | null;
					problem_number?: number | null;
					relation_id?: never;
					test_id: number;
				};
				Update: {
					problem_id?: number | null;
					problem_number?: number | null;
					relation_id?: never;
					test_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: "test_problems_problem_id_fkey";
						columns: ["problem_id"];
						referencedRelation: "problems";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "test_problems_problem_id_fkey";
						columns: ["problem_id"];
						referencedRelation: "front_ids";
						referencedColumns: ["problem_id"];
					},
					{
						foreignKeyName: "test_problems_problem_id_fkey";
						columns: ["problem_id"];
						referencedRelation: "full_problems";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "test_problems_problem_id_fkey";
						columns: ["problem_id"];
						referencedRelation: "unused_problems";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "test_problems_test_id_fkey";
						columns: ["test_id"];
						referencedRelation: "tests";
						referencedColumns: ["id"];
					}
				];
			};
			tests: {
				Row: {
					archived: boolean;
					id: number;
					test_description: string | null;
					test_name: string;
					test_version: string | null;
					tournament_id: number | null;
				};
				Insert: {
					archived?: boolean;
					id?: never;
					test_description?: string | null;
					test_name: string;
					test_version?: string | null;
					tournament_id?: number | null;
				};
				Update: {
					archived?: boolean;
					id?: never;
					test_description?: string | null;
					test_name?: string;
					test_version?: string | null;
					tournament_id?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "tests_tournament_id_fkey";
						columns: ["tournament_id"];
						referencedRelation: "tournaments";
						referencedColumns: ["id"];
					}
				];
			};
			tests_copy: {
				Row: {
					id: number;
					test_description: string | null;
					test_name: string;
					tournament_id: number | null;
				};
				Insert: {
					id?: number;
					test_description?: string | null;
					test_name: string;
					tournament_id?: number | null;
				};
				Update: {
					id?: number;
					test_description?: string | null;
					test_name?: string;
					tournament_id?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "tests_copy_tournament_id_fkey";
						columns: ["tournament_id"];
						referencedRelation: "tournaments_copy";
						referencedColumns: ["id"];
					}
				];
			};
			testsolve_answers: {
				Row: {
					answer: string | null;
					correct: boolean | null;
					feedback: string | null;
					id: number;
					problem_id: number | null;
					resolved: boolean;
					testsolve_id: number | null;
				};
				Insert: {
					answer?: string | null;
					correct?: boolean | null;
					feedback?: string | null;
					id?: never;
					problem_id?: number | null;
					resolved?: boolean;
					testsolve_id?: number | null;
				};
				Update: {
					answer?: string | null;
					correct?: boolean | null;
					feedback?: string | null;
					id?: never;
					problem_id?: number | null;
					resolved?: boolean;
					testsolve_id?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "testsolve_answers_problem_id_fkey";
						columns: ["problem_id"];
						referencedRelation: "problems";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "testsolve_answers_problem_id_fkey";
						columns: ["problem_id"];
						referencedRelation: "front_ids";
						referencedColumns: ["problem_id"];
					},
					{
						foreignKeyName: "testsolve_answers_problem_id_fkey";
						columns: ["problem_id"];
						referencedRelation: "full_problems";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "testsolve_answers_problem_id_fkey";
						columns: ["problem_id"];
						referencedRelation: "unused_problems";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "testsolve_answers_testsolve_id_fkey";
						columns: ["testsolve_id"];
						referencedRelation: "testsolves";
						referencedColumns: ["id"];
					}
				];
			};
			testsolve_feedback_answers: {
				Row: {
					answer: string | null;
					feedback_question: number;
					id: number;
					testsolve_id: number;
				};
				Insert: {
					answer?: string | null;
					feedback_question: number;
					id?: never;
					testsolve_id: number;
				};
				Update: {
					answer?: string | null;
					feedback_question?: number;
					id?: never;
					testsolve_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: "testsolve_feedback_answers_feedback_question_fkey";
						columns: ["feedback_question"];
						referencedRelation: "test_feedback_questions";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "testsolve_feedback_answers_testsolve_id_fkey";
						columns: ["testsolve_id"];
						referencedRelation: "testsolves";
						referencedColumns: ["id"];
					}
				];
			};
			testsolvers: {
				Row: {
					id: number;
					solver_id: string;
					test_id: number;
				};
				Insert: {
					id?: never;
					solver_id: string;
					test_id: number;
				};
				Update: {
					id?: never;
					solver_id?: string;
					test_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: "testsolvers_solver_id_fkey";
						columns: ["solver_id"];
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "testsolvers_solver_id_fkey";
						columns: ["solver_id"];
						referencedRelation: "user_stats";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "testsolvers_test_id_fkey";
						columns: ["test_id"];
						referencedRelation: "tests";
						referencedColumns: ["id"];
					}
				];
			};
			testsolves: {
				Row: {
					completed: boolean;
					end_time: string | null;
					feedback: string | null;
					id: number;
					solver_id: string | null;
					start_time: string | null;
					test_id: number;
					test_version: string | null;
					time_elapsed: number | null;
				};
				Insert: {
					completed?: boolean;
					end_time?: string | null;
					feedback?: string | null;
					id?: never;
					solver_id?: string | null;
					start_time?: string | null;
					test_id: number;
					test_version?: string | null;
					time_elapsed?: number | null;
				};
				Update: {
					completed?: boolean;
					end_time?: string | null;
					feedback?: string | null;
					id?: never;
					solver_id?: string | null;
					start_time?: string | null;
					test_id?: number;
					test_version?: string | null;
					time_elapsed?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "testsolves_solver_id_fkey";
						columns: ["solver_id"];
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "testsolves_solver_id_fkey";
						columns: ["solver_id"];
						referencedRelation: "user_stats";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "testsolves_test_id_fkey";
						columns: ["test_id"];
						referencedRelation: "tests";
						referencedColumns: ["id"];
					}
				];
			};
			tournaments: {
				Row: {
					archived: boolean;
					id: number;
					tournament_date: string | null;
					tournament_name: string;
				};
				Insert: {
					archived?: boolean;
					id?: never;
					tournament_date?: string | null;
					tournament_name: string;
				};
				Update: {
					archived?: boolean;
					id?: never;
					tournament_date?: string | null;
					tournament_name?: string;
				};
				Relationships: [];
			};
			tournaments_copy: {
				Row: {
					id: number;
					tournament_date: string | null;
					tournament_name: string;
				};
				Insert: {
					id?: number;
					tournament_date?: string | null;
					tournament_name: string;
				};
				Update: {
					id?: number;
					tournament_date?: string | null;
					tournament_name?: string;
				};
				Relationships: [];
			};
			user_roles: {
				Row: {
					role: number | null;
					user_id: string;
				};
				Insert: {
					role?: number | null;
					user_id: string;
				};
				Update: {
					role?: number | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_roles_user_id_fkey";
						columns: ["user_id"];
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "user_roles_user_id_fkey";
						columns: ["user_id"];
						referencedRelation: "user_stats";
						referencedColumns: ["id"];
					}
				];
			};
			user_roles_copy: {
				Row: {
					role: number | null;
					user_id: string;
				};
				Insert: {
					role?: number | null;
					user_id: string;
				};
				Update: {
					role?: number | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_roles_copy_user_id_fkey";
						columns: ["user_id"];
						referencedRelation: "users_copy";
						referencedColumns: ["id"];
					}
				];
			};
			users: {
				Row: {
					amc_score: number | null;
					discord: string | null;
					discord_id: string | null;
					discord_tokens: Json | null;
					email: string | null;
					full_name: string | null;
					id: string;
					initials: string | null;
					math_comp_background: string;
				};
				Insert: {
					amc_score?: number | null;
					discord?: string | null;
					discord_id?: string | null;
					discord_tokens?: Json | null;
					email?: string | null;
					full_name?: string | null;
					id: string;
					initials?: string | null;
					math_comp_background?: string;
				};
				Update: {
					amc_score?: number | null;
					discord?: string | null;
					discord_id?: string | null;
					discord_tokens?: Json | null;
					email?: string | null;
					full_name?: string | null;
					id?: string;
					initials?: string | null;
					math_comp_background?: string;
				};
				Relationships: [
					{
						foreignKeyName: "users_id_fkey";
						columns: ["id"];
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			users_copy: {
				Row: {
					discord: string | null;
					full_name: string | null;
					id: string;
					initials: string | null;
				};
				Insert: {
					discord?: string | null;
					full_name?: string | null;
					id: string;
					initials?: string | null;
				};
				Update: {
					discord?: string | null;
					full_name?: string | null;
					id?: string;
					initials?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "users_copy_id_fkey";
						columns: ["id"];
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
		};
		Views: {
			front_ids: {
				Row: {
					front_id: string | null;
					problem_id: number | null;
				};
				Relationships: [];
			};
			full_problems: {
				Row: {
					answer_latex: string | null;
					archived: boolean | null;
					author_id: string | null;
					comment_latex: string | null;
					created_at: string | null;
					difficulty: number | null;
					edited_at: string | null;
					front_id: string | null;
					full_name: string | null;
					id: number | null;
					nickname: string | null;
					problem_latex: string | null;
					problem_tests: string | null;
					solution_latex: string | null;
					sub_topics: string | null;
					topics: string | null;
					topics_short: string | null;
					unresolved_count: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "problems_author_id_fkey";
						columns: ["author_id"];
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "problems_author_id_fkey";
						columns: ["author_id"];
						referencedRelation: "user_stats";
						referencedColumns: ["id"];
					}
				];
			};
			problem_counts: {
				Row: {
					category: string | null;
					problem_count: number | null;
				};
				Relationships: [];
			};
			unused_problems: {
				Row: {
					answer_latex: string | null;
					author_id: string | null;
					comment_latex: string | null;
					created_at: string | null;
					difficulty: number | null;
					edited_at: string | null;
					front_id: string | null;
					full_name: string | null;
					id: number | null;
					nickname: string | null;
					problem_latex: string | null;
					solution_latex: string | null;
					sub_topics: string | null;
					topics: string | null;
					topics_short: string | null;
					unresolved_count: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "problems_author_id_fkey";
						columns: ["author_id"];
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "problems_author_id_fkey";
						columns: ["author_id"];
						referencedRelation: "user_stats";
						referencedColumns: ["id"];
					}
				];
			};
			user_stats: {
				Row: {
					discord_id: string | null;
					id: string | null;
					name: string | null;
					problem_count: number | null;
					unresolved_count: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "users_id_fkey";
						columns: ["id"];
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
		};
		Functions: {
			add_test_problem: {
				Args: {
					p_problem_id: number;
					p_test_id: number;
				};
				Returns: undefined;
			};
			delete_test_problem:
				| {
						Args: {
							p_problem_id: number;
							cur_test_id: number;
						};
						Returns: undefined;
				  }
				| {
						Args: {
							p_problem_id: number;
						};
						Returns: undefined;
				  };
			reorder_test_problem:
				| {
						Args: {
							p_problem_id: number;
							p_new_number: number;
							cur_test_id: number;
						};
						Returns: undefined;
				  }
				| {
						Args: {
							p_problem_id: number;
							p_new_number: number;
						};
						Returns: undefined;
				  };
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
