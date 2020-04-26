import { Component,ViewChild} from '@angular/core';  
import { ChartType, ChartOptions ,ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import{CSVRecord} from 'src/CSVModel/CSVRecord';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})

export class PieChartComponent {

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
    
      yAxes: [{
        ticks: {
          min: 0,
          max: 100,
        }
      }]
    }
    
  };
  public records: any[] = [];  
  public ageArr:any[] =[];
  public labelArr:any[] =[];
  public x :any ;
  @ViewChild('csvReader') csvReader: any;  
  public pieChartLabels: Label;
  public pieChartData: SingleDataSet ;
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  barChartLabels: Label;
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins =[];
   
  barChartData: ChartDataSets [];
  constructor() {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }
  
  uploadListener($event: any): void {  
  
    let text = [];  
    let files = $event.srcElement.files;  
  
    if (this.isValidCSVFile(files[0])) {  
  
      let input = $event.target;  
      let reader = new FileReader();  
      reader.readAsText(input.files[0]);  
  
      reader.onload = () => {  
        let csvData = reader.result;  
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray);  
  
        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);  
      };  
  
      reader.onerror = function () {  
        console.log('error is occured while reading file!');  
      };  
  
    } else {  
      alert("Please import valid .csv file.");  
      this.fileReset();  
    }  
  }  
  
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
    let csvArr = [];  
    this.x=-1;
  
    for (let i = 1; i < csvRecordsArray.length; i++) {  

      let curruntRecord = (<string>csvRecordsArray[i]).split(';');  
      
      if (curruntRecord.length == headerLength) {  
        this.x++;
        let csvRecord: CSVRecord = new CSVRecord();  
        csvRecord.id = curruntRecord[0].trim();  
        csvRecord.firstName = curruntRecord[1].trim();  
        csvRecord.lastName = curruntRecord[2].trim();  
        csvRecord.age = curruntRecord[3].trim();  
       this.labelArr[this.x]=curruntRecord[1].trim();
        this.ageArr[this.x]=curruntRecord[3].trim();  
        csvRecord.position = curruntRecord[4].trim();  
        csvRecord.mobile = curruntRecord[5].trim();  
        csvArr.push(csvRecord);  
       
      }  
    }  
    this.pieChartData= this.ageArr;
    this.pieChartLabels=this.labelArr;
    this.barChartLabels=this.labelArr;
   this.barChartData =[{ data: this.ageArr, label: 'Age' }];
    return csvArr; 
    
    
  }  
  
  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  }  
  
  getHeaderArray(csvRecordsArr: any) {  
    let headers = (<string>csvRecordsArr[0]).split(';');  
    let headerArray = [];  
    for (let j = 0; j < headers.length; j++) {  
      headerArray.push(headers[j]);  
    }  
    return headerArray;  
  }  
  
  fileReset() {  
    this.csvReader.nativeElement.value = "";  
    this.records = [];  
  }  

}