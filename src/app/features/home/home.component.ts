import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Comments } from 'src/app/models/comments-model';
import { Post } from 'src/app/models/post-model';
import { RootObject } from 'src/app/models/user-model';
import { HomeService } from 'src/app/services/home.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public posts: Post[];
  public users: RootObject[];
  public expanded = [];
  public comments: Comments[];

  constructor(private homeService: HomeService, private loginservice: LoginService) { }

  ngOnInit(): void {
    debugger;
    this.homeService.getPosts().subscribe((value) => {
      this.posts = [...value];
    });
    this.loginservice.getUsers().subscribe((value) => {
      this.users = [...value];
    });
    this.homeService.getComments().subscribe((value) => {
      this.comments = [...value];
    });
    combineLatest([this.loginservice.getUsers(),this.homeService.getPosts(), this.homeService.getComments()])
    .pipe(map(values => {
      const user=values[0];
      const posts = values[1];
      const comments = values[2];
      debugger;
      for (let indexPost = 0; indexPost < posts.length; indexPost++) {
        posts[indexPost].comments=[];
        posts[indexPost].comments.push(...comments.filter(rec=>rec.postId ==  posts[indexPost].id));
      }
      for(let id=0;id<user.length;id++){
        user[id].posts=[];
        user[id].posts.push(...posts.filter(rec=>rec.userId ==  user[id].id));
      }
    
      return user;
    })).subscribe(values => console.log(values));
  }
  public getUsername(userid) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === userid) {
        return this.users[i].name;
      }
    }
  }


  public expandRow(id: any) {
    if (this.expanded.indexOf(id) > -1) {
      this.expanded.splice(this.expanded.indexOf(id), 1)
    } else {
      this.expanded.push(id);
    }

  }

}
