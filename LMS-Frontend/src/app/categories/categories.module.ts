import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { CategoriesRoutingModule } from './categories-routing.module';

@NgModule({
  declarations: [CategoryListComponent, CategoryDetailComponent],
  imports: [CommonModule, CategoriesRoutingModule],
})
export class CategoriesModule {}
