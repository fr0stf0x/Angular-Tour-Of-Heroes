import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Hero} from '../hero';
import {HeroService} from '../hero.service';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  private searchQuery = new Subject<string>();

  constructor(private heroService: HeroService) {
  }

  search(query: string): void {
    this.searchQuery.next(query);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchQuery.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous searchQuery
      distinctUntilChanged(),

      // switch to new search observable each time the searchQuery changes
      switchMap((query: string) => this.heroService.searchHeroes(query)),
    );
  }
}
