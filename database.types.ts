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
          id: string
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
          id?: string
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
          id?: string
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
          versao?: string
        }
        Relationships: []
      }
      fotos_urls: {
        Row: {
          carro_id: string | null
          id: string
          url: string
        }
        Insert: {
          carro_id?: string | null
          id?: string
          url: string
        }
        Update: {
          carro_id?: string | null
          id?: string
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
          carro_id: string
          id: string
          nome: string
        }
        Insert: {
          carro_id: string
          id?: string
          nome: string
        }
        Update: {
          carro_id?: string
          id?: string
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
      [_ in never]: never
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
