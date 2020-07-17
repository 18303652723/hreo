import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '@app/services/storage.service';

@Component({
  selector: 'app-profession-selection',
  templateUrl: './profession-selection.component.html',
  styleUrls: ['./profession-selection.component.scss'],
})
export class ProfessionSelectionComponent implements OnInit {

  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private storage: StorageService
  ) { }

  public intention_data =  {
    game_area: '',
    game_squad: '',
  }

  ngOnInit() {
    this.activeRouter.queryParams.subscribe(params => {
      this.intention_data.game_area = params.game_area
    })
  }

  goToHome(val) {
    this.intention_data.game_squad = val;
    this.storage.setStorage('intention_data', this.intention_data);
    console.log(51544845)

    this.router.navigate(['/home/index'])
  }

}
