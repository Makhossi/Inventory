import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, combineLatest, Observable } from 'rxjs';



// Define an interface for the data structure
interface InventoryItem {
  category: string;
  quantity: number;
  name: string;
  barcode: string;
}

interface CategoryComparisonData {
  category: string;
  inventoryQuantity: number;
  storeroomQuantity: number;
}

interface TotalQuantitiesData {
  category: string;
  totalQuantity: number;
}
interface UpdateFrequencyData {
  category: string;
  updateFrequency: number;
  productName: string;
}
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
})
export class AnalyticsPage implements OnInit {
  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.generateQuantityByCategoryChart();
    this.generateQuantityByCategory();
    this.generateCategoryComparisonChart();
    this.generateTotalQuantitiesChart();
    this.generateUpdateFrequencyChart();
  }

  generateUpdateFrequencyChart() {
    combineLatest([
      this.firestore.collection('inventory').valueChanges(),
      this.firestore.collection('storeroomInventory').valueChanges(),
    ])
      .pipe(
        map(([inventoryData, storeroomData]: [any[], any[]]) => {
          const inventoryItems: InventoryItem[] = inventoryData.map(
            (item: any) => ({
              category: item.category,
              quantity: item.quantity,
              name: item.name,
              barcode: item.barcode,
            })
          );
          const storeroomItems: InventoryItem[] = storeroomData.map(
            (item: any) => ({
              category: item.category,
              quantity: item.quantity,
              name: item.name,
              barcode: item.barcode,
            })
          );
  
          const allItems = [...inventoryItems, ...storeroomItems];
          const barcodes = Array.from(new Set(allItems.map((item) => item.barcode)));
  
          const updateFrequencyData: UpdateFrequencyData[] = barcodes.map((barcode) => {
            const inventoryUpdates = inventoryItems.filter((item) => item.barcode === barcode).length;
            const storeroomUpdates = storeroomItems.filter((item) => item.barcode === barcode).length;
            const totalUpdates = inventoryUpdates + storeroomUpdates;
            const productName = allItems.find((item) => item.barcode === barcode)?.name || barcode;
            return { category: barcode, updateFrequency: totalUpdates, productName };
          });
  
          return updateFrequencyData;
        })
      )
      .subscribe((updateFrequencyData: UpdateFrequencyData[]) => {
        const ctx = document.getElementById('updateFrequencyChart') as HTMLCanvasElement;
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: updateFrequencyData.map((item) => item.productName),
            datasets: [
              {
                label: 'Update Frequency',
                data: updateFrequencyData.map((item) => item.updateFrequency),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            indexAxis: 'y',
            scales: {
              x: {
                beginAtZero: true,
              },
            },
          },
        });
      });
  }

  generateQuantityByCategoryChart() {
    this.firestore
      .collection('inventory')
      .valueChanges()
      .pipe(
        map((data: unknown[]) => {
          return data.map((item: any) => {
            return {
              category: item.category,
              quantity: item.quantity,
              name: item.name,
            } as InventoryItem;
          });
        })
      )
      .subscribe((data: InventoryItem[]) => {
        const categories = data.map((item) => item.name);
        const uniqueCategories = Array.from(new Set(categories));
        const quantitiesByCategory = uniqueCategories.map((name) => {
          const categoryItems = data.filter((item) => item.name === name);
          const totalQuantity = categoryItems.reduce((acc, curr) => acc + curr.quantity, 0);
          return totalQuantity;
        });

        const lowQuantityThreshold = 10; // Set the low quantity threshold
        const lowQuantityCategories = uniqueCategories.filter((category, index) => {
          return quantitiesByCategory[index] < lowQuantityThreshold;
        });

        const ctx = document.getElementById('quantityByCategoryChart') as HTMLCanvasElement;
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: uniqueCategories,
            datasets: [
              {
                label: 'Quantity',
                data: quantitiesByCategory,
                backgroundColor: (context) => {
                  const index = context.dataIndex;
                  const category = uniqueCategories[index];
                  return lowQuantityCategories.includes(category)
                    ? 'rgba(255, 99, 132, 0.2)' // Red color for low quantity
                    : 'rgba(75, 192, 192, 0.2)'; // Default color
                },
                borderColor: (context) => {
                  const index = context.dataIndex;
                  const category = uniqueCategories[index];
                  return lowQuantityCategories.includes(category)
                    ? 'rgba(255, 99, 132, 1)' // Red color for low quantity
                    : 'rgba(75, 192, 192, 1)'; // Default color
                },
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      });
  }


  generateQuantityByCategory(){
    this.firestore
      .collection('storeroomInventory')
      .valueChanges()
      .pipe(
        map((data: unknown[]) => {
          return data.map((item: any) => {
            return {
              category: item.category,
              quantity: item.quantity,
              name: item.name,
            } as InventoryItem;
          });
        })
      )
      .subscribe((data: InventoryItem[]) => {
        const categories = data.map((item) => item.name);
        const uniqueCategories = Array.from(new Set(categories));
        const quantitiesByCategory = uniqueCategories.map((name) => {
          const categoryItems = data.filter((item) => item.name === name);
          const totalQuantity = categoryItems.reduce((acc, curr) => acc + curr.quantity, 0);
          return totalQuantity;
        });

        const lowQuantityThreshold = 10; // Set the low quantity threshold
        const lowQuantityCategories = uniqueCategories.filter((category, index) => {
          return quantitiesByCategory[index] < lowQuantityThreshold;
        });

        const ctx = document.getElementById('quantityByCategoryStorommChart') as HTMLCanvasElement;
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: uniqueCategories,
            datasets: [
              {
                label: 'Quantity',
                data: quantitiesByCategory,
                backgroundColor: (context) => {
                  const index = context.dataIndex;
                  const category = uniqueCategories[index];
                  return lowQuantityCategories.includes(category)
                    ? 'rgba(255, 99, 132, 0.2)' // Red color for low quantity
                    : 'rgba(75, 192, 192, 0.2)'; // Default color
                },
                borderColor: (context) => {
                  const index = context.dataIndex;
                  const category = uniqueCategories[index];
                  return lowQuantityCategories.includes(category)
                    ? 'rgba(255, 99, 132, 1)' // Red color for low quantity
                    : 'rgba(75, 192, 192, 1)'; // Default color
                },
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      });
  }


  generateCategoryComparisonChart() {
    combineLatest([
      this.firestore.collection('inventory').valueChanges(),
      this.firestore.collection('storeroomInventory').valueChanges(),
    ])
      .pipe(
        map(([inventoryData, storeroomData]: [any[], any[]]) => {
          const inventoryItems: InventoryItem[] = inventoryData.map(
            (item: any) => ({
              category: item.category,
              quantity: item.quantity,
              name: item.name,
              barcode: item.barcode,
            })
          );
          const storeroomItems: InventoryItem[] = storeroomData.map(
            (item: any) => ({
              category: item.category,
              quantity: item.quantity,
              name: item.name,
              barcode: item.barcode,
            })
          );
  
          const allItems = [...inventoryItems, ...storeroomItems];
          const categories = Array.from(new Set(allItems.map((item) => item.category)));
  
          const comparisonData: CategoryComparisonData[] = categories.map((category) => {
            const inventoryQuantity = inventoryItems
              .filter((item) => item.category === category)
              .reduce((acc, curr) => acc + curr.quantity, 0);
            const storeroomQuantity = storeroomItems
              .filter((item) => item.category === category)
              .reduce((acc, curr) => acc + curr.quantity, 0);
            return { category, inventoryQuantity, storeroomQuantity };
          });
  
          return comparisonData;
        })
      )
      .subscribe((comparisonData: CategoryComparisonData[]) => {
        const ctx = document.getElementById('categoryComparisonChart') as HTMLCanvasElement;
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: comparisonData.map((item) => item.category),
            datasets: [
              {
                label: 'Inventory',
                data: comparisonData.map((item) => item.inventoryQuantity),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
              {
                label: 'Storeroom',
                data: comparisonData.map((item) => item.storeroomQuantity),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
              },
            ],
          },
        });
      });
  }

  generateTotalQuantitiesChart() {
    combineLatest([
      this.firestore.collection('inventory').valueChanges(),
      this.firestore.collection('storeroomInventory').valueChanges(),
    ])
      .pipe(
        map(([inventoryData, storeroomData]: [any[], any[]]) => {
          const inventoryItems: InventoryItem[] = inventoryData.map(
            (item: any) => ({
              category: item.category,
              quantity: item.quantity,
              name: item.name,
              barcode: item.barcode, // Include the barcode property
            })
          );
          const storeroomItems: InventoryItem[] = storeroomData.map(
            (item: any) => ({
              category: item.category,
              quantity: item.quantity,
              name: item.name,
              barcode: item.barcode, // Include the barcode property
            })
          );

          const allItems = [...inventoryItems, ...storeroomItems];
          const categories = Array.from(new Set(allItems.map((item) => item.name)));
          const totalQuantities: TotalQuantitiesData[] = categories.map((category) => {
            const categoryItems = allItems.filter((item) => item.name === category);
            const totalQuantity = categoryItems.reduce((acc, curr) => acc + curr.quantity, 0);
            return { category, totalQuantity };
          });

          return totalQuantities;
        })
      )
      .subscribe((totalQuantities: TotalQuantitiesData[]) => {
        const ctx = document.getElementById('totalQuantitiesChart') as HTMLCanvasElement;
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: totalQuantities.map((item) => item.category),
            datasets: [
              {
                data: totalQuantities.map((item) => item.totalQuantity),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
              },
            ],
          },
        });
      });
  }
}