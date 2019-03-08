import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import{NavController, IonItemSliding} from '@ionic/angular';
import { Task } from './task';
import { AngularFireDatabase, AngularFireList }  from 'angularfire2/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})
export class TaskListPage implements OnInit {
	taskList: AngularFireList<Task>;
	tasks: Observable<any[ ]>;

  constructor(public alertCtrl: AlertController, public af: AngularFireDatabase) {
	this.taskList = this.af.list('/tasks'); // /tasks refers to how we sort the data on Firebase.
this.tasks = this.taskList.valueChanges();

					
	
  
  }
  async addItem(){
		let prompt = await this.alertCtrl.create({
		header: 'Add Item',
		message: 'Enter an item to add to the list',
		inputs:[{
			name: 'listItem',
			type: 'text'
		}],
		buttons: [{
			text: 'Cancel',
			role: 'cancel'
		},{
			text:'Add Item',
			handler: data => {
				let newTaskRef = this.taskList.push(
					{ id: '', title: data.newTask, status: 'open' }
					);
					newTaskRef.update( { id: newTaskRef.key } );
			}
		}]
		});
		prompt.present();
		
	}
	markAsDone(slidingItem: IonItemSliding, task: any){
		task.status = "done";
		slidingItem.close()
		this.taskList.update( task.id, task );
	}

	removeTask(slidingItem: IonItemSliding, task: any){
		task.status = "removed";
		this.taskList.remove( task.id );
		slidingItem.close();
	}
	
	
  ngOnInit() {
  }

}
