export interface Review {
  reviewer: string;
  comment: string;
  rating: number;
  date: string;
}

export interface Lesson {
  title: string;
  duration: number;
}

export interface Module {
  name: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  title: string;
  description: string;
  author: string;
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnailUrl: string;
  modules: Module[];
  reviews: Review[];
  rating: number;
  date: string;
}
