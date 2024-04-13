import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize } from 'rxjs/operators';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
const pdfMake = require('pdfmake/build/pdfmake.js');


@Component({
  selector: 'app-add-inventory-storeroom',
  templateUrl: './add-inventory-storeroom.page.html',
  styleUrls: ['./add-inventory-storeroom.page.scss'],
})
export class AddInventoryStoreroomPage implements OnInit {

  itemName: string = '';
  itemCategory: string = '';
  itemDescription: string = '';
  itemQuantity: number = 0;
  pickersDetails: string = '';
  dateOfPickup: string = '';
  timeOfPickup: string = '';
  barcode: string = '';
  imageBase64: any;
  imageUrl: string | null = null;
  cart: any[] = []; 
  toggleChecked: boolean = false; 
  currentDate: Date;
  currentTime: string;
  phone:any;
  Cumpany:any;
  pickersDetailsEmail:any;



  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private loadingController: LoadingController,
   private  ToastController: ToastController,  private alertController: AlertController,
  
  ) {
    this.currentDate = new Date();
    this.currentTime = this.currentDate.toLocaleTimeString("en-US", {
      hour12: false,
    });
  }

  ngOnInit() {
    document.querySelector('body')?.classList.remove('scanner-active'); 
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
  

  async scanBarcode(){
    await BarcodeScanner.checkPermission({ force: true });
  
    // make background of WebView transparent
    // note: if you are using ionic this might not be enough, check below
   // BarcodeScanner.hideBackground();
    
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
  
    // if the result has content
    if (result.hasContent) {
      this.barcode = result.content;
      console.log(result.content);
      document.querySelector('body')?.classList.remove('scanner-active'); // log the raw scanned content
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
  



  async addItem() {

    this.checkBookingDateTime(this.currentDate,this.currentTime);


    const loader = await this.loadingController.create({
      message: 'Adding Inventory...',
    });
    await loader.present();

    try {
      if (this.imageBase64) {
        this.imageUrl = await this.uploadImage(this.imageBase64);
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
        location:"storeroom",
        pickersDetailsEmail:this.pickersDetailsEmail,
        phone :this.phone,
        Cumpany:this.Cumpany
      };
      this.cart.push(newItem);
      console.log(this.cart);
      this.presentToast('Item added to cart','success');
      await this.firestore.collection('storeroomInventory').add(newItem);
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
  console.log("data",this.cart)
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
          pickersDetailsEmail:this.pickersDetailsEmail,
          phone :this.phone,
          Cumpany:this.Cumpany
        })),
      };
      await this.firestore.collection('slips').add(slipData);
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
     // Calculate column widths based on content length


// Define PDF content
// Define PDF content
// Define PDF content
const docDefinition = {
  content: [
      {
          text: 'BEST BRIGHT', // Adding the company name to the header
          style: 'companyName'
      },
      {
          text: 'Invoice',
          style: 'header'
      },
      {
          text: `Date: ${new Date().toLocaleDateString()}`,
          style: 'subheader'
      },
      {
          table: {
              headerRows: 1,
              widths: [ 76, 76,76,76,76,76 ],
              body: [
                  [
                      { text: 'Name', style: 'tableHeader' },
                      { text: 'Category', style: 'tableHeader' },
                      { text: 'Description', style: 'tableHeader' },
                      { text: 'Quantity', style: 'tableHeader' },
                      { text: 'Picker\'s Details', style: 'tableHeader' },
                      { text: 'Barcode', style: 'tableHeader' }
                  ],
                  ...this.cart.map(item => [
                      item.name,
                      item.category,
                      item.description,
                      item.quantity.toString(),
                      item.pickersDetails,
                      item.barcode
                  ])
              ]
          }
      }
  ],
  styles: {
      header: {
          fontSize: 24,
          bold: true,
          margin: [0, 0, 0, 10],
          alignment: 'center',
          color: '#007bff' // Blue color for the header
      },
      subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 10]
      },
      tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
          alignment: 'center'
      },
      companyName: { // Style for the company name
          fontSize: 28,
          bold: true,
          margin: [0, 0, 0, 20], // Adjust margin to separate company name from header
          alignment: 'center',
          color: '#dc3545' // Red color for the company name
      }
  }
};




    // Generate PDF
    //pdfMake.createPdf(docDefinition).open();
    const pdfDocGenerator = await pdfMake.createPdf(docDefinition);
      // Clear the cart after generating the slip
      pdfDocGenerator.open();
      this.cart = [];
  
      // Show success toast notification
      this.presentToast('Slip generated successfully',"success");
    } catch (error) {
      console.error('Error generating slip:', error);
      // Handle error
    } finally {
      loader.dismiss();
    }
   
    


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


checkBookingDateTime(date: any, startTime: any): void {
  // Check if the date is in the past
  if (date >= this.currentDate.toISOString().split("T")[0]) {
    this.presentToast("date must be behind or must be current date.","warning");
    return;
  }

  if (!this.imageBase64){
    this.presentToast("Capture the image of the product","warning");
    return;
  }

  // Check if the time is in the past
}




async presentToast(message: string,color:string) {
  const toast = await this.ToastController.create({
    message: message,
    duration: 4000,
    position: 'middle',
    color:color
  });
  toast.present();
}
}