import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize } from 'rxjs/operators';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.page.html',
  styleUrls: ['./add-inventory.page.scss'],
})
export class AddInventoryPage implements OnInit {

  itemName: string = '';
  itemCategory: string = '';
  itemDescription: string = '';
  itemQuantity = 0;
  pickersDetails: string = '';
  dateOfPickup: string = '';
  timeOfPickup: string = '';
  barcode: string = '';
  imageBase64: any;
  imageUrl: string | null = null;
  cart: any[] = []; 
  qrCodeIdentifire:any;
  userRole: string = '';
  products: any[] = [];
  selectedProduct: any; 
  selectedProductDescription: any;
  


 // Variable to hold the barcode value
 toggleChecked: boolean = false; 


  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private loadingController: LoadingController,
   private  ToastController: ToastController,  private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.getUser().subscribe((user: any) => {
      if (user.exists) {
        this.userRole = user.data().role;
      }
    });
  }

  getUser(): Observable<any> {
    // Modify this according to your actual implementation
    // For example, if user details are stored in Firestore
    return this.firestore.collection('Users').doc('userId').get();
  }

  // fetchProductsByCategory(category: string) {
  //   this.firestore.collection('storeInventory', ref => ref.where('category', '==', category)).valueChanges().subscribe((products: any[]) => {
  //     this.products = products;
  //   });
  // }

  // Function to fetch products based on selected category
  fetchProductsByCategory(category: string) {
    this.firestore.collection('storeInventory', ref => ref.where('category', '==', category)).valueChanges().subscribe((products: any[]) => {
      this.products = products;
      // Reset selected product and description when category changes
      this.selectedProduct = null;
      this.selectedProductDescription = null;
    });
  }

  // Function to fetch description of the selected product
  fetchProductDescription(productName: string) {
    this.firestore.collection('storeInventory', ref => ref.where('name', '==', productName)).valueChanges().subscribe((products: any[]) => {
      if (products.length > 0) {
        this.selectedProductDescription = products[0].description;
      } else {
        this.selectedProductDescription = ''; // Set description to empty if product not found
      }
    });
  }

  async searchProductByBarcode() {
    if (this.barcode.trim() === '') {
      // If the barcode input is empty, clear other input fields
      this.clearFieldsExceptBarcode();
      return;
    }
  
    // Search for the product with the entered barcode in Firestore
    const querySnapshot = await this.firestore
      .collection('storeroomInventory')
      .ref.where('barcode', '==', this.barcode.trim())
      .limit(1)
      .get();
  
    if (!querySnapshot.empty) {
      // If a product with the entered barcode is found, populate the input fields
      const productData:any = querySnapshot.docs[0].data();
      this.itemName = productData.name;
      this.itemCategory = productData.category;
      this.itemDescription = productData.description;
      // You can similarly populate other input fields here
    } else {
      // If no product with the entered barcode is found, clear other input fields
      this.clearFieldsExceptBarcode();
      this.presentToast('Product not found',);
    }
  }
  
  clearFieldsExceptBarcode() {
    // Clear all input fields except the barcode input
    this.itemName = '';
    this.itemCategory = '';
    this.itemDescription = '';
    // Clear other input fields here
  }


  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });
    this.imageBase64 = image.base64String;
  }

  async uploadImage(file: string) {
    const fileName = Date.now().toString();
    const filePath = `images/${fileName}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = fileRef.putString(file, 'base64', {
      contentType: 'image/jpeg',
    });
    const snapshot = await uploadTask;
    return snapshot.ref.getDownloadURL();
  }
  
  async scanBarcode() {
    document.querySelector('body')?.classList.add('scanner-active');
    await BarcodeScanner.checkPermission({ force: true });
    // make background of WebView transparent
    // note: if you are using ionic this might not be enough, check below
    BarcodeScanner.hideBackground();
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
    // if the result has content
    if (result.hasContent) {
      this.barcode = result.content;
      console.log(result.content); // log the raw scanned content
      this.toggleChecked=true;
    }
  }

toggleMode() {
  if (this.toggleChecked) {
    this.barcode = ''; // Clear the barcode value when switching to input mode
  }
}

  async addItem() {
    let itemQuantity=0;
    const loader = await this.loadingController.create({
      message: 'Adding Inventory...',
    });
    await loader.present();

    try {
      if (this.imageBase64) {
        this.imageUrl = await this.uploadImage(this.imageBase64);
      }
      const userEmail = await this.firestore.collection('Users').ref.where('email', '==', this.pickersDetails).get();
   console.log(userEmail)
      if (userEmail.empty) {
        this.presentToast("this delivery guy is not no our system");
        console.log("this delivary guy is not no our system");
        return;
      }


  // Check if there is an existing item with the same barcode in the storeroomInventory collection
  const existingItemQuery = await this.firestore.collection('storeroomInventory').ref.where('barcode', '==', this.barcode).get();
  if (!existingItemQuery.empty) {
   // Update the quantity of the existing item in the storeroomInventory collection
    const existingItemDoc = existingItemQuery.docs[0];
    const existingItemData: any = existingItemDoc.data();
    if (existingItemData.quantity < this.itemQuantity) {
      // Show an alert if the stock is insufficient
     this.presentToast('Insufficient Stock, The stock for this item is insufficient. the are '+existingItemData.quantity+' available');
      return;
  }
    const updatedQuantity = existingItemData.quantity - this.itemQuantity;
    console.log(existingItemData.quantity);
    console.log( updatedQuantity);
    itemQuantity = existingItemData.quantity;

    await existingItemDoc.ref.update({ quantity: updatedQuantity });
    console.log("Storeroom Inventory Updated (Minused)")
   
  } else{
    this.presentToast("this product barcode does  not match any on our storeroom")
    return;
  }
///////////////////////////////////////
// Check if there's an existing item with the same name in the inventory collection
const existingItemQueryStore = await this.firestore.collection('inventory').ref.where('barcode', '==', this.barcode).get();
if (!existingItemQueryStore.empty) {
 // Update the quantity of the existing item in the storeroomInventory collection
  const existingItemDoc = existingItemQuery.docs[0];
  const existingItemData: any = existingItemDoc.data();
  const updatedQuantity = existingItemData.quantity + this.itemQuantity;
  this.itemQuantity += updatedQuantity
  await existingItemDoc.ref.update({ quantity: updatedQuantity });
  console.log("Storeroom Inventory Updated (Plused)");
  return
 
} 


      const newItem = {
        name: this.itemName,
        category: this.itemCategory,
        description: this.itemDescription,
        imageUrl: this.imageUrl || '',
        quantity: this.itemQuantity,
        pickersDetails: this.pickersDetails,
        dateOfPickup: this.dateOfPickup,
        timeOfPickup: this.timeOfPickup,
        barcode: this.barcode || '',
        timestamp: new Date(),
      };
      this.cart.push(newItem);
      this.presentToast('Item added to cart');
      await this.firestore.collection('inventory').add(newItem);
      this.clearFields();
    } catch (error) {
      console.error('Error adding inventory:', error);
      // Handle error
    } finally {
      loader.dismiss();
    }
  }

  

  async generateSlip() {
    const loader = await this.loadingController.create({
      message: 'Generating Slip...',
    });
    await loader.present();
  
    try {
      // Create a slip document in Firestore
      const slipData = {
        date: new Date(),
        items: this.cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          category: item.category,
          description: item.description,
          imageUrl: item.imageUrl,
          pickersDetails: item.pickersDetails,
          dateOfPickup: item.dateOfPickup,
          timeOfPickup: item.timeOfPickup,
          barcode: item.barcode,
        })),
      };
      await this.firestore.collection('slips').add(slipData);
  
      // Clear the cart after generating the slip
      this.cart = [];
  
      // Show success toast notification
      this.presentToast('Slip generated successfully');
    } catch (error) {
      console.error('Error generating slip:', error);
      // Handle error
    } finally {
      loader.dismiss();
    }
   
  0
    
  }





  clearFields() {
    this.itemName = '';
    this.itemCategory = '';
    this.itemDescription = '';
    this.itemQuantity = 0;
    this.pickersDetails = '';
    this.dateOfPickup = '';
    this.timeOfPickup = '';
    this.barcode = '';
    this.imageBase64 = null;
    this.imageUrl = null;
  }


  async presentToast(message: string) {
    const toast = await this.ToastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}
