import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-storeroom',
  templateUrl: './storeroom.page.html',
  styleUrls: ['./storeroom.page.scss'],
})
export class StoreroomPage implements OnInit {

  inventory: any[] = []; // Initialize here
  
  filteredInventory: any[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedQuantityRange: string = '';

  isModalOpen = false;
  selectedImageUrl = '';
  modalTitle = '';

  constructor(private firestore: AngularFirestore) { }

  ngOnInit() {
    this.getInventory();
  }

  openModal(imageUrl: string, itemName: string) {
    this.selectedImageUrl = imageUrl;
    this.modalTitle = itemName;
    this.isModalOpen = true;
  }

  getInventory() {
    this.firestore.collection('storeroomInventory', ref => ref.orderBy('timestamp', 'desc')).valueChanges().subscribe((data: any[]) => {
      this.inventory = data;
      this.filterInventory();
    });
  }

  filterInventory() {
    this.filteredInventory = this.inventory.filter((item) =>
      (item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      this.searchTerm === '') && 
      (this.selectedCategory === '' || item.category === this.selectedCategory) &&
      (this.selectedQuantityRange === '' || this.checkQuantityRange(item.quantity))
    );
  }

  checkQuantityRange(quantity: number): boolean {
    if (this.selectedQuantityRange === 'tooLow' && quantity <= 10) {
      return true;
    } else if (this.selectedQuantityRange === 'runningLow' && quantity >= 11 && quantity <= 20) {
      return true;
    } else if (this.selectedQuantityRange === 'middle' && quantity >= 21 && quantity <= 49) {
      return true;
    } else if (this.selectedQuantityRange === 'full' && quantity >= 50) {
      return true;
    } else {
      return false;
    }
  }
}
