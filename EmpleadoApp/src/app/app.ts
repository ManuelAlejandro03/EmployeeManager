import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MyToolBar } from './components/my-tool-bar/my-tool-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbar, MyToolBar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('EmpleadoApp');
}
