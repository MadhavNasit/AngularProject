import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/shared/home.service';
import { project } from 'src/app/models/project';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { GridApi } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})

export class ProjectsComponent implements OnInit {
  public rowSelection;
  public rowGroupPanelShow;
  public pivotPanelShow;
  public paginationPageSize;
  gridApi: GridApi;
  public cacheOverflowSize;
  public cacheBlockSize;
  public rowModelType;
  public maxConcurrentDatasourceRequests;
  public maxBlocksInCache;
  public infiniteInitialRowCount;
  public domLayout;
  projectsList : project[] = [];
  
  constructor(private service:HomeService, private toastr:ToastrService, private router: Router,private spinner: NgxSpinnerService) {
    this.rowSelection = 'multiple';
    this.rowGroupPanelShow = 'always';
    this.paginationPageSize = 5;
    this.domLayout = 'autoHeight';  
  }

  columnDefs = [
    colDefName,
    colDefDuration,
    colDefCost,
    colDefDate,
    colDefDelete,
    colDefEdit
];

  ngOnInit() {
    this.loadProjects();
  }
  
  loadProjects()
  {
    this.spinner.show();
    this.service.getProjects().subscribe(
      (res: any)=>{
        if (res.status !== "failed") {
          this.projectsList = res;
        }
        else {
          this.projectsList = [];
          this.toastr.error(res.message,'Error!');
        }
      this.spinner.hide();
    },
    err => {
      this.spinner.hide();
      this.toastr.error('Something went wrong.', 'Sorry!');
      console.log(err);
  })
  }
  alert2(ev: any){
    console.log(ev);
    if(ev.colDef.headerName == "Delete"){
        this.deleteproject(ev.value);
    }
  }
  deleteproject(id)
  {
    this.spinner.show();
    const ans = confirm('Do you want to delete project with id: ' + id);
    if (ans) {
      this.service.deleteProject(id).subscribe(
        (res:any) => {
          console.log(res);
          if (res.body.status == "success") {
            this.loadProjects();
            this.toastr.success(res.body.message,'Deleted!');
          }
          else {
            this.toastr.error(res.body.message,'Error!');
          }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        this.toastr.error('Something went wrong.', 'Sorry!');
        console.log(err);
    });
    }
  }
  onGridReady(params) {
    this.gridApi = params.api; 
  }
  onPageSizeChanged() {
    var value = (<HTMLInputElement>document.getElementById('page-size')).value;
    this.cacheBlockSize = 2;
    this.gridApi.paginationSetPageSize(Number(value));
  }
  

  onBtnExport() {
    var params = getParams();
    if (params.suppressQuotes || params.columnSeparator) {
      alert(
        'NOTE: you are downloading a file with non-standard quotes or separators - it may not render correctly in Excel.'
      );
    }
    this.gridApi.exportDataAsCsv(params);
  }

  onBtApply() {
    var cols = [];
    if (getBooleanValue('#projectName')) {
      cols.push(colDefName);
    }
    if (getBooleanValue('#duration')) {
      cols.push(colDefDuration);
    }
    if (getBooleanValue('#cost')) {
      cols.push(colDefCost);
    }
    if (getBooleanValue('#date')) {
      cols.push(colDefDate);
    }
    cols.push(colDefDelete);
    cols.push(colDefEdit);
    this.gridApi.setColumnDefs(cols);
  }

  onBtnUpdate() {
    (<HTMLInputElement>document.querySelector('#csvResult')).value = this.gridApi.getDataAsCsv(
      getParams()
    );
  }

}

var colDefName = {headerName: 'Project Name', field: 'projectName',hide: false, sortable: true, filter: true,resizable: true,headerCheckboxSelection: true,
  headerCheckboxSelectionFilteredOnly: true,
  checkboxSelection: true};

var colDefDuration = {headerName: 'Duration', field: 'duration',hide: false,width: 153, sortable: true, filter: 'agNumberColumnFilter',resizable: true};
var colDefCost = {headerName: 'Cost', field: 'cost', sortable: true,hide: false,width: 154, filter: 'agNumberColumnFilter',resizable: true};
var colDefDate = {headerName: 'Date(mm/dd/yyyy)', field: 'projectDate',hide: false, sortable: true, filter: 'agDateColumnFilter',resizable: true,
cellRenderer: (data) => {
  return data.value ? (new Date(data.value)).toLocaleDateString() : ''
}
};
var colDefDelete = {headerName: 'Delete', field: 'id',width: 100,
cellRenderer : data =>
{
    let eIconGui = document.createElement('span'); 
    return '<button class="btn btn-danger btn-sm">Delete</button>';  
}
};
var colDefEdit = {headerName: 'Edit', field: 'id',width: 80,
cellRenderer : data =>
{
    let eIconGui = document.createElement('span'); 
    return '<a _ngcontent-fpx-c57="" class="btn btn-primary btn-sm" ng-reflect-router-link="/home/addproject/,'+data.data.id+'" href="/home/addproject/'+data.data.id+'">Edit</a>';  
}
};

function getBooleanValue(checkboxSelector) {
  return document.querySelector(checkboxSelector).checked;
}
function getValue(inputSelector) {
  var text = document.querySelector(inputSelector).value;
  console.log("Text:"+text);
  switch (text) {
    case 'string':
      return (
        'Here is a comma, and a some "quotes". You can see them using the\n' +
        'api.getDataAsCsv() button but they will not be visible when the downloaded\n' +
        'CSV file is opened in Excel because string content passed to\n' +
        'customHeader and customFooter is not escaped.'
      );
    case 'array':
      return [
        [],
        [
          {
            data: {
              value: 'Here is a comma, and a some "quotes".',
              type: 'String',
            },
          },
        ],
        [
          {
            data: {
              value:
                'They are visible when the downloaded CSV file is opened in Excel because custom content is properly escaped (provided that suppressQuotes is not set to true)',
              type: 'String',
            },
          },
        ],
        [
          {
            data: {
              value: 'this cell:',
              type: 'String',
            },
            mergeAcross: 1,
          },
          {
            data: {
              value: 'is empty because the first cell has mergeAcross=1',
              type: 'String',
            },
          },
        ],
        [],
      ];
    case 'none':
      return;
    case 'tab':
      return '\t';
    case 'true':
      return true;
    case 'none':
      return;
    default:
      return text;
  }
}


function getParams() {
  return {
    suppressQuotes: getValue('#suppressQuotes'),
    columnSeparator: getValue('#columnSeparator'),
    customHeader: getValue('#customHeader'),
    customFooter: getValue('#customFooter'),
    onlySelected: getBooleanValue('#onlySelected')
  };
  
}
