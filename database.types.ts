export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      carro: {
        Row: {
          airbag: string
          ano_fabricacao: number
          ano_modelo: number
          ar_condicionado: string
          bancos: string
          blindado: boolean
          cambio: string
          carroceria: string
          cor: string
          created_at: string | null
          direcao: string
          farol: string
          final_placa: string
          freios: string
          id: number
          km: number
          marca: string
          modelo: string
          motor: string
          motorizacao: string
          multimidia: string
          potencia: number
          preco: number
          rodas: string
          torque: number
          tracao: number
          ts_vector: unknown | null
          tsvector: unknown | null
          versao: string
        }
        Insert: {
          airbag: string
          ano_fabricacao: number
          ano_modelo: number
          ar_condicionado: string
          bancos: string
          blindado: boolean
          cambio: string
          carroceria: string
          cor: string
          created_at?: string | null
          direcao: string
          farol: string
          final_placa: string
          freios: string
          id?: number
          km: number
          marca: string
          modelo: string
          motor: string
          motorizacao: string
          multimidia: string
          potencia: number
          preco: number
          rodas: string
          torque: number
          tracao: number
          ts_vector?: unknown | null
          tsvector?: unknown | null
          versao: string
        }
        Update: {
          airbag?: string
          ano_fabricacao?: number
          ano_modelo?: number
          ar_condicionado?: string
          bancos?: string
          blindado?: boolean
          cambio?: string
          carroceria?: string
          cor?: string
          created_at?: string | null
          direcao?: string
          farol?: string
          final_placa?: string
          freios?: string
          id?: number
          km?: number
          marca?: string
          modelo?: string
          motor?: string
          motorizacao?: string
          multimidia?: string
          potencia?: number
          preco?: number
          rodas?: string
          torque?: number
          tracao?: number
          ts_vector?: unknown | null
          tsvector?: unknown | null
          versao?: string
        }
        Relationships: []
      }
      fotos_urls: {
        Row: {
          carro_id: number
          id: number
          url: string
        }
        Insert: {
          carro_id: number
          id?: number
          url: string
        }
        Update: {
          carro_id?: number
          id?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "fotos_urls_carro_id_fkey"
            columns: ["carro_id"]
            isOneToOne: false
            referencedRelation: "carro"
            referencedColumns: ["id"]
          },
        ]
      }
      opcionais_carro: {
        Row: {
          carro_id: number
          id: number
          nome: string
        }
        Insert: {
          carro_id: number
          id?: number
          nome: string
        }
        Update: {
          carro_id?: number
          id?: number
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "opcionais_carro_carro_id_fkey"
            columns: ["carro_id"]
            isOneToOne: false
            referencedRelation: "carro"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      exec_sql: {
        Args: {
          query: string
        }
        Returns: Record<string, unknown>[]
      }
      fetch_filtered_cars: {
        Args: {
          p_marca: string
          p_modelo: string
          p_versao: string
          p_preco_min: number
          p_preco_max: number
          p_ano_min: number
          p_ano_max: number
          p_km_min: number
          p_km_max: number
          p_cor: string
          p_carroceria: string
          p_blindado: boolean
          p_last_car_id: number
          p_limit: number
        }
        Returns: {
          id: number
          especificacao_carro: Json
          opcionais_carro: Json
          fotos_urls: Json
        }[]
      }
      fetch_ordered_cars: {
        Args: {
          p_marca: string
          p_modelo: string
          p_versao: string
          p_preco_min: number
          p_preco_max: number
          p_ano_min: number
          p_ano_max: number
          p_km_min: number
          p_km_max: number
          p_cor: string
          p_carroceria: string
          p_blindado: boolean
          p_last_car_id: number
          p_limit: number
        }
        Returns: {
          id: number
          marca: string
          modelo: string
          versao: string
          preco: number
          ano_modelo: number
          ano_fabricacao: number
          km: number
          cor: string
          motorizacao: string
          potencia: string
          torque: string
          cambio: string
          tracao: string
          direcao: string
          freios: string
          rodas: string
          bancos: string
          airbags: string
          ar_condicionado: string
          farol: string
          multimidia: string
          final_placa: string
          carroceria: string
          blindado: boolean
          carro_id: number
          opcionais: Json
          fotos: Json
        }[]
      }
      get_carros: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          especificacao_carro: Json
          opcionais_carro: Json
          fotos_urls: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
