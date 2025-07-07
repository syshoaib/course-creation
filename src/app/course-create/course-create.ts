import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

import { UserService } from '../services/user.service';
import { Course } from '../models/course.model';

@Component({
  selector: 'app-course-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './course-create.html',
  styleUrl: './course-create.scss',
})
export class CourseCreateComponent implements OnInit {
  courseForm: FormGroup;
  allowed = false;
  levels = ['Beginner', 'Intermediate', 'Advanced'];

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private userService = inject(UserService);

  constructor() {
    this.courseForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(25),
        ],
      ],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      author: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      price: [null, [Validators.required, Validators.min(0.01)]],
      level: ['', Validators.required],
      thumbnailUrl: [
        '',
        [Validators.required, Validators.pattern(/^https?:\/\/.+/)],
      ],
      modules: this.fb.array([]),
    });
  }

  ngOnInit() {
    const role = this.userService.getRole();
    this.allowed = role === 'admin' || role === 'instructor';
    if (this.allowed) {
      this.addModule();
    }
  }

  get modules(): FormArray {
    return this.courseForm.get('modules') as FormArray;
  }

  lessons(moduleIndex: number): FormArray {
    return this.modules.at(moduleIndex).get('lessons') as FormArray;
  }

  addModule() {
    this.modules.push(
      this.fb.group({
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(25),
          ],
        ],
        description: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(500),
          ],
        ],
        lessons: this.fb.array([this.createLesson()]),
      })
    );
  }

  removeModule(index: number) {
    this.modules.removeAt(index);
  }

  createLesson(): FormGroup {
    return this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
        ],
      ],
      duration: [null, [Validators.required, Validators.min(0.01)]],
    });
  }

  addLesson(moduleIndex: number) {
    this.lessons(moduleIndex).push(this.createLesson());
  }

  removeLesson(moduleIndex: number, lessonIndex: number) {
    this.lessons(moduleIndex).removeAt(lessonIndex);
  }

  getError(control: AbstractControl, field: string): string | null {
    if (control.hasError('required')) {
      switch (field) {
        case 'title':
          return 'Title is required.';
        case 'description':
          return 'Description is required.';
        case 'author':
          return 'Author is required.';
        case 'price':
          return 'Price is required.';
        case 'level':
          return 'Level selection is required.';
        case 'thumbnailUrl':
          return 'Thumbnail URL is required.';
        case 'moduleName':
          return 'Module name is required.';
        case 'moduleDescription':
          return 'Module description is required.';
        case 'lessonTitle':
          return 'Lesson title is required.';
        case 'lessonDuration':
          return 'Lesson duration is required.';
      }
    }
    if (control.hasError('minlength')) {
      if (field === 'title') return 'Title must be at least 5 characters.';
      if (field === 'author')
        return 'Author name must be at least 3 characters.';
      if (field === 'moduleName')
        return 'Module name must be at least 3 characters.';
      if (field === 'moduleDescription')
        return 'Module description must be at least 10 characters.';
      if (field === 'lessonTitle')
        return 'Lesson title must be at least 3 characters.';
    }
    if (control.hasError('min')) {
      if (field === 'price') return 'Price must be a positive number.';
      if (field === 'lessonDuration')
        return 'Lesson duration must be a positive number.';
    }
    if (control.hasError('pattern')) {
      if (field === 'thumbnailUrl')
        return 'Please enter a valid URL (must start with http:// or https://).';
    }
    return null;
  }

  onSubmit() {
    if (this.courseForm.invalid) {
      this.snackBar.open('Please fix errors before submitting.', 'Close', {
        duration: 3000,
      });
      this.courseForm.markAllAsTouched();
      return;
    }
    const formValue = this.courseForm.value;
    const course: Course = {
      ...formValue,
      reviews: [],
      rating: 0,
      date: new Date().toISOString(),
    };
    console.log('Course submitted:', course);
    this.snackBar.open('Course created successfully!', 'Close', {
      duration: 3000,
    });
    this.courseForm.reset();
    this.modules.clear();
    this.addModule();
  }
}
