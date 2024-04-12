import { Component, OnInit } from '@angular/core';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  quantity: number;
  inCart: boolean;
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {
  cartItemCount = 0;
  inventory: InventoryItem[] = [
    // Add your inventory data here
    {
      id: 1,
      name: 'Scrubber',
      category: 'Category 1',
      description: 'This is a sample product description.',
      imageUrl: 'assets/v.jpg',
      quantity: 1,
      inCart: false,
    },
    {
      id: 1,
      name: 'Domestos',
      category: 'Category 1',
      description: 'This is a sample product description.',
      imageUrl: 'assets/n.jpg',
      quantity: 1,
      inCart: false,
    },
    {
      id: 1,
      name: 'Hand Sanitizer',
      category: 'Category 1',
      description: 'To clean your hand against gems .',
      imageUrl: 'assets/j.jpg',
      quantity: 1,
      inCart: false,
    },
    // Add more inventory items as needed
  ];

  constructor() { }

  ngOnInit() {
  }

  incrementQuantity(item: InventoryItem) {
    item.quantity++;
  }

  decrementQuantity(item: InventoryItem) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  toggleCartItem(item: InventoryItem) {
    item.inCart = !item.inCart;
    this.cartItemCount += item.inCart ? 1 : -1;
  }
}
