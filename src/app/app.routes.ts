import { Routes } from '@angular/router';
import { CourseCreateComponent } from './course-create/course-create';

export const routes: Routes = [
  { path: 'create-course', component: CourseCreateComponent },
  { path: '', redirectTo: 'create-course', pathMatch: 'full' },
];
