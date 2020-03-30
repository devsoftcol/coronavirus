import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  public url: SafeUrl;z
  constructor(public sanitize: DomSanitizer) {
    this.url = sanitize.bypassSecurityTrustResourceUrl("https://d2jsqrio60m94k.cloudfront.net/");
   }

  ngOnInit() {
  }

}
