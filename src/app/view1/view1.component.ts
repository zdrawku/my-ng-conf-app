import { Component, OnDestroy, OnInit } from '@angular/core';
import { IGX_BUTTON_GROUP_DIRECTIVES, IGX_CARD_DIRECTIVES, IgxButtonDirective, IgxIconButtonDirective, IgxIconComponent, IgxOverlayOutletDirective, IgxRippleDirective, IgxToggleActionDirective, IgxToggleDirective } from 'igniteui-angular';
import { Subject, take, takeUntil } from 'rxjs';
import { CategoryModel } from '../models/my-api/category-model';
import { ToyModel } from '../models/my-api/toy-model';
import { MyAPIService } from '../services/my-api.service';

@Component({
  selector: 'app-view1',
  standalone: true,
  imports: [IGX_BUTTON_GROUP_DIRECTIVES, IGX_CARD_DIRECTIVES, IgxToggleActionDirective, IgxOverlayOutletDirective, IgxIconButtonDirective, IgxButtonDirective, IgxRippleDirective, IgxToggleDirective, IgxIconComponent],
  templateUrl: './view1.component.html',
  styleUrls: ['./view1.component.scss']
})
export class View1Component implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  private _selectedCategory: number = 1;
  public get selectedCategory(): number {
    return this._selectedCategory;
  }
  public set selectedCategory(value: number) {
    this._selectedCategory = value;
    this.myAPIToyModel$.next();
  }
  public myAPICategoryModel: CategoryModel[] = [];
  public myAPIToyModel: ToyModel[] = [];
  public myAPIToyModel$: Subject<void> = new Subject<void>();


  constructor(
    private myAPIService: MyAPIService,
  ) {}

  ngOnInit() {
    this.myAPIService.getCategoryModelList().pipe(takeUntil(this.destroy$)).subscribe(
      data => this.myAPICategoryModel = data
    );
    this.myAPIService.getToyModelList(this.selectedCategory as any).pipe(takeUntil(this.destroy$)).subscribe(
      data => this.myAPIToyModel = data
    );
    this.myAPIToyModel$.pipe(takeUntil(this.destroy$)).subscribe(
      () => { this.myAPIService.getToyModelList(this.selectedCategory as any).pipe(take(1)).subscribe(
        data => this.myAPIToyModel = data
    )});
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.myAPIToyModel$.complete();
    this.destroy$.complete();
  }

  public toggleButtonClick(item: CategoryModel) {
    this.selectedCategory = item.id;
  }
}
