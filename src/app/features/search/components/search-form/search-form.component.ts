import { AsyncPipe, NgIf, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiDataList, TuiInitialsPipe, TuiTextfield } from '@taiga-ui/core';

import { TuiDay, TuiLet } from '@taiga-ui/cdk';
import { TuiDataListWrapper } from '@taiga-ui/kit';
import { TuiInputDateTimeModule, TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { of } from 'rxjs';
import { SearchService } from '@features/search/services/search.service';

@Component({
  selector: 'dd-search-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiInputModule,
    TuiLet,
    AsyncPipe,
    TuiTextfieldControllerModule,
    NgIf,
    TuiDataList,
    NgForOf,
    TuiInitialsPipe,
    TuiDataListWrapper,
    TuiTextfield,
    TuiInputDateTimeModule,
    TuiButton
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFormComponent {
  // eslint-disable-next-line class-methods-use-this
  onSelected(user: { name: string }) {
    console.error(user);
    throw new Error('Method not implemented.');
  }

  private searchService = inject(SearchService);
  cities$ = this.searchService.cities;

  searchForm = new FormGroup({
    from: new FormControl(''),
    to: new FormControl(''),
    date: new FormControl([new TuiDay(2017, 2, 15), null]),
  });

  search() {
    console.log(this.searchForm.value);
    const res = this.searchService.search();
    console.log(res);
  }
}
