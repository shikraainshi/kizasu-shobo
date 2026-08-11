export interface BookInput {
  title: string;
  author: string;
  authorKana?: string;
  category: string;
  pubDate?: string;
  price?: string;
  pages?: string;
  isbn?: string;
  description?: string;
  fullDescription?: string;
  color?: string;
  isPublic: boolean;
  featured: boolean;
  seriesName?: string;
  seriesVolume?: string;
  titleVolume?: string;
  titleKana?: string;
  slug?: string;
  url1?: string;
  url2?: string;
  url3?: string;
}

export interface NewsInput {
  title: string;
  date: string;
  category: string;
  important: boolean;
  content?: string;
  relatedUrl1?: string;
  relatedUrl2?: string;
  urlLabel1?: string;
  urlLabel2?: string;
  slug?: string;
}

export interface EventInput {
  title: string;
  description: string;
  coverImageUrl?: string;
  venue: string;
  startAt: string;
  endAt?: string;
  price: number;
  capacity?: number | null;
  status: "draft" | "published" | "closed";
}
