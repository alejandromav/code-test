import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'navbar',
    templateUrl: '/views/navbar.component.html',
    styleUrls: [ '../../css/navbar.component.css' ]
})

export class NavbarComponent {
    title = 'ToDos';
}