import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(private router: Router, private loadingController: LoadingController) {}

  async ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/login']); // Navigate to the login page after a delay
    }, 3000);
  }

}
