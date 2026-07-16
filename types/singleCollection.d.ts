export interface CallectionSummary {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  image: string | null;
  is_active: boolean;
  parent: number | null;
}

export interface Callection {
  id: number;
  title: string;
  slug: string;
  parent: number | null;
  parent_detail: CallectionSummary | null;

  short_description: string;
  description: string;
  is_active: boolean;
  image: string | null;

  children: CallectionSummary[];

  created_at: string;
  updated_at: string;
}