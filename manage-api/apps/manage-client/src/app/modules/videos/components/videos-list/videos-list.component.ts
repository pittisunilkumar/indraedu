import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleModulesEnum, RoleSubModulesEnum, VideoInterface, VideoSubjectChapterInterface } from '@application/api-interfaces';
import { HelperService, RolesService,VideosRepositoryService } from '@application/ui';
import { CopyMoveVideosComponent } from '../copy-move-videos/copy-move-videos.component';

@Component({
  selector: 'application-videos-list',
  templateUrl: './videos-list.component.html',
  styleUrls: ['./videos-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideosListComponent implements OnInit, OnChanges {

  @Input() chapters: VideoSubjectChapterInterface[];
  @Output() delete = new EventEmitter<VideoInterface>();
  @Output() chapterDelete = new EventEmitter<VideoSubjectChapterInterface>();
  @Output() multipletDelete = new EventEmitter<VideoSubjectChapterInterface>();
  videos: VideoInterface[];
  // videoListData: VideoInterface[];
  filteredList: VideoSubjectChapterInterface[] | any;
  // videoList: VideoSubjectChapterInterface[];

  selectedList: any = [];
  allSelected = [];
  allComplete = [];
  Indeterminate = [];
  isBtnEnabled = [];

  selectedChapterList: any = [];
  allChapterSelected = false;
  allChapterComplete: boolean = false;
  ChapterIndeterminate = false;
  isChapterBtnEnabled: boolean;

  index: number
  // list:QBankInterface[];
  selectedChapterCount: number;
  selectedVideoCount = [];

  isChapterVisible:boolean;
  editVideoEnable:boolean;
  deleteVideoEnabled:boolean;
  viewVideoEnable:boolean;
  addVideoEnable:boolean;


  isInputEnabled: boolean;
  isChangeBtnEnabled: boolean;
  isChapterChangeBtnEnabled: boolean;
  orderType: string;
  list:any;
  videoSubjectUuid:string;

  constructor(
    public helper: HelperService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private roleService: RolesService,
    private videosRepositoryService:VideosRepositoryService
  ) { }

  ngOnInit() {
    this.videoSubjectUuid =window.localStorage.getItem('videoSubjectUuid');
    this.loadPermissions()
  }

  loadPermissions() {
    let modules = this.helper.enumtoArray(RoleModulesEnum);
    let subM = this.helper.enumtoArray(RoleSubModulesEnum);
    let role = localStorage.getItem('role');
    let roleData = JSON.parse(localStorage.getItem('roleData'));

    if (role) {
      // this.roleService.getRoleById(role).subscribe(r => {
        roleData[0].rolePermissions.map(res => {
          if (res.module[0].title === modules.type.VIDEO_CHAPTERS){
            res.subModules.map(e => {
              if (e.title == subM.type.DELETE) {
                this.isChapterVisible = true;
              }
            })
          }
          else if (res.module[0].title === modules.type.VIDEOS){
            res.subModules.map(e => {
              if (e.title == subM.type.EDIT) {
                this.editVideoEnable = true;
              }
              else if (e.title == subM.type.DELETE) {
                this.deleteVideoEnabled = true;
              }
              else if (e.title == subM.type.VIEW) {
                this.viewVideoEnable = true;
              }
              else if (e.title == subM.type.ADD) {
                this.addVideoEnable = true;
              }
            })
          }
        })
      // })
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Assign the data to the data source for the table to render
    if (changes?.chapters?.currentValue) {
      this.chapters = this.filteredList = changes?.chapters?.currentValue;
      this.filteredList.map(res=>{
        res.disabled = true;
        res.videos.map(vid=>{vid.disabled= true})
      })

      console.log('this.filteredList', this.filteredList);
    }
  }

  filterList(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue) {
      this.filteredList = this.chapters.filter((vid) => {
        return vid.title.toLowerCase().includes(filterValue.toLowerCase());
      });
    } else {
      this.filteredList = this.chapters;
    }
  }

  drop(event: CdkDragDrop<string[]>,videos) {
    if (this.orderType == 'dragAndDrop') {
      this.list = videos;
      this.isChangeBtnEnabled = true;
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }
      this.list.map((res, i) => {
        this.list[i].order = i + 1;
        // this.list[i].youtubeUrl = ""
        this.list[i].notes =res.notes?res.notes.toString():''
      })
      console.log('this.list',this.list);
      
    }
  }

  dropChapters(event: CdkDragDrop<string[]>,videos) {
    if (this.orderType == 'dragAndDrop') {
      this.isChapterChangeBtnEnabled = true;
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }
      this.chapters.map((res, i) => {
        this.chapters[i].order = i + 1;
        // this.list[i].pdf = res.pdf?res.pdf:{};
        // this.list[i].icon = res.icon?res.icon:{};
      })
    }
  }

  selectChapterOrderType(event) {
    this.orderType = event.value;
    if (this.orderType == 'type') {
      this.isInputEnabled = true;
      this.isChapterChangeBtnEnabled = true;
    }
    else if (this.orderType == 'dragAndDrop') {
      this.isInputEnabled = false;
      this.filteredList.map(res=>{res.disabled = false})

      // this.isChapterChangeBtnEnabled = true;
    }
  }

  selectOrderType(event) {
    this.orderType = event.value;
    if (this.orderType == 'type') {
      this.isInputEnabled = true;
      this.isChangeBtnEnabled = true;
    }
    else if (this.orderType == 'dragAndDrop') {
      this.isInputEnabled = false;
      this.isChangeBtnEnabled = true;
      this.filteredList.map(res=>{
        res.videos.map(vid=>{vid.disabled= false})
      })
    }
  }
  updateVideoOrder(chapter) {
    console.log('this.list',this.list);
    let videoPayload = {
      from_subject: this.videoSubjectUuid,
      from_chapter: chapter.uuid,
      videos: this.list
    }
    console.log(videoPayload);
    if(videoPayload){
      this.videosRepositoryService.dragAndDropVideos(videoPayload).subscribe(data => { 
        if(data){
          window.location.reload();
          // this._location.back()
        }
      })
    }
  }

  updateChapterOrder() {
    console.log('this.chapters',this.chapters);
    let chapterPayload = {
      from_subject: this.videoSubjectUuid,
      chapters: this.chapters
    }
    console.log(chapterPayload);
    if(chapterPayload){
      this.videosRepositoryService.dragAndDropVideoChapters(chapterPayload).subscribe(data => { 
        if(data){
          window.location.reload();
          // this._location.back()
        }
      })
    }
  }

  getVideos(videos:VideoInterface[],index){
     this.videos = videos;
  }

  filterVideoList(event: any, index: number) {
  
    const filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue) {
      this.filteredList[index].videos = this.chapters[index].videos.filter((vid) => {
        return ( vid.title.toLowerCase().includes(filterValue.toLowerCase()) || 
        vid.videoId.toLowerCase().includes(filterValue.toLowerCase()) );
      });
    } else {
      this.filteredList[index].videos = this.videos
    }

  }

  editVideo(video: VideoInterface, chapter) {
    window.localStorage.setItem('videoChapterUuid', chapter.uuid)
    return this.router.navigate(['../', video.uuid, 'edit'], { relativeTo: this.route });
  }
  getChapterUUid(chapter,index) {
    this.index = index;
    window.localStorage.removeItem('videoChapterUuid');
    window.localStorage.removeItem('videoChapterName');
    window.localStorage.setItem('videoChapterUuid',chapter.uuid);
    window.localStorage.setItem('videoChapterName',chapter.title);
  }

  toggleVideos(event, video) {
    const Videouuid = video.uuid;
    let index: number;
    if (event.checked) {
      this.selectedList = [...this.selectedList, video];
    }
    else {
      this.selectedList?.filter((it, ind) => {
        if (it.uuid === Videouuid) {
          index = ind;
        }
      });
      this.selectedList?.splice(index, 1);
    }
    this.checkBoxChecked();
    this.selectedVideoCount[this.index] = this.selectedList.length;
    console.log(this.selectedList);
  }

  setAll(completed: boolean, index: number) {
    // this.index = index;
    console.log(this.index);

    this.selectedList = []
    if (completed == true) {
      this.allSelected[index] = true;
      this.filteredList[this.index].videos.map(res => {
        const arr = this.selectedList?.filter(it => it.uuid === res.uuid);
        if (!arr?.length) {
          this.selectedList?.push(res);
        }
      })
    }
    else {
      this.allSelected[index] = false
      this.selectedList = []
    }
    this.checkBoxChecked();
    this.selectedVideoCount[index] = this.selectedList.length;
    console.log(this.selectedList);
  }

  checkBoxChecked() {
    if (this.filteredList[this.index].videos.length == this.selectedList.length) {
      this.Indeterminate[this.index] = false
      this.allComplete[this.index] = true
      this.isBtnEnabled[this.index] = true
    }
    else {
      if (this.selectedList.length == 0) {
        this.Indeterminate[this.index] = false;
        this.allComplete[this.index] = false;
        this.isBtnEnabled[this.index] = false;
      }
      else if (this.selectedList.length > 0) {
        this.Indeterminate[this.index] = true;
        this.isBtnEnabled[this.index] = true
      }
    }
  }

  toggleChapter(event, chapter) {
    const Chapteruuid = chapter.uuid;
    let index: number;
    if (event.checked) {
      this.selectedChapterList = [...this.selectedChapterList, chapter];
    }
    else {
      this.selectedChapterList?.filter((it, ind) => {
        if (it.uuid === Chapteruuid) {
          index = ind;
        }
      });
      this.selectedChapterList?.splice(index, 1);
    }
    this.chapterCheckBoxChecked();
    this.selectedChapterCount = this.selectedChapterList.length;
    console.log(this.selectedChapterList);
  }

  setAllChapters(completed: boolean) {
    // this.index = index;
    // console.log(this.index);
    this.selectedChapterList = []
    if (completed == true) {
      this.allChapterSelected = true;
      this.filteredList.map(res => {
        const arr = this.selectedChapterList?.filter(it => it.uuid === res.uuid);
        if (!arr?.length) {
          this.selectedChapterList?.push(res);
        }
      })
    }
    else {
      this.allChapterSelected = false
      this.selectedChapterList = []
    }
    this.chapterCheckBoxChecked();
    this.selectedChapterCount = this.selectedChapterList.length;
    console.log(this.selectedChapterList);
  }

  chapterCheckBoxChecked() {
    if (this.filteredList.length == this.selectedChapterList.length) {
      this.ChapterIndeterminate = false
      this.allChapterComplete = true
      this.isChapterBtnEnabled = true
    }
    else {
      if (this.selectedChapterList.length == 0) {
        this.ChapterIndeterminate = false;
        this.allChapterComplete = false;
        this.isChapterBtnEnabled = false;
      }
      else if (this.selectedChapterList.length > 0) {
        this.ChapterIndeterminate = true;
        this.isChapterBtnEnabled = true
      }
    }
  }

  copyVideos() {
    const dialogRef = this.dialog.open(CopyMoveVideosComponent, {
      data: { payload: this.selectedList, copyMode: 'videos', type: 'copy' },
      height: '60%'
    });
  }
  moveVideos() {
    const dialogRef = this.dialog.open(CopyMoveVideosComponent, {
      data: { payload: this.selectedList, copyMode: 'videos', type: 'move' },
      height: '60%'
    });
  }
  // multipletDeleteVideos() {
    // this.multipletDelete.emit(this.selectedList);
    // this.isBtnEnabled = false;
  // }

  copyChapters() {
    const dialogRef = this.dialog.open(CopyMoveVideosComponent, {
      data: { payload: this.selectedChapterList, copyMode: 'chapters', type: 'copy' },
      height:'50%'
    });
  }
  moveChapters() {
    const dialogRef = this.dialog.open(CopyMoveVideosComponent, {
      data: { payload: this.selectedChapterList, copyMode: 'chapters', type: 'move' },
      height:'50%'
    });
  }
  // multipletDeleteChapters() {
  //   this.multipletDelete.emit(this.selectedChapterList);
  //   this.isChapterBtnEnabled = false;
  // }

}
