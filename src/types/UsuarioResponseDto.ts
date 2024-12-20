// src/types/UsuarioResponseDto.ts
export interface UsuarioResponseDto {
    fotoPerfilUrl(fotoPerfilUrl: any): unknown;
    id: number;
    nombre: string;
    email: string;
    direccion: string;
    roles: string[];
  }
  
  // src/types/AutenticacionResponseDto.ts
  export interface AutenticacionResponseDto {
    userId: number;
  }
  