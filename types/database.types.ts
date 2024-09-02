export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	public: {
		Tables: {
			profiles: {
				Row: {
					add_videos: boolean | null;
					created_at: string;
					first_name: string;
					id: string;
					last_name: string;
					last_sign_in_at: string | null;
					manage_users: boolean | null;
					watch_videos: boolean | null;
					full_name: string | null;
				};
				Insert: {
					add_videos?: boolean | null;
					created_at?: string;
					first_name: string;
					id: string;
					last_name: string;
					last_sign_in_at?: string | null;
					manage_users?: boolean | null;
					watch_videos?: boolean | null;
				};
				Update: {
					add_videos?: boolean | null;
					created_at?: string;
					first_name?: string;
					id?: string;
					last_name?: string;
					last_sign_in_at?: string | null;
					manage_users?: boolean | null;
					watch_videos?: boolean | null;
				};
				Relationships: [
					{
						foreignKeyName: "profile_id_fkey";
						columns: ["id"];
						isOneToOne: true;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			videos: {
				Row: {
					description: string | null;
					id: string;
					keys: string[] | null;
					library_id: number;
					preview: string;
					thumbnail: string | null;
					tickets: string[] | null;
					title: string;
					video_date: string;
					video_id: string;
				};
				Insert: {
					description?: string | null;
					id?: string;
					keys?: string[] | null;
					library_id: number;
					preview: string;
					thumbnail?: string | null;
					tickets?: string[] | null;
					title: string;
					video_date?: string;
					video_id: string;
				};
				Update: {
					description?: string | null;
					id?: string;
					keys?: string[] | null;
					library_id?: number;
					preview?: string;
					thumbnail?: string | null;
					tickets?: string[] | null;
					title?: string;
					video_date?: string;
					video_id?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			can_add_videos: {
				Args: Record<PropertyKey, never>;
				Returns: boolean;
			};
			can_manage_users: {
				Args: Record<PropertyKey, never>;
				Returns: boolean;
			};
			full_name: {
				Args: {
					"": unknown;
				};
				Returns: string;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<
	keyof Database,
	"public"
>];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema["Tables"] & PublicSchema["Views"])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
				Database[PublicTableNameOrOptions["schema"]]["Views"])
		: never = never
> = PublicTableNameOrOptions extends {
	schema: keyof Database;
}
	? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
			Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
			PublicSchema["Views"])
	? (PublicSchema["Tables"] &
			PublicSchema["Views"])[PublicTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = PublicTableNameOrOptions extends {
	schema: keyof Database;
}
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
	? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = PublicTableNameOrOptions extends {
	schema: keyof Database;
}
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
	? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	PublicEnumNameOrOptions extends
		| keyof PublicSchema["Enums"]
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
		: never = never
> = PublicEnumNameOrOptions extends {
	schema: keyof Database;
}
	? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
	? PublicSchema["Enums"][PublicEnumNameOrOptions]
	: never;
