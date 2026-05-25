export interface Composer {
  id: string;
  name: string;
  birth_year: number | null;
  death_year: number | null;
  nationality: string | null;
  bio: string | null;
  imagen_url: string | null; 
  created_at: string;
}

export interface Score {
  id: string;
  title: string;
  composer_id: string;
  instrument: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  genre: string | null;
  year_composed: number | null;
  duration_minutes: number | null;
  pdf_url: string | null;
  thumbnail_url: string | null;
  description: string | null;
  views: number;
  downloads: number;
  created_at: string;
  updated_at: string;
}

export interface ScoreWithComposer extends Score {
  composer: Composer;
}

export interface Database {
  public: {
    Tables: {
      composers: { Row: Composer; Insert: any; Update: any };
      scores: { Row: Score; Insert: any; Update: any };
    };
    Functions: {
      increment_downloads: { Args: { score_id: string }; Returns: any };
    };
  };
}
