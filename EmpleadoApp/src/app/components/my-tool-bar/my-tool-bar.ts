import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';


@Component({
  selector: 'app-my-tool-bar',
  imports: [MatToolbarModule],
  templateUrl: './my-tool-bar.html',
  styleUrl: './my-tool-bar.scss',
})
export class MyToolBar {}
