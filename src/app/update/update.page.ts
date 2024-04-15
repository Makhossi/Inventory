import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { LoadingController, NavController, ToastController } from '@ionic/angular';



@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {
  barcode!: string; // Variable to hold the ID of the inventory item
  itemName: string = '';
  itemDeliver: string = '';
  itemCategory: string = '';
  itemDescription: string = '';
  itemQuantity: number = 0;
  selectedFile: File | null = null;
  productInfor: any;
  imageBase64: any;
  toggleChecked: boolean = false;
  imageUrl: any;
  imageInfor:any;
  newImage :any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: AngularFirestore,
    private fireStorage: AngularFireStorage,
    private navCtrl: NavController
  ) {
    
  }

  ngOnInit() {
    this.getPassedData();
    document.querySelector('body')?.classList.remove('scanner-active'); 
  }

  goBack() {
    this.navCtrl.back();
  }

  async scanBarcode() {
    document.querySelector('body')?.classList.add('scanner-active');
    await BarcodeScanner.checkPermission({ force: true });
    // make background of WebView transparent
    // note: if you are using ionic this might not be enough, check below
    //BarcodeScanner.hideBackground();
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
    // if the result has content
    if (result.hasContent) {
      this.barcode = result.content;
      console.log(result.content); // log the raw scanned content
    }
  }

  async deleteFileIfExists(url: string): Promise<void> {
    if (url) {
      try {
        const fileRef = this.fireStorage.storage.refFromURL(url);
        await fileRef.delete();
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  }
  
  async updateItem() {


if(this.imageBase64){
  await this.deleteFileIfExists.call(this, this.productInfor.imageUrl);
  this.imageUrl = await this.uploadImage(this.imageBase64);
}


   
    // Check if there's an existing item with the same name in the inventory collection
    const existingItemQueryStore = await this.firestore
      .collection('storeroomInventory')
      .ref.where('barcode', '==', this.barcode)
      .get();
    if (!existingItemQueryStore.empty) {
      // Update the quantity of the existing item in the storeroomInventory collection
      const existingItemDoc = existingItemQueryStore.docs[0];
      const existingItemData: any = existingItemDoc.data();
      await existingItemDoc.ref.update({
        name: this.itemName,
        deliver: this.itemDeliver,
        category: this.itemCategory,
        description: this.itemDescription,
        barcode:this.barcode,
        quantity: this.itemQuantity,
        timestamp: new Date(), 
        imageUrl: this.imageUrl
      
        // Add timestamp });
        //console.log("Storeroom Inventory Updated (Plused)");
      });
    }
  }

  toggleMode() {
    if (this.toggleChecked) {
      this.barcode = ''; // Clear the barcode value when switching to input mode
      BarcodeScanner.showBackground();
      BarcodeScanner.stopScan();
      document.querySelector('body')?.classList.remove('scanner-active'); 
    }
  }
  clearFields() {
    this.itemName = '';
    this.itemCategory = '';
    this.itemDescription = '';
    this.itemQuantity = 0;
    this.selectedFile = null;
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      this.selectedFile = inputElement.files[0];
    }
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });
    this.imageBase64 = image.base64String;
    this.newImage = `data:image/jpeg;base64,${image.base64String}`;
  }

  async uploadImage(file: string) {
    const fileName = Date.now().toString();
    const filePath = `images/${fileName}`;
    const fileRef = this.fireStorage.ref(filePath);
    const uploadTask = fileRef.putString(file, 'base64', {
      contentType: 'image/jpeg',
    });
    const snapshot = await uploadTask;
    return snapshot.ref.getDownloadURL();
  }

  async getPassedData() {
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.productInfor = await this.router.getCurrentNavigation()?.extras.state;
      console.log(this.productInfor);
      this.barcode = this.productInfor.barcode; // Variable to hold the ID of the inventory item
      this.itemName = this.productInfor.name;
      this.itemCategory = this.productInfor.category;
      this.itemDescription = this.productInfor.description;
      this.itemQuantity = this.productInfor.quantity;
      this.newImage = this.productInfor.imageUrl;
    this.imageUrl =this.productInfor.imageUrl
    }
  }
}