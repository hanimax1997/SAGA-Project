import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {
  isExpanded = true;
  innerWidth: any;
  constructor() { }

  @HostListener('window:resize', ['$event'])
  @HostListener('window:webkitfullscreenchange', ['$event'])
  onWindowResize() {
    this.innerWidth = window.innerWidth;
    if(this.innerWidth < 1500)
    {
      this.isExpanded = false
    }
    else if(!this.isExpanded)
    {
      this.isExpanded = !this.isExpanded
    }
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    if(this.innerWidth < 1500)
    {
      this.isExpanded = !this.isExpanded
    }
  }
  
  hide(value: any) {
    this.isExpanded = value
  }

}
